function PlaneRenderer() {

  this.inputs = {
    texture: null,
    aspect: 1,
    transparent: true,
    visible: true,
    opacity: 1,
    polygonOffset: false,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    localScale: { x: 1, y: 1, z: 1 },
    localPosition: { x: 0, y: 0, z: 0 },
  }

  this.events = {
    "INTERACTION.CLICK": true,
  }

  this.onInit = function(){
    this.mesh;
    this.pivotNode;
    
    const THREE = this.context.three;

    this.pivotNode = new THREE.Group();

    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.0, 1.0),
      new THREE.MeshBasicMaterial({
        transparent: this.inputs.transparent,
        map: this.inputs.texture,
        opacity: this.inputs.opacity,
        polygonOffset: this.inputs.polygonOffset,
        polygonOffsetFactor: this.inputs.polygonOffsetFactor,
        polygonOffsetUnits: this.inputs.polygonOffsetUnits,
      }));
    this.mesh.scale.set(this.inputs.localScale.x, this.inputs.localScale.y / this.inputs.aspect, this.inputs.localScale.z);
    this.mesh.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);
    this.mesh.updateMatrixWorld();
    this.pivotNode.add(this.mesh);

    this.outputs.objectRoot = this.pivotNode;
    this.outputs.collider = this.pivotNode;
    this.mesh.visible = this.inputs.visible;
  }

  this.onEvent = function(eventType, eventData){
    this.notify(eventType, eventData);
  }

  this.onInputsUpdated = function(oldInputs){
    if (oldInputs.transparent !== this.inputs.transparent) {
      (this.mesh.material).transparent = this.inputs.transparent;
    }

    if (oldInputs.texture !== this.inputs.texture) {
      const material = this.mesh.material;
      material.map = this.inputs.texture;
      material.needsUpdate = true;
    }

    if (oldInputs.visible !== this.inputs.visible) {
      this.mesh.visible = this.inputs.visible;
    }

    if (oldInputs.polygonOffset !== this.inputs.polygonOffset) {
      const material = this.mesh.material;
      material.polygonOffset = this.inputs.polygonOffset;
      material.polygonOffsetFactor = this.inputs.polygonOffsetFactor;
      material.polygonOffsetUnits = this.inputs.polygonOffsetUnits;
    }

    this.mesh.scale.set(this.inputs.localScale.x, this.inputs.localScale.y / this.inputs.aspect, this.inputs.localScale.z);
    this.mesh.position.set(this.inputs.localPosition.x, this.inputs.localPosition.y, this.inputs.localPosition.z);
  }

  this.onDestroy = function() {
    this.outputs.collider = null;
    this.outputs.objectRoot = null;

    this.mesh.material.dispose();
    this.mesh.geometry.dispose();
  }

}

export const planeRendererType = 'mp.planeRenderer';
export function makePlaneRenderer() {
  return new PlaneRenderer();
}
