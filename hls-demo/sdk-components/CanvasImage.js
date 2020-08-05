function CanvasImage(){
  this.inputs = {
    src: null,
    srcPosition: { x: 0, y: 0 },
    srcSize: { w: 64, h: 64 },
    destPosition: { x: 0, y: 0 },
    destSize: { w: 64, h: 64 },
  }

  this.outputs = {
    painter: null,
  }

  this.onInit = function(){
    this.outputs.painter = this;
    this.maybeLoadImage();
  }

  this.onInputsUpdated = function(){
    this.maybeLoadImage();
  }

  this.paint = function(context2d, size){
    if (!this.image) {
      return;
    }

    context2d.clearRect(0, 0, this.inputs.destSize.w, this.inputs.destSize.h);
    if (this.image.width > 0) {
      context2d.drawImage(this.image,
      this.inputs.srcPosition.x, this.inputs.srcPosition.y,
      this.inputs.srcSize.w, this.inputs.srcSize.h,
      this.inputs.destPosition.x, this.inputs.destPosition.y,
      this.inputs.destSize.w, this.inputs.destSize.h);
    }
  }

  this.maybeLoadImage = function(){
    this.image = null;

    if (this.inputs.src !== null && this.inputs.src !== '') {
      const that = this;
      this.image = new Image();
      this.image.crossOrigin = 'anonymous';
      this.image.src = this.inputs.src;
      this.image.onload = function(event) {
        that.notify('paint.ready');
      };
    }

    this.notify('paint.ready');
  }

} 

export const canvasImageType = 'mp.canvasImage';
export function makeCanvasImage() {
  return new CanvasImage();
}
