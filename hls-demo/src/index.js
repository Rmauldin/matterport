import scene from '../assets/hls-app.json';
import { planeRendererType, makePlaneRenderer } from '../sdk-components/PlaneRenderer.js';
import { canvasRendererType, makeCanvasRenderer } from '../sdk-components/CanvasRenderer.js';
import { videoRendererType, makeVideoRenderer } from '../sdk-components/VideoRenderer.js';
import { tunerType, makeTuner } from '../sdk-components/Tuner.js';
import { hlsLoaderType, makeHlsLoader } from '../sdk-components/HlsLoader.js';
import { toggleStateType, makeToggleState } from '../sdk-components/ToggleState.js';
import { canvasBorderType, makeCanvasBorder } from '../sdk-components/CanvasBorder.js';
import { canvasTextType, makeCanvasText } from '../sdk-components/CanvasText.js';
import { canvasImageType, makeCanvasImage } from '../sdk-components/CanvasImage.js';

const sdkKey = '';
const sid = 'j4RZx7ZGM6T';
const params = '&play=1&qs=1&sr=2.77,1.27&ss=57';
let iframe;

const initComponents = async (sdk) => {
  await Promise.all([
    sdk.Scene.register(planeRendererType, makePlaneRenderer),
    sdk.Scene.register(canvasRendererType, makeCanvasRenderer),
    sdk.Scene.register(videoRendererType, makeVideoRenderer),
    sdk.Scene.register(tunerType, makeTuner),
    sdk.Scene.register(hlsLoaderType, makeHlsLoader),
    sdk.Scene.register(toggleStateType, makeToggleState),
    sdk.Scene.register(canvasBorderType, makeCanvasBorder),
    sdk.Scene.register(canvasTextType, makeCanvasText),
    sdk.Scene.register(canvasImageType, makeCanvasImage),
  ]);
}

const load = async (sdk) => {
  let nodesToStart;
  try{
    nodesToStart = await sdk.Scene.deserialize(JSON.stringify(scene));
  } catch(e) {
    console.error(e);
  }

  for (const node of nodesToStart) {
    node.start();
  }
}

document.addEventListener("DOMContentLoaded", () => {
    iframe = document.getElementById('sdk-iframe');
    iframe.setAttribute('src', `/bundle/showcase.html?m=${sid}${params}`)
    iframe.addEventListener('load', showcaseLoader);
});

async function showcaseLoader(){
    let sdk;
    try{
        sdk = await iframe.contentWindow.MP_SDK.connect(iframe, sdkKey, '3.4');
    }catch(e){
        console.warn("Unable to connect: " + e);
        return;
    }

    await sdk.Scene.configure((renderer, three) => {
      renderer.physicallyCorrectLights = true;
      renderer.gammaFactor = 2.2;
      renderer.gammaOutput = true;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.bias = 0.0001;
      renderer.shadowMap.type = three.PCFSoftShadowMap;
    });

    await initComponents(sdk);
    try{
      await load(sdk);
    } catch(e) {
      console.error(e);
    }
}
