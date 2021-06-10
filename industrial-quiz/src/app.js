import { ShowcaseHandler } from './handlers/ShowcaseHandler';
import { MattertagQuestionHandler } from './handlers/MattertagQuestionHandler';

document.addEventListener("DOMContentLoaded", initSpace);

function initSpace(){
  const urlParameters = {
    'm': 'tAKsxznrunj',
    'play': 1,
    'qs': 1,
    'hr': 0
  }
  const iframe = document.getElementById('matterport');
  const queryString = Object.keys(urlParameters).map((key) => key + '=' + urlParameters[key]).join('&');
  iframe.addEventListener('load', setupShowcaseHandler);
  iframe.setAttribute('src', `https://my.matterport.com/show/?${queryString}`);
}

async function setupShowcaseHandler(event){
  const sdkKey = "fe2587b5509f46949a166ee38ec362b6";
  const sdkVersion = "3.10";
  const handler = new ShowcaseHandler(event.target,  sdkKey, sdkVersion);
  handler.addHandlers([
    new MattertagQuestionHandler(),
  ]);
  await handler.connect();
  handler.subscribeHandlers();
}
