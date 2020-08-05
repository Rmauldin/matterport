import Hls from 'hls.js';

function HlsLoader(){

  this.inputs = {
    src: '',
    enabled: false,
  }

  this.outputs = {
    video: null,
    aspect: 1,
  }

  this.onInit = function(){
    this.video;
    this.texture;
    this.hls;
    this.outputs.aspect = 720/480;
    if (this.inputs.enabled) {
      this.setupStream();
    }
  }

  this.onInputsUpdated = function(){
    this.setupStream();
  }

  this.onDestroy = function(){
    this.releaseResources();
  }

  this.createVideoElement = function(){
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.setAttribute('height', '480');
    video.setAttribute('width', '720');
    video.volume = 0.1;
    return video;
  }

  this.setupStream = function(){
    this.releaseResources();

    if (this.inputs.enabled) {
      this.video = this.createVideoElement();
      this.hls = new Hls();
      this.hls.loadSource(this.inputs.src);
      this.hls.attachMedia(this.video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.outputs.video = this.video;
      });
    }    
  }

  this.releaseResources = function(){
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
      this.outputs.video = null;
    }
  }

}

export const hlsLoaderType = 'mp.hlsLoader';
export function makeHlsLoader() {
  return new HlsLoader();
}
