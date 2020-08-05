function CanvasRenderer() {

  this.inputs = {
    painter: null,
    textureRes: { w: 256, h: 256 },
  }

  this.outputs = {
    texture: true
  }

  this.events = {
    repaint: true
  }

  this.onInit = function(){
    this.canvas;
    this.renderContext2D;
    this.renderTarget;

    const THREE = this.context.three;

    // set up canvas 2d context
    this.canvas = document.createElement('canvas');
    this.renderContext2D = this.canvas.getContext('2d');

    // create three.js objects to render
    this.renderTarget = new THREE.WebGLRenderTarget(this.inputs.textureRes.w, this.inputs.textureRes.h);
    this.renderTarget.texture.image = this.renderContext2D.canvas;

    this.resize(this.inputs.textureRes);
    this.repaint();

    this.outputs.texture = this.renderTarget.texture;
  }

  this.onInputsUpdated = function(oldInputs){
    if (oldInputs.textureRes.w !== this.inputs.textureRes.w ||
        oldInputs.textureRes.h !== this.inputs.textureRes.h) {
      this.resize(this.inputs.textureRes);
    }

    if (oldInputs.painter !== this.inputs.painter) {
      this.repaint();
    }
  }

  this.onEvent = function(eventType, eventData){
    if (eventType === 'repaint') {
      this.repaint();
    }
  }

  this.onDestroy = function(){
    this.outputs.texture = null;
    this.renderTarget.dispose();
  }

  this.resize = function(size){
    this.canvas.width = size.w;
    this.canvas.height = size.h;
    this.renderTarget.width = size.w;
    this.renderTarget.height = size.h;
  }

  this.repaint = function(){
    if (this.inputs.painter) {
      this.inputs.painter.paint(this.renderContext2D, this.inputs.textureRes);
      this.renderTarget.texture.needsUpdate = true;
    }
  }

}

export const canvasRendererType = 'mp.canvasRenderer';
export function makeCanvasRenderer() {
  return new CanvasRenderer();
}
