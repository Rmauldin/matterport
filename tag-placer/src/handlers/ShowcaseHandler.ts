import { MpSdk, ShowcaseBundleWindow } from '../../static/bundle/sdk';
import { TagStateHandler } from './TagStateHandler';

/*
  The ShowcaseHandler class handles the connection to the SDK, manages additional SDK functionality class objects, and creates a button UI to activate the tag placement mode
*/

export class ShowcaseHandler{
  sdkKey: string;
  sdk: MpSdk;

  constructor(sdkKey: string){
    this.sdkKey = sdkKey;
  }
  // Load listener event for the Matterport iframe
  async handleEvent(event: Event): Promise<void>{
    const iframe = event.target as HTMLIFrameElement;
    this.sdk = await this.connectSdk(iframe);
    this.setupAddTag();
  }

  private connectSdk(iframe: HTMLIFrameElement): Promise<MpSdk>{
    const bundleWindow = iframe.contentWindow as ShowcaseBundleWindow;
    return bundleWindow.MP_SDK.connect(bundleWindow, this.sdkKey);
  }

  // Set up button and instantiate the tag handler
  private setupAddTag(){
    const button = document.createElement('button');
    button.id = "add-btn";
    button.innerText = "Add Tag";
    document.querySelector('.container').appendChild(button);

    const placer = new TagStateHandler(this.sdk);
    button.addEventListener("click", () =>{
       placer.addTag();
    });

  }

}