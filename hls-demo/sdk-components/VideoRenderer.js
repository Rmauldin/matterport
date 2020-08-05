function VideoRenderer(){

  this.inputs = {
    src: null,
  }

  this.outputs = {
    texture: null,
  }

  this.onInit = function(){
    this.video;
    this.texture;
  }

  this.onInputsUpdated = function(){
    this.releaseTexture();

    const THREE = this.context.three;
    if (!this.inputs.src) {
      this.video.src = '';
      return;
    }

    if (this.inputs.src instanceof HTMLVideoElement) {
      this.video = this.inputs.src;
    } else {
      this.video = this.createVideoElement();

      if (typeof this.inputs.src === 'string') {
        this.video.src = this.inputs.src;
      } else {
        this.video.srcObject = this.inputs.src;
      }

      this.video.load();
    }

    this.texture = new THREE.VideoTexture(this.video);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBFormat;

    this.outputs.texture = this.texture;
    this.video.play();
  }

  this.onDestroy = function(){
    this.releaseTexture();
  }

  this.releaseTexture = function(){
    if (this.texture) {
      this.outputs.texture = null;
      this.texture.dispose();
    }
  }

  this.createVideoElement = function(){
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    return video;
  }

}

export const videoRendererType = 'mp.videoRenderer';
export function makeVideoRenderer() {
  return new VideoRenderer();
}
