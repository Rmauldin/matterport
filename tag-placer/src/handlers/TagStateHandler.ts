import { Scene, IObserver, Pointer, Mattertag, ISubscription, MpSdk } from "../../static/bundle/sdk";

/*
  This class handles the state and interactions when placing a transient Mattertag. It implements the event spy interface and observer interface for the pointer
*/

export class TagStateHandler implements Scene.IComponentEventSpy, IObserver<Pointer.Intersection>{
  eventType: string;
  tagSid: string|null;
  sdk: MpSdk;
  pointerSub: ISubscription;
  input: Scene.IComponent;
  stemScalar: number;

  constructor(sdk: MpSdk){
    this.eventType = "INTERACTION.POINTER_BUTTON";
    this.sdk = sdk;
    this.tagSid = null;
    this.stemScalar = .33;
    this.setupInput();
  }

  // main function entry point to initiate the placing state by disabling navigation, adding the tag, and updating the tag based on the cursor's position
  addTag(tagOptions?: Mattertag.MattertagDescriptor): void{
    if(this.tagSid) return;
    this.input.inputs.userNavigationEnabled = false;

    this._addTag(tagOptions)
    .then( (tags: string[]) => {
      this.tagSid = tags[0];
    })
    .then(() => {
      this.pointerSub = this.sdk.Pointer.intersection.subscribe(this);
    });
  }

  // from the Pointer observer interface. Updates the tag's position based on the data from the pointer subscription
  onChanged(data: Pointer.Intersection): void {
    this.sdk.Mattertag.editPosition(this.tagSid, {
      anchorPosition: data.position,
      stemVector: {
        x: data.normal.x * this.stemScalar,
        y: data.normal.y * this.stemScalar,
        z: data.normal.z * this.stemScalar,
      },
    });
  }

  notify(event): void {}

  // onEvent only runs when a click has been detected; part of the event spy listening to the mp.input component
  onEvent(): void{
    if(!this.tagSid) return;
    this.tagSid = null;
    this.pointerSub.cancel();
    setTimeout(() => this.input.inputs.userNavigationEnabled = true, 300); // 300ms to debounce clicks while in placement mode. Also waits for click to propagate through Showcase
  }

  // sets up mp.input component for controlling user navigation and spies on the input's click events
  private async setupInput(){
    const inputNode = await this.sdk.Scene.createNode();
    this.input = inputNode.addComponent('mp.input');
    inputNode.start();
    this.input.spyOnEvent(this);
  }

  // wrapper for add tag to include descriptor options if it's not supplied
  private _addTag(tagOptions?: Mattertag.MattertagDescriptor): Promise<string[]>{
    if(!tagOptions){
      tagOptions = {
        label: "New tag",
        description: "This tag was added through the Matterport SDK",
        anchorPosition: {
          x: 0,
          y: 0,
          z: 0,
        },
        stemVector: { // make the Mattertag stick straight up and make it 0.30 meters (~1 foot) tall
          x: 0,
          y: 0.30,
          z: 0,
        },
        color: { // blue disc
          r: 0.0,
          g: 0.0,
          b: 1.0,
        }
      } as Mattertag.MattertagDescriptor;
    }

    return this.sdk.Mattertag.add(tagOptions);
  }

}