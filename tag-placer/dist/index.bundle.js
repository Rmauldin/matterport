/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/handlers/ShowcaseHandler.ts":
/*!*****************************************!*\
  !*** ./src/handlers/ShowcaseHandler.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShowcaseHandler": () => (/* binding */ ShowcaseHandler)
/* harmony export */ });
/* harmony import */ var _TagStateHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TagStateHandler */ "./src/handlers/TagStateHandler.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/*
  The ShowcaseHandler class handles the connection to the SDK, manages additional SDK functionality class objects, and
*/
class ShowcaseHandler {
    constructor(sdkKey) {
        this.sdkKey = sdkKey;
    }
    // Load listener event for the Matterport iframe
    handleEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const iframe = event.target;
            this.sdk = yield this.connectSdk(iframe);
            this.setupAddTag();
        });
    }
    connectSdk(iframe) {
        const bundleWindow = iframe.contentWindow;
        return bundleWindow.MP_SDK.connect(bundleWindow, this.sdkKey);
    }
    // Set up button and instantiate the tag handler
    setupAddTag() {
        const button = document.createElement('button');
        button.id = "add-btn";
        button.innerText = "Add Tag";
        document.querySelector('.container').appendChild(button);
        const placer = new _TagStateHandler__WEBPACK_IMPORTED_MODULE_0__.TagStateHandler(this.sdk);
        button.addEventListener("click", () => {
            placer.addTag();
        });
    }
}


/***/ }),

/***/ "./src/handlers/TagStateHandler.ts":
/*!*****************************************!*\
  !*** ./src/handlers/TagStateHandler.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TagStateHandler": () => (/* binding */ TagStateHandler)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
  This class handles the state and interactions when placing a transient Mattertag. It implements the event spy interface and observer interface for the pointer
*/
class TagStateHandler {
    constructor(sdk) {
        this.eventType = "INTERACTION.POINTER_BUTTON";
        this.sdk = sdk;
        this.tagSid = null;
        this.stemScalar = .33;
        this.setupInput();
    }
    // main function entry point to initiate the placing state by disabling navigation, adding the tag, and updating the tag based on the cursor's position
    addTag(tagOptions) {
        if (this.tagSid)
            return;
        this.input.inputs.userNavigationEnabled = false;
        this._addTag(tagOptions)
            .then((tags) => {
            this.tagSid = tags[0];
        })
            .then(() => {
            this.pointerSub = this.sdk.Pointer.intersection.subscribe(this);
        });
    }
    // from the Pointer observer interface. Updates the tag's position based on the data from the pointer subscription
    onChanged(data) {
        this.sdk.Mattertag.editPosition(this.tagSid, {
            anchorPosition: data.position,
            stemVector: {
                x: data.normal.x * this.stemScalar,
                y: data.normal.y * this.stemScalar,
                z: data.normal.z * this.stemScalar,
            },
        });
    }
    notify(event) { }
    // onEvent only runs when a click has been detected; part of the event spy listening to the mp.input component
    onEvent() {
        if (!this.tagSid)
            return;
        this.tagSid = null;
        this.pointerSub.cancel();
        setTimeout(() => this.input.inputs.userNavigationEnabled = true, 300); // 300ms to debounce clicks while in placement mode. Also waits for click to propagate through Showcase
    }
    // sets up mp.input component for controlling user navigation and spies on the input's click events
    setupInput() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputNode = yield this.sdk.Scene.createNode();
            this.input = inputNode.addComponent('mp.input');
            inputNode.start();
            this.input.spyOnEvent(this);
        });
    }
    // wrapper for add tag to include descriptor options if it's not supplied
    _addTag(tagOptions) {
        if (!tagOptions) {
            tagOptions = {
                label: "New tag",
                description: "This tag was added through the Matterport SDK",
                anchorPosition: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                stemVector: {
                    x: 0,
                    y: 0.30,
                    z: 0,
                },
                color: {
                    r: 0.0,
                    g: 0.0,
                    b: 1.0,
                }
            };
        }
        return this.sdk.Mattertag.add(tagOptions);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _handlers_ShowcaseHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handlers/ShowcaseHandler */ "./src/handlers/ShowcaseHandler.ts");

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
    const iframe = document.getElementById('showcase');
    const handler = new _handlers_ShowcaseHandler__WEBPACK_IMPORTED_MODULE_0__.ShowcaseHandler(key);
    iframe.addEventListener('load', handler);
    iframe.src = `/matterport/tag-placer/dist/static/bundle/showcase.html?${params}`;
});

})();

/******/ })()
;
//# sourceMappingURL=index.bundle.js.map