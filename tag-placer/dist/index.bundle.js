(()=>{"use strict";class t{constructor(t){this.eventType="INTERACTION.POINTER_BUTTON",this.sdk=t,this.tagSid=null,this.stemScalar=.33,this.setupInput()}addTag(t){this.tagSid||(this.input.inputs.userNavigationEnabled=!1,this.pointerSub=this.sdk.Pointer.intersection.subscribe(this),this._addTag(t).then((t=>{this.tagSid=t[0]})))}onChanged(t){this.tagSid&&this.sdk.Mattertag.editPosition(this.tagSid,{anchorPosition:t.position,stemVector:{x:t.normal.x*this.stemScalar,y:t.normal.y*this.stemScalar,z:t.normal.z*this.stemScalar}})}notify(t){}onEvent(){this.tagSid&&(this.tagSid=null,this.pointerSub.cancel(),setTimeout((()=>this.input.inputs.userNavigationEnabled=!0),300))}setupInput(){return t=this,n=void 0,i=function*(){const t=yield this.sdk.Scene.createNode();this.input=t.addComponent("mp.input"),t.start(),this.input.spyOnEvent(this)},new((e=void 0)||(e=Promise))((function(s,a){function o(t){try{d(i.next(t))}catch(t){a(t)}}function c(t){try{d(i.throw(t))}catch(t){a(t)}}function d(t){var n;t.done?s(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(o,c)}d((i=i.apply(t,n||[])).next())}));var t,n,e,i}_addTag(t){return t||(t={label:"New tag",description:"This tag was added through the Matterport SDK",anchorPosition:{x:0,y:0,z:0},stemVector:{x:0,y:.3,z:0},color:{r:0,g:0,b:1}}),this.sdk.Mattertag.add(t)}}class n{constructor(t){this.sdkKey=t}handleEvent(t){return n=this,e=void 0,s=function*(){const n=t.target;this.sdk=yield this.connectSdk(n),this.setupAddTag()},new((i=void 0)||(i=Promise))((function(t,a){function o(t){try{d(s.next(t))}catch(t){a(t)}}function c(t){try{d(s.throw(t))}catch(t){a(t)}}function d(n){var e;n.done?t(n.value):(e=n.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,c)}d((s=s.apply(n,e||[])).next())}));var n,e,i,s}connectSdk(t){const n=t.contentWindow;return n.MP_SDK.connect(n,this.sdkKey)}setupAddTag(){const n=document.createElement("button");n.id="add-btn",n.innerText="Add Tag",document.querySelector(".container").appendChild(n);const e=new t(this.sdk);n.addEventListener("click",(()=>{e.addTag()}))}}const e="fe2587b5509f46949a166ee38ec362b6",i={m:"j4RZx7ZGM6T",play:"1",qs:"1",hr:"0",applicationKey:e};document.addEventListener("DOMContentLoaded",(()=>{const t=document.getElementById("showcase"),s=new n(e);t.addEventListener("load",s);const a=Object.keys(i).map((t=>t+"="+i[t])).join("&");t.src=`/matterport/tag-placer/dist/static/bundle/showcase.html?${a}`}))})();
//# sourceMappingURL=index.bundle.js.map