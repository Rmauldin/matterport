import { MpSdk, ShowcaseBundleWindow } from '../../static/bundle/sdk';
import { TagStateHandler } from './TagStateHandler';

export class ShowcaseHandler{
  sdkKey: string;
  sdk: MpSdk;

  constructor(sdkKey: string){
    this.sdkKey = sdkKey;
  }

  async handleEvent(event: Event): Promise<void>{
    const iframe = event.target as HTMLIFrameElement;
    this.sdk = await this.connectSdk(iframe);
    this.setupAddTag();
  }

  private connectSdk(iframe: HTMLIFrameElement): Promise<MpSdk>{
    const bundleWindow = iframe.contentWindow as ShowcaseBundleWindow;
    return bundleWindow.MP_SDK.connect(bundleWindow, this.sdkKey);
  }

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