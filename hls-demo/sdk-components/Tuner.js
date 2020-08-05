const event = {
  Next: 'next'
}

function Tuner(){
  
  this.inputs = {
    urls: [],
  }

  this.outputs = {
    src: '',
  }

  this.events = {
    [event.Next]: true
  }

  this.onInit = function(){
    this.urlIndex = 0;
    this.outputs.src = this.inputs.urls.length > 0 ? this.inputs.urls[0] : '';
  }

  this.onEvent = function(eventType, eventData){
    if (eventType === event.Next) {
      this.urlIndex++;
      if (this.urlIndex >= this.inputs.urls.length) {
        this.urlIndex = 0;
      }

      if (this.inputs.urls.length > 0) {
        this.outputs.src = this.inputs.urls[this.urlIndex];
      }
    }
  }

}

export const tunerType = 'mp.tuner';
export function makeTuner() {
  return new Tuner();
}
