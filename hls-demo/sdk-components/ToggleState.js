const event = {
  Toggle: 'toggle',
}

function ToggleState(){
  this.inputs = {
    initialState: false
  }

  this.outputs = {
    state: false,
    negated: true,
  }

  this.events = {
    toggle: true
  }

  this.onInit = function(){
    this.outputs.state = this.inputs.initialState;
    this.outputs.negated = !this.outputs.state;
  }

  this.onEvent = function(eventType, eventData){
    if (eventType === event.Toggle) {
      this.outputs.state = !this.outputs.state;
      this.outputs.negated = !this.outputs.state;
    }
  }

} 

export const toggleStateType = 'mp.toggleState';
export function makeToggleState() {
  return new ToggleState();
}
