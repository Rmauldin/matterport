import { Scene, IObserver, Pointer, Mattertag, ISubscription, MpSdk } from "../../static/bundle/sdk";

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

  addTag(tagOptions?: Mattertag.MattertagDescriptor): void{
    if(this.tagSid) return;
    this.input.inputs.userNavigationEnabled = false;
    this.pointerSub = this.sdk.Pointer.intersection.subscribe(this);
    this._addTag(tagOptions).then( (tags: string[]) => {
      this.tagSid = tags[0];
    });
  }

  onChanged(data: Pointer.Intersection): void {
    if(!this.tagSid) return;
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

  onEvent(): void{
    if(!this.tagSid) return;
    this.tagSid = null;
    this.pointerSub.cancel();
    setTimeout(() => this.input.inputs.userNavigationEnabled = true, 300); // onEvent fires before the event propagates to the rest of Showcase
  }

  private async setupInput(){
    const inputNode = await this.sdk.Scene.createNode();
    this.input = inputNode.addComponent('mp.input');
    inputNode.start();
    this.input.spyOnEvent(this);
  }

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