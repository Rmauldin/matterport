import { ShowcaseHandler } from "./handlers/ShowcaseHandler";

const key = "fe2587b5509f46949a166ee38ec362b6";
const params = {
  'm': 'j4RZx7ZGM6T',
  'play': '1',
  'qs': '1',
  'hr': '0',
  'applicationKey': key
}

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById('showcase') as HTMLIFrameElement;
  const handler = new ShowcaseHandler(key);
  iframe.addEventListener('load', handler);
  const queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
  iframe.src = `/matterport/tag-placer/dist/static/bundle/showcase.html?${queryString}`;
});
