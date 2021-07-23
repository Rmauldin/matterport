const sdkKey = 'YOUR SDK KEY HERE';
const params = {
  'm': 'j4RZx7ZGM6T',
  'qs': '1',
  'applicationKey': sdkKey,
  'sr': '2.49,1.25',
  'ss': '57'
}

const iframe = document.getElementById('showcase');
iframe.addEventListener('load', showcaseHandler);
const queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
iframe.src = `./assets/bundle/showcase.html?${queryString}`;

async function showcaseHandler(){
  const sdk = await iframe.contentWindow.MP_SDK.connect(iframe, sdkKey, '');
  sdk.Scene.register(VideoPlayback.type, VideoPlayback.makeVideoPlayback);

  const videoPlaybackNode = await sdk.Scene.createNode();
  const videoComponent = videoPlaybackNode.addComponent('mp.video', {
    src: "./assets/videos/nasdaq.mp4",
    loop: true
  });

  videoComponent.inputs.localPosition = { "x": -3.0, "y": 2.3, "z": 6.7};
  videoComponent.inputs.localRotation = { "x": 0, "y": 90, "z": 0 };
  videoComponent.inputs.localScale = { "x": 1, "y": 1,"z": 1 };

  videoPlaybackNode.start();

}

class VideoPlayback{

  static type = "mp.video";
  
  static makeVideoPlayback = function(){
    return new VideoPlayback();
  }
  outputs = {}
  events = {
    "INTERACTION.CLICK": true,
  }
  inputs = {
    src: null,
    paused: false,
    muted: false,
    loop: false,
    localScale: {x: 1.78, y: 1, z: 1},
    localPosition: {x: 0, y: 0, z: 0},
    localRotation: {x: 0, y: 0, z: 0}
  }
  onInit(){
    const THREE = this.context.three;
    this.video = this.createVideoElement();
    const geo = new THREE.PlaneGeometry(1.5, 1);
    this.videoTexture = new THREE.VideoTexture(this.video);

    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBAFormat; // see https://github.com/mrdoob/three.js/pull/21746 for Firefox

    const mat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: this.videoTexture});
    const plane = new THREE.Mesh(geo, mat);

    plane.position.set(
      this.inputs.localPosition.x,
      this.inputs.localPosition.y,
      this.inputs.localPosition.z
    );

    plane.rotation.set(
      THREE.MathUtils.degToRad(this.inputs.localRotation.x),
      THREE.MathUtils.degToRad(this.inputs.localRotation.y),
      THREE.MathUtils.degToRad(this.inputs.localRotation.z)
    );

    plane.scale.set(
      this.inputs.localScale.x,
      this.inputs.localScale.y,
      1
    )

    this.outputs.objectRoot = plane;
    this.outputs.collider = plane;

    if(!this.inputs.paused) 
      this.video.play();

    if(this.inputs.loop)
      this.video.loop = true;
  }

  onInputsUpdated(oldInputs){
    const THREE = this.context.three;
    if(oldInputs.src != this.inputs.src) 
      this.video.src = this.inputs.src;

    if(oldInputs.paused != this.inputs.paused){
      this.inputs.paused ? this.video.pause() : this.video.play();
    }

    if(oldInputs.muted != this.inputs.muted) 
      this.video.muted = this.inputs.muted;

      this.outputs.objectRoot.scale.set(
        this.inputs.localScale.x, 
        this.inputs.localScale.y, 
        1
      );

      this.outputs.objectRoot.position.set(
        this.inputs.localPosition.x, 
        this.inputs.localPosition.y, 
        this.inputs.localPosition.z
      );

      this.outputs.objectRoot.rotation.set(
        THREE.MathUtils.degToRad(this.inputs.localRotation.x), 
        THREE.MathUtils.degToRad(this.inputs.localRotation.y), 
        THREE.MathUtils.degToRad(this.inputs.localRotation.z)
      );

      if(this.inputs.loop)
        this.video.loop = true;
      else
        this.video.loop = false;
  }

  onEvent(event, data){
    switch(event){
      case "INTERACTION.CLICK":
        this.inputs.paused = !this.inputs.paused;
        break;
      default:
        break;
    }
  }

  onDestroy() {
    this.videoTexture.releaseTexture();
  }

  createVideoElement(){
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = this.inputs.muted;
    video.src = this.inputs.src;
    return video;
  }
}