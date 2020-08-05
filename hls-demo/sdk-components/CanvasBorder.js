function CanvasBorder() {
  this.inputs = {
    position: { x: 0, y: 0 },
    size: { h: 100, w: 100 },
    radius: 10,
  }

  this.outputs = {
    painter: null,
  }

  this.onInit = function(){
    this.outputs.painter = this;
  }
  
  this.onInputsUpdated = function(){
    this.notify('paint.ready');
  }

  this.paint = function(context2d, size){
    const x = this.inputs.position.x;
    const y = this.inputs.position.y;
    const radius = this.inputs.radius;
    var r = x + this.inputs.size.w;
    var b = y + this.inputs.size.h;

    context2d.shadowBlur = 10;
    context2d.shadowColor = 'black';
    context2d.beginPath();
    context2d.strokeStyle = 'black';
    context2d.lineWidth = 50;
    context2d.moveTo(x + radius, y);
    context2d.lineTo(r - radius, y);
    context2d.quadraticCurveTo(r, y, r, y + radius);
    context2d.lineTo(r, y + this.inputs.size.h - radius);
    context2d.quadraticCurveTo(r, b, r-radius, b);
    context2d.lineTo(x + radius, b);
    context2d.quadraticCurveTo(x, b, x, b - radius);
    context2d.lineTo(x, y + radius);
    context2d.quadraticCurveTo(x, y, x + radius, y);
    context2d.stroke();
  }

}

export const canvasBorderType = 'mp.canvasBorder';
export function makeCanvasBorder() {
  return new CanvasBorder();
}
