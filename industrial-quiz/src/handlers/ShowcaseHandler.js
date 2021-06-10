export class ShowcaseHandler{
  
  constructor(iframe, sdkKey, sdkVersion="3.10"){
    this.sdk = null;
    this.handlers = [];
    this.iframe = iframe;
    this.sdkKey = sdkKey;
    this.sdkVersion = sdkVersion;
    this.isConnected = false;
  }
  
  async connect(){
    try{
      this.sdk = await window.MP_SDK.connect(this.iframe, this.sdkKey, this.sdkVersion);
    }catch(e){
      console.error("Could not connect to SDK:", e);
      this.isConnected = false;
      return;
    }
    console.debug("SDK Connected");
    this.isConnected = true;
    return this.sdk;
  }
  
  addHandler(handler){
    this.handlers.push(handler);
  }
  
  addHandlers(handlers){
    handlers.forEach(handler => {
      this.addHandler(handler);
    });
  }
  
  subscribeHandlers(){
    if(!this.isConnected)
      throw new Error("No Matterport SDK Connection Established");
    this.handlers.forEach(handler => handler.subscribe(this.sdk));
  }
  
}