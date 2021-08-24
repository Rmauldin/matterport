import { ShowcaseHandler } from "./handlers/ShowcaseHandler";

/*
  This is an entry point to build the URL parameters, set the iframe source, and add the Showcase handler as a load listener
*/

const key = "fe2587b5509f46949a166ee38ec362b6";

const params = new URLSearchParams({
  m: 'j4RZx7ZGM6T',
  play: '1',
  qs: '1',
  hr: '0',
  applicationKey: key
});

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById('showcase') as HTMLIFrameElement;
  const handler = new ShowcaseHandler(key);
  iframe.addEventListener('load', handler);
  iframe.src = `/matterport/tag-placer/dist/static/bundle/showcase.html?${params}`;
});
