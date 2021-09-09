# Transient Tag Placer Example

This example shows one way to implement a Mattertag placement application using the Bundle SDK.

## index.ts

This file serves as an entry point in which to create the Showcase Handler object, assign the load listener for the Matterport iframe, then set the URL for the iframe

## ShowcaseHandler.ts

The Showcase Handler manages the SDK connection and custom classes that implement SDK functionality. This also sets up the button UI for the TagStateHandler.

## TagStateHandler.ts

This class manages the tag placement state to stop navigation and update the tag location when placing the tag. It implements the Bundle's EventSpy interface and the Observer interface for the pointer's intersection.
