import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

export type Vector2 = {
	x: number;
	y: number;
};
export type Vector3 = {
	x: number;
	y: number;
	z: number;
};
export type Rotation = {
	x: number;
	y: number;
	z?: number;
};
/**
 * An orientation described with Euler-like angles in degrees.
 */
export type Orientation = {
	yaw: number;
	pitch: number;
	roll: number;
};
export type Size = {
	w: number;
	h: number;
};
/**
 * An RGB represenation of a color.
 * Each property is normalized to the range [0, 1]
 */
export type Color = {
	r: number;
	g: number;
	b: number;
};
/**
 * An object representing an observer that is subscribed to an observable.
 */
export interface ISubscription {
	/**
	 * Removes the observer from the observable so that it stops receiving updates.
	 */
	cancel(): void;
}
/**
 * A callback that can be subscribed to changes of an [[IObservable]]
 *
 * The functional style version of the [[IObserver]]
 * @param <DataT> The type of the data being observed.
 */
export type ObserverCallback<DataT> = (data: DataT) => void;
/**
 * An observer that can be subscribed to changes of an [[IObservable]]
 *
 * The object-oriented version of the [[ObserverCallback]]
 * @param <DataT> The type of the data being observed.
 */
export interface IObserver<DataT> {
	/** Called when the data in the [[IObservable]] has changed. */
	onChanged(data: DataT): void;
}
/**
 * A callback that describes a condition of an [[IObservable]] to wait for.
 * Returning true will resolve the promise returned by [[IObservable.waitUntil]]
 *
 * The functional style version of the [[ICondition]]
 * @param <DataT> The type of the data to check conditions on.
 */
export type ConditionCallback<DataT> = (data: DataT) => void;
/**
 * An observer-like object that describes a condition to wait for on an [[IObservable]]
 *
 * The object-oriented version of the [[ConditionCallback]]
 * @param <DataT> The type of the data to check conditions on.
 */
export interface ICondition<DataT> {
	/**
	 * Called when the data in the [[IObservable]] has changed.
	 * Returning true will resolve the promise returned by [[IObservable.waitUntil]]
	 */
	waitUntil(data: DataT): boolean;
}
/**
 * A data object that can have its changes observed via subscribing an [[IObserver]] or [[ObserverCallback]]
 * @param <DataT> The type of the data being observed.
 */
export interface IObservable<DataT> {
	/**
	 * Subscribe to changes on this object.
	 * When this observable detects a change, the `observer` provided will be called with the data associated with this observable.
	 * @param observer
	 * @returns {ISubscription} A subscription that can be used to remove the subscribed observer.
	 */
	subscribe(observer: IObserver<DataT> | ObserverCallback<DataT>): ISubscription;
	/**
	 * Wait for a specific condition on this object to be met.
	 * When this observable detects a change, the `condition` provided will be called. When the `condition` returns true, the returned Promise will be resolved.
	 * @param {ICondition | ConditionCallback} condition
	 * @returns {Promise<void>} A promise that is resolved when `condition` returns true.
	 */
	waitUntil(condition: ICondition<DataT> | ConditionCallback<DataT>): Promise<void>;
}
/**
 * An observer that can subscribe to changes of an [[IObservableMap]]
 *
 * @param <ItemT> The type of the items in the map.
 */
export interface IMapObserver<ItemT> {
	/** Called when an item is added with the `index`, the new `item`, and current state of the `collection`. */
	onAdded?(index: string, item: ItemT, collection: Dictionary<ItemT>): void;
	/** Called when an item is removed, with the `index`, the removed `item`, and current state of the `collection`. */
	onRemoved?(index: string, item: ItemT, collection: Dictionary<ItemT>): void;
	/** Called when an existing item is altered, with the `index`, the new `item`, and current state of the `collection`. */
	onUpdated?(index: string, item: ItemT, collection: Dictionary<ItemT>): void;
	/**
	 * Called when a set of changes happens within the `collection`.
	 * For example, this can be used to get the initial state of the collection instead of receiving individual `onAdded` calls for each item.
	 */
	onCollectionUpdated?(collection: Dictionary<ItemT>): void;
}
/**
 * A map that can have its changes observed via subscribing an [[IMapObserver]]
 *
 * For each observer subscribed to this `IObservableMap`:
 * - `observer.onAdded` will be called when an item is added to the collection
 * - `observer.onRemoved` will be called when an item is removed from the collection
 * - `observer.onUpdated` will be called when an item has some of its properties changed
 * - `observer.onCollectionUpdated` will be called when some set of the above events have occured (item added/removed/updated)
 *
 * When first subscribing, the observers' `onAdded` will be called for each item in the collection, and then again as items are added.
 * Alternatively, the `onCollectionUpdated` will always give an up-to-date view of the collection.
 * `onCollectionUpdated`, on first subscription, will be called once with the entire collection, and then again as changes to the collection  occur.
 *
 * @param <ItemT> The type of the items in the map being observed.
 */
export interface IObservableMap<ItemT> {
	/**
	 * Subscribe to changes in this map.
	 * When this observable detects a change, the `observer` provided will have its `onAdded`, `onRemoved`, and/or `onUpdated` called.
	 * @param observer
	 * @returns {ISubscription} A subscription that can be used to remove the subscribed observer.
	 */
	subscribe(observer: IMapObserver<ItemT>): ISubscription;
}
/**
 * A homogenous collection of items indexable by string like a standard JavaScript object.
 * @param <ItemT> The type of each item in this collection.
 */
export interface Dictionary<ItemT> {
	[key: string]: ItemT;
}
export declare namespace App {
	export enum Event {
		PHASE_CHANGE = "application.phasechange"
	}
	/**
	 * Application phases are returned as part of the [[state]] observable.
	 *
	 * ```
	 * mpSdk.App.state.subscribe(function (appState) {
	 *  if(appState.phase === mpSdk.App.Phase.LOADING) {
	 *    console.log('The app has started loading!')
	 *  }
	 *  if(appState.phase === mpSdk.App.Phase.STARTING) {
	 *    console.log('The transition into the start location begins!')
	 *  }
	 *  if(appState.phase === mpSdk.App.Phase.PLAYING) {
	 *    console.log('The app is ready to take user input now!')
	 *  }
	 * });
	 * ```
	 */
	export enum Phase {
		UNINITIALIZED = "appphase.uninitialized",
		WAITING = "appphase.waiting",
		LOADING = "appphase.loading",
		STARTING = "appphase.starting",
		PLAYING = "appphase.playing",
		ERROR = "appphase.error"
	}
	/**
	 * Application
	 */
	export enum Application {
		SHOWCASE = "application.showcase"
	}
	/**
	 * @deprecated This type is used by deprecated functionality. Use [[state]] observable.
	 */
	export type AppState = {
		application: Application;
		phase: Phase;
	};
	export type State = {
		application: Application;
		phase: Phase;
		/**
		 * An object whose keys are phases from [[Phase]]
		 * and values are epoch time in milliseconds.
		 * The times are filled in after the phase has passed.
		 * ```
		 * {
		 *    phaseTimes: {
		 *      'appphase.uninitialized': 1570084156590,
		 *      'appphase.waiting': 0,
		 *      'appphase.loading': 0,
		 *      'appphase.starting': 0,
		 *      'appphase.playing': 0,
		 *      'appphase.error': 0,
		 *    }
		 * }
		 * ```
		 */
		phaseTimes: {
			[phase: string]: number;
		};
	};
}
export interface App {
	Event: typeof App.Event;
	Phase: typeof App.Phase;
	Application: typeof App.Application;
	/**
	 * @deprecated Use [[state]] observable to get the current phase or application.
	 */
	getState(): Promise<App.AppState>;
	/**
	 * @deprecated Use [[state]] observable to get load times.
	 */
	getLoadTimes(): Promise<{
		[key in App.Phase]: null | number;
	}>;
	/**
	 * An observable application state object.
	 *
	 * ```
	 * mpSdk.App.state.subscribe(function (appState) {
	 *  // app state has changed
	 *  console.log('The current application: ', appState.application);
	 *  console.log('The current phase: ', appState.phase);
	 *  console.log('Loaded at time ', appState.phaseTimes[mpSdk.App.Phase.LOADING]);
	 *  console.log('Started at time ', appState.phaseTimes[mpSdk.App.Phase.STARTING]);
	 * });
	 *
	 * output
	 * > The current application: application.showcase
	 * > The current phase: appphase.waiting
	 * > Loaded at time 1570084156590
	 * > Started at time 1570084156824
	 * >
	 * ```
	 */
	state: IObservable<App.State>;
}
export declare namespace Mode {
	export enum Mode {
		INSIDE = "mode.inside",
		OUTSIDE = "mode.outside",
		DOLLHOUSE = "mode.dollhouse",
		FLOORPLAN = "mode.floorplan",
		TRANSITIONING = "mode.transitioning"
	}
	export enum Event {
		/** @event */
		CHANGE_START = "viewmode.changestart",
		/** @event */
		CHANGE_END = "viewmode.changeend"
	}
	export enum TransitionType {
		INSTANT = "transition.instant",
		FLY = "transition.fly",
		FADEOUT = "transition.fade"
	}
	export type MoveToModeOptions = {
		rotation?: Rotation;
		position?: Vector3;
		transition?: TransitionType;
		zoom?: number;
	};
}
export interface Mode {
	Mode: typeof Mode.Mode;
	Event: typeof Mode.Event;
	TransitionType: typeof Mode.TransitionType;
	/**
	 * Change the viewing mode in 3D Showcase.
	 *
	 *```
	 * const mode = mpSdk.Mode.Mode.FLOORPLAN;
	 * const position = {x: 0, y: 0, z: 0};
	 * const rotation = {x: -90, y: 0};
	 * const transition = mpSdk.Mode.Transition.FLY;
	 * const zoom = 5;
	 *
	 * mpSdk.Mode.moveTo(mode, {
	 *     position: position,
	 *     rotation: rotation,
	 *     transition: transition,
	 *     zoom,
	 *   })
	 *   .then(function(nextMode){
	 *     // Move successful.
	 *     console.log('Arrived at new view mode ' + nextMode);
	 *   })
	 *   .catch(function(error){
	 *     // Error with moveTo command
	 *   });
	 * ```
	 *
	 * Notes about transitions to Floorplan mode:
	 * * `zoom` option is only taken into account in Floorplan transitions, the lower the number,
	 *   the further the camera is zoomed in
	 * * The position of a floorplan view is determined by the X and Z arguments of the optional position object.
	 * * The rotation of a floorplan view is determined by the X and Y of the optional rotation object,
	 *   changing X changes the 'roll' of the view, similar to hitting the LEFT/RIGHT arrow keys in Showcase
	 *   floorplan view, changing the Y value has no analog in showcase, but changes the 'tilt' of the view.
	 *
	 * @param The mode.
	 * @param Options object, containing optional position, rotation, transition type
	 * @return A promise that resolves with the new mode once the mode has transitioned.
	 */
	moveTo(mode: Mode.Mode, options?: Mode.MoveToModeOptions): Promise<Mode.Mode>;
}
export declare namespace Camera {
	export type Pose = {
		position: Vector3;
		rotation: Vector2;
		projection: Float32Array;
		sweep: string;
		mode: Mode.Mode;
	};
	export enum Event {
		/** @event */
		MOVE = "camera.move"
	}
	export enum Direction {
		FORWARD = "FORWARD",
		LEFT = "LEFT",
		RIGHT = "RIGHT",
		BACK = "BACK",
		UP = "UP",
		DOWN = "DOWN"
	}
	export type RotateOptions = {
		/**
		 * Rotation speed in degrees per second.
		 */
		speed?: number;
	};
	export type ZoomData = {
		/**
		 * The current zoom level
		 */
		level: number;
	};
}
export interface Camera {
	Event: typeof Camera.Event;
	Direction: typeof Camera.Direction;
	/**
	 * Returns the current state of camera.
	 * ```
	 * mpSdk.Camera.getPose()
	 *   .then(function(pose){
	 *     console.log('Current position is ', pose.position);
	 *     console.log('Rotation angle is ', pose.rotation);
	 *     console.log('Sweep UUID is ', pose.sweep);
	 *     console.log('View mode is ', pose.mode);
	 *   });
	 * ```
	 * @return A promise that resolves with the current state of the camera.
	 * @deprecated You can use the [[pose]] observable property instead.
	 */
	getPose(): Promise<Camera.Pose>;
	/**
	 * An observable pose data object that can be subscribed to.
	 *
	 * ```
	 * mpSdk.Camera.pose.subscribe(function (pose) {
	 *   // Changes to the Camera pose have occurred.
	 *   console.log('Current position is ', pose.position);
	 *   console.log('Rotation angle is ', pose.rotation);
	 *   console.log('Sweep UUID is ', pose.sweep);
	 *   console.log('View mode is ', pose.mode);
	 * });
	 * ```
	 */
	pose: IObservable<Camera.Pose>;
	/**
	 * Moves user to a different sweep relative to their current location
	 *
	 * ```
	 * const nextDirection = mpSdk.Camera.Direction.FORWARD;
	 *
	 * mpSdk.Camera.moveInDirection(nextDirection)
	 *   .then(function(){
	 *     console.log('The camera has moved forward.');
	 *   })
	 *   .catch(function(){
	 *     console.warning('An error occured while moving in that direction.');
	 *   });
	 * ```
	 * @param direction The direction.
	 * @return A promise that resolves when a sweep has been reached.
	 *
	 * **Errors**
	 *
	 * * Fails if direction is not one of the above options.
	 * * Warns if you can’t move in that direction (hit a wall).
	 *
	 * **Notes**
	 *
	 * This is the same behavior as if the user presses the arrow keys while in 3D Showcase.
	 *
	 * * Camera.Direction.UP is like moving forwards
	 * * Camera.Direction.DOWN is like moving backwards
	 *
	 * This action is for moving between sweeps while in Inside View.
	 */
	moveInDirection(direction: Camera.Direction): Promise<void>;
	/**
	 * Pans the camera.
	 *
	 * ```
	 * mpSdk.Camera.pan({ x: 1, z: 1 })
	 *   .then(function() {
	 *     // Pan complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Pan error.
	 *   });
	 * ```
	 *
	 * @param params.x Absolute position of the sweep on the x axis.
	 * @param params.z Absolute position of the sweep on the z axis.
	 * @return A promise that resolves when the pan is complete.
	 *
	 * **Errors**
	 *
	 * * Warns if pan was successful but you hit the model bounds.
	 * * Fails if you are already at the model bounds and you cannot move any further.
	 *
	 * **Notes**
	 *
	 * The orientation of the axes depends on the sweep you were in before entering
	 * Floorplan and the aspect ratio of window.
	 *
	 * Only available in Dollhouse or Floorplan View. This is the same behavior as
	 * if the user uses the keyboard shortcuts W, A, S, and D or the arrow keys.
	 *
	 * Use `mpSdk.Camera.pan({ x: 0, z: 0 });` to return to directly above the
	 * very first sweep scanned.
	 */
	pan(params: {
		x: number;
		z: number;
	}): Promise<void>;
	/**
	 * Rotates the camera (user’s viewpoint).
	 *
	 * ```
	 * mpSdk.Camera.rotate(10, -20, { speed: 2 })
	 *   .then(function() {
	 *     // Camera rotation complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Camera rotation error.
	 *   });
	 * ```
	 *
	 * @param vertical How many degrees to rotate up or down.
	 * @param horizontal How many degrees to rotate left or right.
	 * @param options
	 * @return A promise that resolves when the rotation is complete.
	 *
	 * **Errors**
	 *
	 * * Warns to console if you rotated, but then you hit the vertical limit.
	 * * Warns if trying to rotate up or down in Floorplan View.
	 * * Fails if no movement because you are already at a rotation limit.
	 *
	 * **Notes**
	 *
	 * If user is in Dollhouse or Floorplan View, the entire Matterport Space is rotated.
	 * * Positive values for horizontal means the Space rotates clockwise.
	 * * Negative values for horizontal counterclockwise rotations.
	 * * In Dollhouse view, vertical ranges from 0° (horizontal) to 80° above the Space.
	 * * In Floorplan view, the vertical value is ignored.
	 *
	 * If the user is in Inside View or 360º View, their viewpoint is rotated.
	 * * Positive values for horizontal means the user rotates clockwise.
	 * * Negative values for horizontal are counterclockwise rotations.
	 * * Vertical ranges from -70° (down) to 70° (up).
	 * * Tilting the view (similar to tilting one’s head) not supported.
	 *
	 * Rotation is relative to the user’s current viewpoint.
	 * This is the same behavior as if the user uses the keyboard shortcuts I, J, K, and L.
	 * Speeds less than or equal to zero are not allowed.
	 */
	rotate(horizontal: number, vertical: number, options?: Camera.RotateOptions): Promise<void>;
	/**
	 * Sets the orientation of the camera (user’s viewpoint) while in Panorama View.
	 *
	 * ```
	 * mpSdk.Camera.setRotation({ x: 10, y: -20 }, { speed: 2 })
	 *   .then(function() {
	 *     // Camera rotation complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Camera rotation error.
	 *   });
	 * ```
	 *
	 * @param rotation The target rotation
	 * @param options
	 * @return A promise that resolves when the rotation is complete.
	 *
	 * **Errors**
	 * * Fails if the current view mode is not Panorama View.
	 *
	 * **Notes**
	 * * A target rotation can be retrieved from [[Camera.pose]]
	 * * Rotation is absolute so multiple calls will not further change orientation (floating point error notwithstanding).
	 * * Speeds less than or equal to zero are not allowed.
	 */
	setRotation(rotation: Rotation, options?: Camera.RotateOptions): Promise<void>;
	/**
	 * Rotates the camera to a specific screen coordinate.
	 * Coordinates are measure in pixels, relative to the WebGL Canvas' top left corner.
	 * See https://www.w3schools.com/graphics/canvas_coordinates.asp for more information on coordinates.
	 *
	 * ```
	 * mpSdk.Camera.lookAtScreenCoords(500, 320)
	 *   .then(function() {
	 *     // Camera rotation complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Camera rotation error.
	 *   });
	 * ```
	 *
	 * @param {number} x Horizontal position, in pixels. Starting from the canvas' top left corner.
	 * @param {number} y Vertical position, in pixels. Starting from the canvas' top left corner.
	 * @returns {Promise<void>} A Promise that resolves when the rotation is complete.
	 *
	 * **Errors**
	 * * Fails if used outside of Inside mode.
	 * * Warns to console if you rotated, but then you hit the vertical limit.
	 * * Fails if no movement because you are already at a rotation limit.
	 */
	lookAtScreenCoords(x: number, y: number): Promise<void>;
	/**
	 * Zooms the camera to a percentage of the base field of view.
	 *
	 * Ex: Doubling the zoom, halves the field of view.
	 *
	 * ```
	 * mpSdk.Camera.zoomTo(2.0)
	 *  .then(function (newZoom) {
	 *    console.log('Camera zoomed to', newZoom);
	 *  });
	 * ```
	 *
	 * @param zoomLevel
	 *
	 * **Errors**
	 * * Fails if the current mode is not Inside mode.
	 * * Warns to console if the zoom level is outside of the zoom range supported.
	 */
	zoomTo(zoomLevel: number): Promise<number>;
	/**
	 * Zooms the camera by a percentage. The zoom delta is defined relative to the base field of view, not the current zoom.
	 * This means that the delta is strictly added, and not multiplied by the current zoom first.
	 *
	 *
	 * Ex: If at zoom 2.0, zooming by another 0.1x will bring the camera to 2.1x (2.0 + 0.1) not 2.2x (2.0 + 2.0 * 0.1)
	 *
	 * ```
	 * mpSdk.Camera.zoomBy(0.1)
	 *   .then(function (newZoom) {
	 *     console.log('Camera zoomed to', newZoom);
	 *   });
	 * ```
	 *
	 * @param zoomDelta
	 *
	 * **Errors**
	 * * Fails if the current mode is not Inside mode.
	 * * Warns to console if the zoom level would be outside of the zoom range supported.
	 */
	zoomBy(zoomDelta: number): Promise<number>;
	/**
	 * Reset the zoom of the camera back to 1.0x.
	 *
	 * ```
	 * mpSdk.Camera.zoomReset()
	 *   .then(function () {
	 *     console.log('Camera zoom has been reset');
	 *   })
	 * ```
	 *
	 * **Errors**
	 * * Fails if the current mode is not Inside mode.
	 */
	zoomReset(): Promise<void>;
	/**
	 * An observable zoom level of the camera in Panorama mode.
	 * The zoom level will be 1.0 for all other viewmodes.
	 *
	 * ```
	 * mpSdk.Camera.zoom.subscribe(function (zoom) {
	 *   // the zoom level has changed
	 *   console.log('Current zoom is ', zoom.level);
	 * });
	 * ```
	 */
	zoom: IObservable<Camera.ZoomData>;
}
export declare namespace Conversion { }
export interface Conversion {
	/**
	 * Converts a position of an object in 3d to the pixel coordinate on the screen
	 *
	 * @param worldPos Position of the object
	 * @param cameraPose The current pose of the Camera as received from Camera.pose.subscribe
	 * @param windowSize The current size of the Showcase player
	 * @param result An optional, pre-allocated Vector3 to store the result
	 *
	 * ```
	 * var showcase = document.getElementById('showcaseIframe');
	 * var showcaseSize = {
	 *  w: showcase.clientWidth,
	 *  h: showcase.clientHeight,
	 * };
	 * var cameraPose; // get pose using: mpSdk.Camera.pose.subscribe
	 * var mattertag; // get a mattertag from the collection using: mpSdk.Mattertag.getData
	 *
	 * var screenCoordinate = mpSdk.Conversion.worldToScreen(mattertag.anchorPosition, cameraPose, showcaseSize)
	 * ```
	 */
	worldToScreen(worldPos: Vector3, cameraPose: Camera.Pose, windowSize: Size, result?: Vector3): Vector3;
}
export declare namespace Floor {
	export type Floors = {
		currentFloor: number;
		floorNames: string[];
		totalFloors: number;
	};
	export type FloorData = {
		id: string;
		sequence: number;
		name: string;
	};
	export type ObservableFloorData = {
		id: string | undefined;
		sequence: number | undefined;
		name: string;
	};
	export enum Event {
		/** @event */
		CHANGE_START = "floors.changestart",
		/** @event */
		CHANGE_END = "floors.changeend"
	}
}
export interface Floor {
	Event: typeof Floor.Event;
	/**
	 * This function returns the state of all floors.
	 *
	 * ```
	 * mpSdk.Floor.getData()
	 *   .then(function(floors) {
	 *     // Floor data retreival complete.
	 *     console.log('Current floor: ' + floors.currentFloor);
	 *     console.log('Total floos: ' + floors.totalFloors);
	 *     console.log('Name of first floor: ' + floors.floorNames[0]);
	 *   })
	 *   .catch(function(error) {
	 *     // Floors data retrieval error.
	 *   });
	 * ```
	 * @deprecated Use the observable [[data]] collection instead
	 */
	getData(): Promise<Floor.Floors>;
	/**
	 * An observable collection of Floor data that can be subscribed to.
	 *
	 * See [[IObservableMap]] to learn how to receive data from the collection.
	 *
	 * ```
	 * showcase.Floor.data.subscribe({
	 *   onCollectionUpdated: function (collection) {
	 *     console.log('Collection received. There are ', Object.keys(collection).length, 'floors in the collection');
	 *   }
	 * });
	 * ```
	 */
	data: IObservableMap<Floor.FloorData>;
	/**
	 * An observable for the player's currently active floor.
	 *
	 * The current floor can tell you when "all floors" are visible and encodes when the camera is transitioning between floors.
	 *
	 * The following table shows all 4 states of the current floor observable
	 * (INSIDE: inside mode, DH: dollhouse mode, FP: floorplan mode).
	 *
	 * |          | at sweep (INSIDE) or floor (DH, FP) | all floors (DH, FP) | transitioning | in unplaced 360º view |
	 * |----------|-------------------------------------|---------------------|---------------|------------------------|
	 * | id       | `${current.id}`                     | ''                  | ''            | undefined              |
	 * | sequence | `${current.sequence}`               | -1                  | undefined     | undefined              |
	 * | name     | `${current.name}`                   | 'all'               | ''            | ''                     |
	 *
	 * ```
	 * mpSdk.Floor.current.subscribe(function (currentFloor) {
	 *   // Change to the current floor has occurred.
	 *   if (currentFloor.sequence === -1) {
	 *     console.log('Currently viewing all floors');
	 *   } else if (currentFloor.sequence === undefined) {
	 *     if (currentFloor.id === undefined) {
	 *       console.log('Current viewing an unplaced unaligned sweep');
	 *     } else {
	 *       console.log('Currently transitioning between floors');
	 *     }
	 *   } else {
	 *     console.log('Currently on floor', currentFloor.id);
	 *     console.log('Current floor\'s sequence index', currentFloor.sequence);
	 *     console.log('Current floor\'s name', currentFloor.name)
	 *   }
	 * });
	 * ```
	 */
	current: IObservable<Floor.ObservableFloorData>;
	/**
	 * When in inside mode, this function changes the active floor, and moves the camera to the nearest position on that floor.
	 * When in floorplan/dollhouse mode, this function changes the active floor, but does not modify the camera
	 *
	 * ```
	 * mpSdk.Floor.moveTo(2)
	 *   .then(function(floorIndex) {
	 *     // Move to floor complete.
	 *     console.log('Current floor: ' + floorIndex);
	 *   })
	 *   .catch(function(error) {
	 *     // Error moving to floor.
	 *   });
	 * ```
	 *
	 * @param index: The destination floor index
	 * @return The destination floor index.
	 */
	moveTo(index: number): Promise<number>;
	/**
	 * This function displays all floors.
	 *
	 * ```
	 * mpSdk.Floor.showAll()
	 *   .then(function(){
	 *     // Show floors complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Error displaying all floors.
	 *   });
	 * ```
	 */
	showAll(): Promise<void>;
}
export declare namespace Label {
	export type Label = {
		position: Vector3;
		screenPosition: Vector2;
		sid: string;
		text: string;
		visible: boolean;
		/** @deprecated Use [[floorInfo]] instead */
		floor: number;
		floorInfo: {
			id: string;
			sequence: number;
		};
	};
	export enum Event {
		/** @event */
		POSITION_UPDATED = "label.positionupdated"
	}
}
export interface Label {
	Event: typeof Label.Event;
	/**
	 * This function returns the data of all labels.
	 *
	 * ```
	 * mpSdk.Label.getData()
	 *   .then(function(labels) {
	 *     // Label data retrieval complete.
	 *     console.log('Total labels: ' + labels.length);
	 *     console.log('Text of first label: ' + labels[0].text);
	 *     console.log('On-screen position of first label: ' + JSON.stringify(labels[0].position));
	 *   })
	 *   .catch(function(error) {
	 *     // Label data retrieval error.
	 *   });
	 * ```
	 */
	getData(): Promise<Label.Label[]>;
}
export declare namespace Mattertag {
	export type MattertagData = {
		sid: string;
		enabled: boolean;
		/** The world space position of the mattertag anchor within the model */
		anchorPosition: Vector3;
		/** The world space (non-normal) direction of the mattertag's stem */
		stemVector: Vector3;
		stemVisible: boolean;
		label: string;
		description: string;
		/** @deprecated */
		parsedDescription: DescriptionChunk[];
		media: {
			type: MediaType;
			src: string;
		};
		color: Color;
		/** @deprecated Use [[floorInfo]] instead */
		floorId: number;
		/** @deprecated Use [[floorInfo]] instead */
		floorIndex: number;
		floorInfo: {
			id: string;
			sequence: number;
		};
		/** @deprecated Use [[media.type]] instead */
		mediaType: MediaType;
		/** @deprecated Use [[media.src]] instead */
		mediaSrc: string;
		/** @deprecated Use [[stemVector]] instead */
		anchorNormal: Vector3;
		/** @deprecated Calculate the length of [[stemVector]] instead */
		stemHeight: number;
	};
	export type ObservableMattertagData = {
		sid: string;
		enabled: boolean;
		/** The world space position of the mattertag anchor within the model */
		anchorPosition: Vector3;
		/** The world space (non-normal) direction of the mattertag's stem */
		stemVector: Vector3;
		stemVisible: boolean;
		label: string;
		description: string;
		media: {
			type: MediaType;
			src: string;
		};
		color: Color;
		/** @deprecated Use [[floorInfo]] instead */
		floorIndex: number;
		floorInfo: {
			id: string;
			sequence: number;
		};
	};
	export enum Transition {
		INSTANT = "transition.instant",
		FLY = "transition.fly",
		FADEOUT = "transition.fade"
	}
	export interface DescriptionChunk {
		text?: string;
		link?: Link;
		type: DescriptionChunkType;
	}
	export interface Link {
		label: string;
		url: string;
		type: LinkType;
		navigationData?: any;
	}
	/**
	 * Options that can be specified when injection custom HTML into a Mattertag.
	 */
	export type InjectionOptions = {
		/** The size of the frame to create */
		size?: Size;
		/**
		 * The path between Showcase's window and your window (with the sdk).
		 *
		 * If you embed Showcase normally, this can be omitted.
		 *
		 * If you put Showcase within another level of iframe on your page, the path would be `'parent.parent'`; Showcase's parent is the iframe, the parent of that frame is your page.
		 *
		 * If you programmatically open Showcase in a new window, use `'opener'`.
		 *
		 * When using the Bundle SDK use `''`.
		 */
		windowPath?: string;
		/**
		 * A map for the three global functions we provide in your iframe sandbox.
		 * Only needs to be used if scripts you are importing also have a global `send`, `on`, or `off` function.
		 */
		messageFcnMapping?: MessengerFcnMapping;
	};
	/**
	 * Map the global functions we provide in your sandbox to other names.
	 */
	export type MessengerFcnMapping = {
		send?: string;
		on?: string;
		off?: string;
	};
	/**
	 * A messaging object to send and receive messages to and from your iframe sandbox.
	 */
	export interface IMessenger {
		/**
		 * Send a messages of type `eventType` to the iframe sandbox with any optional data associated with the message
		 */
		send(eventType: string, ...args: any[]): void;
		/**
		 * Add a handler for messages of type `eventType` from the iframe sandbox
		 */
		on(eventType: string, eventHandler: (...args: any[]) => void): void;
		/**
		 * Remove a handler for messages of type `eventType` from the iframe sandbox
		 */
		off(eventType: string, eventHandler: (...args: any[]) => void): void;
	}
	export type PreventableActions = {
		opening: boolean;
		navigating: boolean;
	};
	export enum LinkType {
		/** A link to another position in the current model */
		NAVIGATION = "tag.link.nav",
		/** A link to a different Matterport model */
		MODEL = "tag.link.model",
		/** An external link */
		EXT_LINK = "tag.link.ext"
	}
	export enum DescriptionChunkType {
		NONE = "tag.chunk.none",
		TEXT = "tag.chunk.text",
		LINK = "tag.chunk.link"
	}
	export enum Event {
		/** @event */
		HOVER = "tag.hover",
		/** @event */
		CLICK = "tag.click",
		/** @event */
		LINK_OPEN = "tag.linkopen"
	}
	export enum MediaType {
		NONE = "mattertag.media.none",
		PHOTO = "mattertag.media.photo",
		VIDEO = "mattertag.media.video",
		RICH = "mattertag.media.rich"
	}
	/**
	 * A subset of the MattertagData used to add Mattertags through the sdk.
	 * Most properties are optional except those used for positioning: `anchorPosition`, `stemVector`.
	 */
	export interface MattertagDescriptor {
		anchorPosition: Vector3;
		stemVector: Vector3;
		stemVisible?: boolean;
		label?: string;
		description?: string;
		media?: {
			type: MediaType;
			src: string;
		};
		color?: Color;
		/** @deprecated Use [[floorIndex]] instead */
		floorId?: number;
		floorIndex?: number;
		iconId?: string;
	}
	export type EditableProperties = {
		label: string;
		description: string;
		media: {
			type: MediaType;
			src: string;
		};
	};
	export interface PositionOptions {
		anchorPosition: Vector3;
		stemVector: Vector3;
		/** @deprecated Use [[floorIndex]] instead */
		floorId: number;
		floorIndex: number;
	}
}
export interface Mattertag {
	Transition: typeof Mattertag.Transition;
	LinkType: typeof Mattertag.LinkType;
	DescriptionChunkType: typeof Mattertag.DescriptionChunkType;
	Event: typeof Mattertag.Event;
	MediaType: typeof Mattertag.MediaType;
	/**
	 * This function returns metadata on the collection of Mattertags.
	 *
	 * ```
	 * mpSdk.Mattertag.getData()
	 *   .then(function(mattertags) {
	 *     // Mattertag data retreival complete.
	 *     if(mattertags.length > 0) {
	 *       console.log('First mattertag label: ' + mattertags[0].label);
	 *       console.log('First mattertag description: ' + mattertags[0].description);
	 *     }
	 *   })
	 *   .catch(function(error) {
	 *     // Mattertag data retrieval error.
	 *   });
	 * ```
	 * @deprecated Use the observable [[data]] collection instead
	 */
	getData(): Promise<Mattertag.MattertagData[]>;
	/**
	 * An observable collection of Mattertag data that can be subscribed to.
	 *
	 * When first subscribing, the current set of Mattertag will call the observer's `onAdded` for each Mattertag as the data becomes available.
	 *
	 * ```
	 * showcase.Mattertag.data.subscribe({
	 *   onAdded: function (index, item, collection) {
	 *     console.log('Mattertag added to the collection', index, item, collection);
	 *   },
	 *   onRemoved: function (index, item, collection) {
	 *     console.log('Mattertag removed from the collection', index, item, collection);
	 *   },
	 *   onUpdated: function (index, item, collection) {
	 *     console.log('Mattertag updated in place in the collection', index, item, collection);
	 *   }
	 * });
	 * ```
	 */
	data: IObservableMap<Mattertag.ObservableMattertagData>;
	/**
	 * This function navigates to the Mattertag disc with the provided sid, opening the billboard on arrival.
	 *
	 * ```
	 * mpSdk.Mattertag.navigateToTag(sid, mpSdk.Mattertag.Transition.FLY);
	 * ```
	 *
	 * @param tagSid The sid of the Mattertag to navigate to
	 * @param transition The type of transition to navigate to a sweep where the Mattertag disc is visible
	 */
	navigateToTag(tagSid: string, transition: Mattertag.Transition): Promise<string>;
	/**
	  * Get the disc's (3d) position of a Mattertag.
	  * The original data only represent the point that attaches the tag to the model.
	  *
	  * ```
	  * var mattertags; // get mattertag collection from mpSdk.Mattertag.getData
	  * var tagDiscPosition = mpSdk.Mattertag.getDiscPosition(mattertags[0]);
	  * ```
	  */
	getDiscPosition(tag: Mattertag.MattertagData, result?: Vector3): Vector3;
	/**
	 * Add one or more Mattertags to Showcase.
	 * Each input Mattertag supports setting the label, description, color, anchorPosition, and stemVector.
	 *
	 * Two properties are required:
	 * - `anchorPosition`, the point where the tag connects to the model
	 * - `stemVector`, the direction, aka normal, and height that the Mattertag stem points
	 *
	 * See [[Pointer.intersection]] for a way to retrive a new `anchorPosition` and `stemVector`.
	 *
	 * **Note**: these changes are not persisted between refreshes of Showcase. They are only valid for the current browser session.
	 *
	 * ```
	 * mpSdk.Mattertag.add([{
	 *  label: "New tag",
	 *  description: "This tag was added through the Matterport SDK",
	 *  anchorPosition: {
	 *    x: 0,
	 *    y: 0,
	 *    z: 0,
	 *  },
	 *  stemVector: { // make the Mattertag stick straight up and make it 0.30 meters (~1 foot) tall
	 *    x: 0,
	 *    y: 0.30,
	 *    z: 0,
	 *  },
	 *  color: { // blue disc
	 *    r: 0.0,
	 *    g: 0.0,
	 *    b: 1.0,
	 *  },
	 *  floorIndex: 0, // optional, if not specified the sdk will provide an estimate of the floor index for the anchor position provided.
	 * }])
	 * ```
	 *
	 * @param newTagData A single or array of Mattertag templates to add.
	 * @return A promise that resolves with the sids for the newly added Mattertags.
	 */
	add(newTagData: Mattertag.MattertagDescriptor | Mattertag.MattertagDescriptor[]): Promise<string[]>;
	/**
	 * Edit the data in a Mattertag billboard.
	 *
	 * **Note**: these changes are not persisted between refreshes of Showcase. They are only valid for the current browser session.
	 *
	 * ```
	 * mpSdk.Mattertag.editBillboard(sid, {
	 *   label: 'This is a new title',
	 *   description: 'This image was set dynamically by the Showcase sdk'
	 *   media: {
	 *     type: mpSdk.Mattertag.
	 *     src: 'https://www.image.site/image.jpg'
	 *   }
	 * });
	 * ```
	 * @param tagSid the sid of the Mattertag to edit
	 * @param properties A dictionary of properties to set
	 */
	editBillboard(tagSid: string, properties: Partial<Mattertag.EditableProperties>): Promise<void>;
	/**
	 * Move and reorient a Mattertag.
	 *
	 * See [[Pointer.intersection]] for a way to retrieve a new `anchorPosition` and `stemVector`.
	 *
	 * **Note**: these changes are not persisted between refreshes of Showcase. They are only valid for the current browser session.
	 *
	 * ```
	 * var mattertagData; // ... acquired through a previous call to mpSdk.Mattertag.getData();
	 *
	 * mpSdk.Mattertag.editPosition(mattertagData[0].sid, {
	 *  anchorPosition: {
	 *    x: 0,
	 *    y: 0,
	 *    z: 0,
	 *  },
	 *  stemVector: { // make the Mattertag stick straight up and make it 0.30 meters (~1 foot) tall
	 *    x: 0,
	 *    y: 0.30,
	 *    z: 0,
	 *  },
	 *  floorIndex: 2,
	 * });
	 * ```
	 * @param tagSid The sid of the Mattertag to reposition
	 * @param moveOptions The new anchorPosition, stemVector and/or floorId.
	 */
	editPosition(tagSid: string, moveOptions: Partial<Mattertag.PositionOptions>): Promise<void>;
	/**
	 * Edit the color of a Mattertag
	 *
	 * ```
	 * // acquired through a previous call to mpSdk.Mattertag.getData();
	 * var mattertagData;
	 *
	 * // change the first Mattertag to yellow
	 * mpSdk.Mattertag.editColor(mattertagData[0].sid, {
	 *   r: 0.9,
	 *   g: 0.9,
	 *   b: 0,
	 * });
	 * ```
	 *
	 * @param tagSid The sid of the Mattertag to edit
	 * @param color The new color to be applied to the Mattertag disc
	 */
	editColor(tagSid: string, color: Color): Promise<void>;
	/**
	 * Edit the opacity of a Mattertag
	 *
	 * ```
	 * // acquired through a previous call to mpSdk.Mattertag.getData();
	 * var mattertagData;
	 *
	 * // make the first Mattertag invisible
	 * mpSdk.Mattertag.editOpacity(mattertagData[0].sid, 0);
	 *
	 * // make another Mattertag transparent
	 * mpSdk.Mattertag.editOpacity(mattertagData[1].sid, 0.5);
	 *
	 * // and another completely opaque
	 * mpSdk.Mattertag.editOpacity(mattertagData[2].sid, 1);
	 * ```
	 *
	 * @param tagSid The sid of the Mattertag to edit
	 * @param opacity THe target opacity for the Mattertag in the range of [0, 1]
	 */
	editOpacity(tagSid: string, opacity: number): Promise<void>;
	/**
	 * Register an icon to use with subsequent [[Mattertag.editIcon]] calls.
	 *
	 * **Note**: It is recommended to host your own images to mitigate cross origin limitations.
	 *
	 * ```
	 * mpSdk.Mattertag.registerIcon('customIconId', 'https://[link.to/image]');
	 * ```
	 *
	 * @param iconId A user specified string to use as a lookup of this icon
	 * @param iconSrc The src of the icon, like the src of an <img>
	 */
	registerIcon(iconId: string, iconSrc: string): Promise<void>;
	/**
	 * Change the icon of the Mattertag disc
	 *
	 * **Note**: these changes are not persisted between refreshes of Showcase. They are only valid for the current browser session.
	 *
	 * ```
	 * // acquired through a previous call to mpSdk.Mattertag.getData();
	 * var mattertagData;
	 *
	 * // change the icon of the first Mattertag using the id used in a previously registeredIcon call
	 * mpSdk.Mattertag.editIcon(mattertagData[0].sid, 'customIconId');
	 * ```
	 *
	 * @param tagSid The sid of the Mattertag to edit
	 * @param iconId The id of the icon to apply
	 *
	 * **Errors**
	 *
	 * Warns if the provided `iconSrc` is an .svg file which doesn't have a `'width'` or `'height'` attribute. Defaults to a resolution of 128x128 if neither exist.
	 */
	editIcon(tagSid: string, iconId: string): Promise<void>;
	/**
	 * Resets the icon of the Mattertag disc back to its original icon.
	 *
	 * ```
	 * // acquired through a previous call to mpSdk.Mattertag.getData();
	 * var mattertagData;
	 *
	 * // reset the icon of the first Mattertag to its original
	 * mpSdk.Mattertag.resetIcon(mattertagData[0].sid);
	 * ```
	 *
	 * @param tagSid The sid of the Mattertag to reset
	 */
	resetIcon(tagSid: string): Promise<void>;
	/**
	 * Removes one or more Mattertags from Showcase.
	 *
	 * **Note**: these changes are not persisted between refreshes of Showcase. They are only valid for the current browser session.
	 *
	 * ```
	 * var mattertagData; // ... acquired through a previous call to mpSdk.Mattertag.getData();
	 * var first = mattertagData[0];
	 * mpSdk.Mattertag.remove(first.sid);
	 *
	 * var second = mattertagData[1];
	 * var third = mattertagData[2];
	 * mpSdk.Mattertag.remove([second.sid, third.sid]);
	 * ```
	 * @param tagSids A single Mattertag sid or array of Mattertag sids to remove.
	 * @return A promise with an array of Mattertag sids that were actually removed.
	 */
	remove(tagSids: string | string[]): Promise<string[]>;
	/**
	 * Prevents the "default" Showcase action on a Mattertag from occurring: hover to open billboard, click to navigate to view.
	 *
	 * ```
	 * var mattertagData; // ... acquired through a previous call to mpSdk.Mattertag.getData();
	 *
	 * // prevent navigating to the tag on click
	 * var noNavigationTag = mattertagData[0];
	 * mpSdk.Mattertag.preventAction(noNavigationTag.sid, {
	 *   navigating: true,
	 * });
	 *
	 * // prevent the billboard from showing
	 * var noBillboardTag = mattertagData[1];
	 * mpSdk.Mattertag.preventAction(noBillboardTag.sid, {
	 *   opening: true,
	 * });
	 *
	 * var noActionsTag = mattertagData[2];
	 * mpSdk.Mattertag.preventAction(noActionsTag.sid, {
	 *   opening: true,
	 *   navigating: true,
	 * });
	 * ```
	 *
	 * @param tagSid The sid of the Mattertag to remove actions from
	 * @param actions The set of actions to prevent
	 */
	preventAction(tagSid: string, actions: Partial<Mattertag.PreventableActions>): Promise<void>;
	/**
	 * Add a custom frame that can host custom HTML and JavaScript, and communicate bi-directionally with your page.
	 *
	 * The frame that contains your custom code will have certain limitations due to being sandboxed by the `sandbox='allow-scripts` attribute.
	 * Attempting to access properties of other windows will also be blocked by the browser. ([see the MDN pages about iframe sandbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe))
	 *
	 * Currently, the HTML CAN ONLY BE SET ONCE by a call to `injectHTML`. This includes removing or clearing the HTML.
	 *
	 * ```
	 * var mattertagData; // ... acquired through a previous call to mpSdk.Mattertag.getData();
	 *
	 * // create a 100x50px button within the Mattertag and send out an ID when it is clicked
	 * var htmlToInject = ' \
	 *   <style> \
	 *     button { \
	 *       width: 100px; \
	 *       height: 50px; \
	 *     } \
	 *   </style> \
	 *   <button id="btn1">CLICK ME</button> \
	 *   <script> \
	 *     var btn1 = document.getElementById("btn1"); \
	 *     btn1.addEventListener("click", function () { \
	 *       window.send("buttonClick", 12345); \
	 *     }); \
	 *   </script>';
	 *
	 * mpSdk.Mattertag.injectHTML(mattertagData[0], htmlToInject, {
	 *   size: {
	 *     w: 100,
	 *     h: 50,
	 *   }
	 * })
	 *   .then(function (messenger) {
	 *     messenger.on("buttonClick", function (buttonId) {
	 *       console.log('clicked button with id:', buttonId);
	 *     });
	 *   });
	 *
	 * ```
	 */
	injectHTML(tagSid: string, html: string, options: Mattertag.InjectionOptions): Promise<Mattertag.IMessenger>;
}
export declare namespace Measurements {
	export type MeasurementData = {
		sid: string;
		label: string;
		floor: number;
		start: Vector3;
		end: Vector3;
	};
	/**
	 * The data associated with Showcase's measurement mode
	 */
	export type MeasurementModeData = {
		/** A unique identifier for this measurement */
		sid: string;
		/** The list of wold-space coordinates that compose this measurement */
		points: Vector3[];
	};
	export type State = {
		active: boolean;
	};
}
export interface Measurements {
	/**
	 * This function returns metadata on the collection of Measurements.
	 *
	 * ```
	 * mpSdk.Measurement.getData()
	 *   .then(function(Measurements) {
	 *     // Measurement data retreival complete.
	 *     if(Measurements.length > 0) {
	 *       console.log('First Measurement label: ' + Measurements[0].label);
	 *       console.log('First Measurement description: ' + Measurements[0].description);
	 *     }
	 *   })
	 *   .catch(function(error) {
	 *     // Measurement data retrieval error.
	 *   });
	 * ```
	 */
	getData(): Promise<Measurements.MeasurementData[]>;
	/**
	 * An observable collection of measurement mode data that can be subscribed to.
	 *
	 * ```
	 * showcase.Measurements.data.subscribe({
	 *   onAdded: function (index, item, collection) {
	 *     console.log('item added to the collection', index, item, collection);
	 *   },
	 *   onRemoved: function (index, item, collection) {
	 *     console.log('item removed from the collection', index, item, collection);
	 *   },
	 *   onUpdated: function (index, item, collection) {
	 *     console.log('item updated in place in the collection', index, item, collection);
	 *   },
	 *   onCollectionUpdated: function (collection) {
	 *     console.log('the entire up-to-date collection', collection);
	 *   }
	 * });
	 * ```
	 */
	data: IObservableMap<Measurements.MeasurementModeData>;
	/**
	 * Activate or deactivate measurement mode. This function can only be used after the application has started playing. Use [[App.state]] to determine the phase of the application.
	 *
	 * ```
	 * showcase.Measurements.toggleMode(true)
	 *   .then(() => {
	 *     console.log('measurement mode is now active');
	 *   });
	 * ```
	 */
	toggleMode(activate: boolean): Promise<void>;
	/**
	   * An observable measurement mode state object.
	   *
	   * ```
	   * mpSdk.Measurements.mode.subscribe(function (measurementModeState) {
	   *  // measurement mode state has changed
	   *  console.log('Is measurement mode currently active? ', measurementModeState.active);
	   * });
	   *
	   * // output
	   * // > Is measurement mode currently active? true
	   * ```
	   */
	mode: IObservable<Measurements.State>;
}
export declare namespace Sweep {
	export type SweepData = {
		/** @deprecated Use [[sid]] instead */
		uuid: string;
		sid: string;
		alignmentType: Alignment;
		placementType: Placement;
		neighbors: string[];
		position: Vector3;
		rotation: Vector3;
		floor: number;
	};
	export type ObservableSweepData = {
		/** @deprecated Use [[id]] instead */
		uuid: string;
		/** @deprecated Use [[id]] instead */
		sid: string;
		id: string;
		enabled: boolean;
		alignmentType: Alignment;
		placementType: Placement;
		neighbors: string[];
		position: Vector3;
		rotation: Vector3;
		floorInfo: SweepFloorInfo | EmptySweepFloorInfo;
	};
	export type SweepFloorInfo = {
		id: string;
		sequence: number;
	};
	export type EmptySweepFloorInfo = {
		id: undefined;
		sequence: undefined;
	};
	/**
	 * `rotation.x`: is the amount the camera will rotate up/down, in the range between [-90…90] with -90 being straight down and 90 being straight up, 45 would be looking up at a 45 degree angle., -45 down etc..
	 * `rotation.y`: is the amount the camera rotate around horizontally, between [-360…0…360], negative values to rotate to the left, positive to rotate to the right.
	 *
	 * Note: The rotation that Sweep.moveTo uses for input is the same rotation that will get returned from the [[Camera.pose]] property.
	 *
	 * ```
	 * const cachedPose = null;
	 * mpSdk.Camera.pose.subscribe(function (pose) {
	 *   cachedPose = pose;
	 * })
	 *
	 * // If the pose is returned immediately.
	 * console.log(cachedPose.rotation);
	 * ```
	 */
	export type MoveToOptions = {
		rotation?: Rotation;
		transition?: Transition;
		/**
		 * Total transition time in milliseconds.
		 */
		transitionTime?: number;
	};
	export enum Event {
		/**
		 * @event
		 */
		ENTER = "sweep.enter",
		EXIT = "sweep.exit"
	}
	export enum Transition {
		INSTANT = "transition.instant",
		FLY = "transition.fly",
		FADEOUT = "transition.fade"
	}
	export enum Alignment {
		ALIGNED = "aligned",
		UNALIGNED = "unaligned"
	}
	export enum Placement {
		UNPLACED = "unplaced",
		AUTO = "auto",
		MANUAL = "manual"
	}
}
export interface Sweep {
	Event: typeof Sweep.Event;
	Transition: typeof Sweep.Transition;
	Alignment: typeof Sweep.Alignment;
	Placement: typeof Sweep.Placement;
	/**
	 * An observable collection of sweep data that can be subscribed to.
	 *
	 * ```
	 * showcase.Sweep.data.subscribe({
	 *   onAdded: function (index, item, collection) {
	 *     console.log('sweep added to the collection', index, item, collection);
	 *   },
	 *   onRemoved: function (index, item, collection) {
	 *     console.log('sweep removed from the collection', index, item, collection);
	 *   },
	 *   onUpdated: function (index, item, collection) {
	 *     console.log('sweep updated in place in the collection', index, item, collection);
	 *   },
	 *   onCollectionUpdated: function (collection) {
	 *     console.log('the entire up-to-date collection', collection);
	 *   }
	 * });
	 * ```
	 */
	data: IObservableMap<Sweep.ObservableSweepData>;
	/**
	 * An observable for the player's current sweep.
	 *
	 * If the camera is transitioning to or is currently in Dollhouse or Floorplan mode, or if the camera is transitioning between sweeps,
	 * the `currentSweep` argument in the registered callback will be a "default" sweep that has an empty `sid` property.
	 *
	 * If the sweep is an unaligned, unplaced 360º view, `currentSweep.floorInfo.id` and `currentSweep.floorInfo.sequence` will both be `undefined`.
	 *
	 * Use this table with the results of `sid`, `floorInfo.sequence`, and `floorInfo.id` to determine the current of the three possible states.
	 *
	 * |                    | at sweep                | transitioning | in unplaced  360º view |
	 * |--------------------|-------------------------|---------------|------------------------|
	 * | sid                | `${current.sid}`        | ''            | `${current.sid}`       |
	 * | floorInfo.sequence | `${floorInfo.sequence}` | undefined     | undefined              |
	 * | floorInfo.id       | `${floorInfo.id}`       | undefined     | undefined              |
	 *
	 * ```
	 * mpSdk.Sweep.current.subscribe(function (currentSweep) {
	 *   // Change to the current sweep has occurred.
	 *   if (currentSweep.sid === '') {
	 *     console.log('Not currently stationed at a sweep position');
	 *   } else {
	 *     console.log('Currently at sweep', currentSweep.sid);
	 *     console.log('Current position', currentSweep.position);
	 *     console.log('On floor', currentSweep.floorInfo.sequence);
	 *   }
	 * });
	 * ```
	 */
	current: IObservable<Sweep.ObservableSweepData>;
	/**
	 * Move to a sweep.
	 *
	 *```
	 * const sweepId = '1';
	 * const rotation = { x: 30, y: -45 };
	 * const transition = mpSdk.Sweep.Transition.INSTANT;
	 * const transitionTime = 2000; // in milliseconds
	 *
	 * mpSdk.Sweep.moveTo(sweepId, {
	 *     rotation: rotation,
	 *     transition: transition,
	 *     transitionTime: transitionTime,
	 *   })
	 *   .then(function(sweepId){
	 *     // Move successful.
	 *     console.log('Arrived at sweep ' + sweepId);
	 *   })
	 *   .catch(function(error){
	 *     // Error with moveTo command
	 *   });
	 * ```
	 *
	 * @param The destination sweep.
	 * @param Options.
	 * @returns A promise that will return the destination sweep.
	 */
	moveTo(sweep: string, options: Sweep.MoveToOptions): Promise<string>;
	/**
	 * Enable a set of sweeps by ids.
	 *
	 * Enabling a sweep will show the sweep's puck and allow the player to navigate to that location.
	 *
	 * ```
	 * mpSdk.Sweep.enable('sweep1', 'sweep2', 'sweep3');
	 * ```
	 *
	 * @param sweepIds
	 */
	enable(...sweepIds: string[]): Promise<void>;
	/**
	 * Disable a set of sweeps by ids.
	 *
	 * Disabling a sweep will hide the sweep's puck and prevent the player's ability to navigate to that location.
	 *
	 *
	 * ```
	 * mpSdk.Sweep.disable('sweep1', 'sweep2', 'sweep3');
	 * ```
	 *
	 * @param sweepIds
	 */
	disable(...sweepIds: string[]): Promise<void>;
}
export declare namespace Model {
	export type ModelData = {
		sid: string;
		/** @deprecated Use [[Sweep.data]] instead */
		sweeps: Sweep.SweepData[];
		modelSupportsVr: boolean;
	};
	export type ModelDetails = {
		sid: string;
		name?: string;
		presentedBy?: string;
		summary?: string;
		address?: string;
		formattedAddress?: string;
		contactEmail?: string;
		contactName?: string;
		phone?: string;
		formattedContactPhone?: string;
		shareUrl?: string;
	};
	export enum Event {
		/** @event */
		MODEL_LOADED = "model.loaded"
	}
}
export interface Model {
	Event: typeof Model.Event;
	/**
	 * This function returns basic model information.
	 *
	 * This is no longer the canonical way to receive sweep information. See [[Sweep.data]].
	 *
	 * ```
	 * mpSdk.Model.getData()
	 *   .then(function(model) {
	 *     // Model data retreival complete.
	 *     console.log('Model sid:' + model.sid);
	 *   })
	 *   .catch(function(error) {
	 *     // Model data retrieval error.
	 *   });
	 * ```
	 */
	getData(): Promise<Model.ModelData>;
	/**
	 * This function returns model details.
	 *
	 * ```
	 * mpSdk.Model.getDetails()
	 *   .then(function(modelDetails) {
	 *     // Model details retreival complete.
	 *     console.log('Model sid:' + modelDetails.sid);
	 *     console.log('Model name:' + modelDetails.name);
	 *     console.log('Model summary:' + modelDetails.summary);
	 *   })
	 *   .catch(function(error) {
	 *     // Model details retrieval error.
	 *   });
	 * ```
	 */
	getDetails(): Promise<Model.ModelDetails>;
}
export declare namespace Pointer {
	export type Intersection = {
		position: Vector3;
		normal: Vector3;
		/** @deprecated Use [[floorIndex]] instead */
		floorId: number | undefined;
		/**
		 * floorIndex is only defined when the intersected object is MODEL.
		 */
		floorIndex: number | undefined;
		object: Colliders;
	};
	export enum Colliders {
		NONE = "intersectedobject.none",
		MODEL = "intersectedobject.model",
		TAG = "intersectedobject.tag",
		SWEEP = "intersectedobject.sweep",
		UNKNOWN = "intersectedobject.unknown"
	}
}
export interface Pointer {
	Colliders: typeof Pointer.Colliders;
	/**
	 * An observable intersection data object that can be subscribed to.
	 *
	 * ```
	 * mpSdk.Pointer.intersection.subscribe(function (intersectionData) {
	 *  // Changes to the intersection data have occurred.
	 *  console.log('Intersection position:', intersectionData.position);
	 *  console.log('Intersection normal:', intersectionData.normal);
	 * });
	 * ```
	 */
	intersection: IObservable<Pointer.Intersection>;
}
export declare namespace Renderer {
	export type Resolution = {
		width: number;
		height: number;
	};
	export type Visibility = {
		measurements: boolean;
		mattertags: boolean;
		sweeps: boolean;
		views: boolean;
	};
	export type WorldPositionData = {
		position: Vector3 | null;
		/** @deprecated Use [[floorInfo]] */
		floor: number;
		floorInfo: {
			id: string;
			sequence: number;
		};
	};
}
export interface Renderer {
	/**
	 * Takes a screenshot (JPEG) of the user’s current view.
	 *
	 * ```
	 * const resolution = {
	 *   width: 600,
	 *   height: 800
	 * };
	 *
	 * const visibility = {
	 *   mattertags: false,
	 *   sweeps: true
	 * };
	 *
	 * mpSdk.Renderer.takeScreenShot(resolution, visibility)
	 *   .then(function (screenShotUri) {
	 *     // set src of an img element
	 *     img.src = screenShotUri
	 * });
	 * ```
	 *
	 * @param resolution The desired resolution for the screenshot.
	 * For example: `{width: 1920, height: 1080}`
	 * If no resolution is specified, then the resolution of the size of
	 * Showcase (the current window or the iframe embed) is used. Maximum 4096 x 4096.
	 * @param visibility Toggles certain scene objects such as Mattertag Posts and sweep markers.
	 * If no visibility object is specified, then all scene objects are hidden.
	 * @return A promise that resolves with the screenshot URI -- a base64 encoded string which is usable as a src of an `<img>` element.
	 *
	 * **Errors**
	 *
	 * Warns if the resolution is 0 or negative.
	 *
	 */
	takeScreenShot(resolution?: Renderer.Resolution, visibility?: Partial<Renderer.Visibility>): Promise<string>;
	/**
	 * Takes an equirectangular screenshot (JPEG) of the currently active sweep.
	 *
	 * ```
	 * mpSdk.Renderer.takeEquirectangular()
	 *   .then(function (screenShotUri) {
	 *     // set src of an img element
	 *     img.src = screenShotUri
	 * });
	 * ```
	 *
	 * @return A promise that resolves with the screenshot URI -- a base64 encoded string which is usable as a src of an `<img>` element.
	 *
	 * **Errors**
	 *
	 * Warns if the camera is not in Panorama mode and is instead in Dollhouse or Floorplan mode.
	 *
	 * **Notes**
	 *
	 * It is not on Matterport servers and does not persist between user sessions.
	 */
	takeEquirectangular(): Promise<string>;
	/**
	 * Converts a screen position into a world position
	 *
	 * If the height is not passed in, the function returns the first raycast hit in the direction of that screen position.
	 * However, if there is no intersection with the model in that direction, the position will be null and the floor will be -1.
	 *
	 * ```
	 * const screenPosition {x: 0, y: 0}; // Top left corner of the screen
	 *
	 * mpSdk.Renderer.getWorldPositionData(screenPosition)
	 * .then(function(data){
	 *    const worldPosition = data.position; // e.g. {x: 2.2323231, y: 4.7523232, z; 7.92893};
	 *    const floor = data.floor; // e.g. 2
	 * });
	 * ```
	 *
	 * If the height is passed in, the function returns the intersection with the plane at that height. However,
	 * if there is no intersection with the plane in that direction, the position will be null and the floor will be -1.
	 *
	 * ```
	 * const screenPosition {x: 0, y: 0}; // Top left corner of the screen
	 * const height = 20;
	 *
	 * mpSdk.Renderer.getWorldPositionData(screenPosition, height)
	 * .then(function(data){
	 *    const worldPosition = data.position; // e.g. {x: 2.2323231, y: 20, z; 7.92893};
	 *    const floor = data.floor // e.g. 2
	 * });
	 * ```
	 * @param {Vector2} screenPosition The screen position in pixels from the top-left corner of the screen.
	 * For example, `{x: 300, y: 200}` would be the position 300 pixels right and 200 pixels down from the top-left corner.
	 * @param {number} [height] Optional parameter for the height of the horizontal plane to intersect. If not provided, the
	 * closest intersection with the model in that direction will be returned.
	 * @param {boolean} [includeHiddenFloors] Optional parameter that will include floors that are hidden and ghosted
	 * when determining the closest intersection with the model.
	 *
	 * **Notes**
	 *
	 * Returns null position if the direction of the screen position does not intersect with the model, or if a height was given,
	 * if the the direction does not intersect with the plane at the given height.
	 */
	getWorldPositionData(screenPosition: Vector2, height?: number, includeHiddenFloors?: boolean): Promise<Renderer.WorldPositionData>;
	/**
	 * @deprecated Use [[Conversion.worldToScreen]] to convert a 3d position to a point on screen.
	 */
	getScreenPosition(worldPosition: Vector3): Promise<Vector2>;
}
export declare namespace Room {
	export type RoomData = {
		id: string;
		bounds: {
			min: Vector3;
			max: Vector3;
		};
		floorInfo: {
			id: string;
			sequence: number;
		};
		size: Vector3;
		center: Vector3;
	};
}
export interface Room {
	/**
	 * An observable to determine which rooms the player's camera is currently in.
	 *
	 * If the camera is in a location between rooms, or somehwere where our room bounds overlap, the `rooms` array will contain both (or more) rooms.
	 * If the camera is in a mode other than `INSIDE`, the `rooms` array may be empty.
	 * If the camera is in an unaligned sweep, the `rooms` array will be empty.
	 *
	 * ```
	 * mpSdk.Room.current.subscribe(function (currentRooms) {
	 *   if (currentRooms.rooms.length > 0) {
	 *     console.log('currently in', currentRooms.rooms.length, 'rooms');
	 *   } else {
	 *     console.log('Not currently inside any rooms');
	 *   }
	 * });
	 * ```
	 */
	current: IObservable<{
		rooms: Room.RoomData[];
	}>;
	/**
	 * An observable collection of Room data that can be subscribed to.
	 *
	 * See [[IObservableMap]] to learn how to receive data from the collection.
	 *
	 * ```
	 * showcase.Room.data.subscribe({
	 *   onCollectionUpdated: function (collection) {
	 *     console.log('Collection received. There are ', Object.keys(collection).length, 'rooms in the collection');
	 *   }
	 * });
	 * ```
	 */
	data: IObservableMap<Room.RoomData>;
}
export declare namespace Scene {
	type THREE = typeof THREE;
	type PredefinedOutputs = {
		/**
		* Set this to any Object3D and it will be added to the scene.
		*/
		objectRoot?: THREE.Object3D | null;
		/**
		 * Set this to any Object3D and it will be interactable. See [[IComponent.onEvent]]
		 */
		collider?: THREE.Object3D | null;
	};
	export enum InteractionType {
		CLICK = "INTERACTION.CLICK",
		HOVER = "INTERACTION.HOVER",
		DRAG = "INTERACTION.DRAG",
		DRAG_BEGIN = "INTERACTION.DRAG_BEGIN",
		DRAG_END = "INTERACTION.DRAG_END",
		POINTER_MOVE = "INTERACTION.POINTER_MOVE",
		POINTER_BUTTON = "INTERACTION.POINTER_BUTTON",
		SCROLL = "INTERACTION.SCROLL",
		KEY = "INTERACTION.KEY",
		LONG_PRESS_START = "INTERACTION.LONG_PRESS_START",
		LONG_PRESS_END = "INTERACTION.LONG_PRESS_END",
		MULTI_SWIPE = "INTERACTION.MULTI_SWIPE",
		MULTI_SWIPE_END = "INTERACTION.MULTI_SWIPE_END",
		PINCH = "INTERACTION.PINCH",
		PINCH_END = "INTERACTION.PINCH_END",
		ROTATE = "INTERACTION.ROTATE",
		ROTATE_END = "INTERACTION.ROTATE_END"
	}
	export type Intersect = {
		point: THREE.Vector3;
		normal: THREE.Vector3;
		collider: THREE.Object3D;
	};
	/**
	 * **Scene Node**
	 *
	 * A scene node is an object with a 3D transform: position, rotation, and scale.
	 * It can contain a collection of components and manages their life cycle.
	 *
	 * A scene node has the following states:
	 *
	 * **Initializing** - after construction but before start has been called<br>
	 * **Updating** - after start has been called but before stop has been called<br>
	 * **Destroyed** - after stop has been called
	 *
	 * Components can only be added during the Initializing state. A scene node cannot be restarted.
	 *
	 * ```
	 * sdk.Scene.createNode().then(function(node) {
	 *    node.addComponent('mp.gltfLoader', {
	 *      url: 'http://www.someModelSite.com/rabbit.gltf'
	 *    });
	 *
	 *    node.position.set(0, 1, 0);
	 *    node.start();
	 * });
	 * ```
	 *
	 * Setting the position, rotation, or scale of a scene node affects child components.
	 *
	 */
	export interface INode {
		/**
		 * Instantiates a component and adds it to the nodes internal component list.
		 * This function does nothing if the node is in the Operating or Destroyed state.
		 * @param name The registered component name.
		 * @param initialInputs initial key-value pairs that will be applied to the component before onInit is called. If the keys do not match the components inputs, they are ignored.
		 * @param id an optional id for this component, if not specified an id will be computed for the component.
		 *
		 * @returns The newly created component.
		 */
		addComponent(name: string, initialInputs?: Record<string, unknown>, id?: string): IComponent;
		/**
		 * Transitions the node to Operating if it is in the Initializing state.
		 * Calling this function has no effect if the node is already Operating.
		 */
		start(): void;
		/**
		 * Transitions the node to Destroyed state if it is in any state.
		 * Calling this function has no effect if the node is already Destroyed.
		 */
		stop(): void;
		/**
		 * The read-only name. This value is set during scene import.
		 */
		readonly name: string;
		/**
		 * The scene node position. You can call methods on this object to set its values.
		 * See <https://threejs.org/docs/#api/en/math/Vector3>
		 */
		readonly position: THREE.Vector3;
		/**
		 * The scene node rotation. You can call methods on this object to set its values.
		 * See <https://threejs.org/docs/#api/en/math/Quaternion>
		 */
		readonly quaternion: THREE.Quaternion;
		/**
		 * The scene node scale vector. You can call methods on this object to set its values.
		 * See <https://threejs.org/docs/#api/en/math/Vector3>
		 */
		readonly scale: THREE.Vector3;
		/**
		 * A read-only unique id used to reference this node in a path binding.
		 * This id is autogenerated unless it is specifed and created via the Scene.Object.
		 */
		readonly id: string;
	}
	/**
	 * **Component Context**<br>
	 * The context object contains the three.js module and the main aspects of the rendering engine.<br>
	 * The camera, scene, or renderer may will likely be replaced in the future with an sdk module.
	 *
	 * ```
	 * function Cylinder() {
	 *    this.onInit = function() {
	 *      var THREE = this.context.three;
	 *      var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
	 *      var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	 *      var cylinder = new THREE.Mesh( geometry, material );
	 *    };
	 * }
	 * ```
	 */
	export interface IComponentContext {
		/**
		 * The r124 three.js module.
		 */
		three: THREE;
		/**
		 * The showcase three.js renderer.<br>
		 * See <a href="https://threejs.org/docs/#api/en/renderers/WebGLRenderer" target="_blank">https://threejs.org/docs/#api/en/renderers/WebGLRenderer</a>
		 */
		renderer: THREE.WebGLRenderer;
		/**
		 * The showcase scene.<br>
		 * See <a href="https://threejs.org/docs/#api/en/scenes/Scene" target="_blank">https://threejs.org/docs/#api/en/scenes/Scene</a>
		 *
		 */
		scene: THREE.Scene;
		/**
		 * The main camera. It is read-only.<br>
		 * See <a href="https://threejs.org/docs/#api/en/cameras/Camera" target="_blank">https://threejs.org/docs/#api/en/cameras/Camera</a>
		 */
		camera: THREE.Camera;
	}
	/**
	 * IComponent
	 *
	 * Use this interface to implement a component and register it with the sdk.
	 *
	 * ```
	 * function Box() {
	 *    this.inputs = {
	 *      visible: false,
	 *    };
	 *
	 *    this.onInit = function() {
	 *      var THREE = this.context.three;
	 *      var geometry = new THREE.BoxGeometry(1, 1, 1);
	 *      this.material = new THREE.MeshBasicMaterial();
	 *      var mesh = new THREE.Mesh( geometry, this.material );
	 *      this.outputs.objectRoot = mesh;
	 *    };
	 *
	 *    this.onEvent = function(type, data) {
	 *    }
	 *
	 *    this.onInputsUpdated = function(previous) {
	 *    };
	 *
	 *    this.onTick = function(tickDelta) {
	 *    }
	 *
	 *    this.onDestroy = function() {
	 *      this.material.dispose();
	 *    };
	 * }
  
	 * function BoxFactory() {
	 *    return new Box();
	 * }
	 *
	 * // Registering the component with the sdk
	 * sdk.Scene.register('box', BoxFactory);
	 *
	 * ```
	 */
	export interface IComponent {
		/**
		 * An optional dictionary of properties that affects the behavior of the component.
		 * These properties can be changed by an external source at any time. It is up to the component
		 * to respond appropriately to the changes. These input properties can also be bind targets to an
		 * observable source e.g. the output property of another component.
		 */
		inputs?: Record<string, unknown>;
		/**
		 * An optional dictionary of properties that this component computes.
		 * This dictionary is observable and can be the source of a bind target.
		 *
		 * objectRoot and collider are reserved properties which are added to all components automatically.
		 * The value set to objectRoot will get added to the scene graph as a child of the scene node.
		 * The value set to collider will get included in raycast hit detection.
		 *
		 * ```
		 * function Box() {
		 *    this.onInit = function() {
		 *      var THREE = this.context.three;
		 *      var geometry = new THREE.BoxGeometry(1, 1, 1);
		 *      this.material = new THREE.MeshBasicMaterial();
		 *      var mesh = new THREE.Mesh( geometry, this.material );
		 *
		 *      this.outputs.objectRoot = mesh;   // gets added to the scene node
		 *      this.outputs.collider = mesh;     // will now be part of raycast testing
		 *    }
		 * }
		 * ```
		 */
		outputs?: Record<string, unknown> & PredefinedOutputs;
		/**
		 * The context provides access to the underlying rendering engine. The sdk framework adds it
		 * to the component during construction.
		 */
		context: IComponentContext;
		/**
		 * This function is called once after the scene node its attached to has started.
		 */
		onInit?(): void;
		/**
		 * This function is called once for each interaction or event that occurred during the last frame.
		 * The component must set outputs.collider with an Object3D to get interaction callbacks or bindEvent to receive other events.
		 */
		onEvent?(eventType: string | InteractionType, eventData?: unknown): void;
		/**
		 * This function is called after one or more input properties have changed.
		 * It will be called at most once a frame.
		 */
		onInputsUpdated?(previousInputs: Record<string, unknown>): void;
		/**
		 *  This function is called once a frame after input changes have been detected.
		 */
		onTick?(tickDelta: number): void;
		/**
		 * This function is called once right before the scene node has stopped.
		 */
		onDestroy?(): void;
		/**
		 * Call this function to bind an input property to an output property on another
		 * component.
		 *
		 * ```
		 * Promise.all([
		 *    sdk.Scene.createNode(),
		 *    sdk.Scene.createNode(),
		 * ]).then(function(nodes) {
		 *    var node1 = nodes[0];
		 *    var node2 = nodes[1];
		 *
		 *    // mp.objLoader has an outputs.visible property
		 *    var comp1 = node1.addComponent(`mp.objLoader');
		 *
		 *    // myComponent has an inputs.toggleState property
		 *    var comp2 = node2.addComponent('myComponent');
		 *
		 *    comp1.bind('visible', comp2, 'toggleState');
		 *
		 *    node1.start();
		 *    node2.start();
		 *
		 *    // comp1.inputs.visible will now always equal comp2.outputs.toggleState
		 * });
		 *
		 * ```
		 * @param prop inputs property name
		 * @param src source component
		 * @param srcProp source outputs property name
		 */
		bind(prop: string, src: Record<string, unknown>, srcProp: string): void;
		/**
		 * Notifies this component of an `eventType` when the `src` Component calls `notify` with a `srcEventType` event
		 */
		bindEvent(eventType: string, src: IComponent, srcEventType: string): void;
		/**
		 * Spy on a component's notify from outside of the component system
		 * @returns {ISubscription} an object responsible for removing the spy
		 */
		spyOnEvent(spy: IComponentEventSpy): ISubscription;
	}
	/**
	 * A spy that can be attached to be notified of a component events using `spyOnEvent`
	 */
	export interface IComponentEventSpy<T = unknown> {
		/**
		 * The type of event to spy on
		 */
		readonly eventType: string;
		/**
		 * Called when the attached component notifies of an `eventType` event
		 * @param eventData
		 */
		notify(eventData?: T): void;
	}
	export interface IComponentDesc {
		name: string;
		factory: () => IComponent;
	}
	/**
	 * A descriptor for a component property contained by a scene object.
	 */
	type PathDesc = {
		/**
		 * The user defined id of the path. This id must be a unique string for the scene object.
		 */
		id: string;
		/**
		 * The parent scene node of the component.
		 */
		node: Scene.INode;
		/**
		 * The component.
		 */
		component: IComponent;
		/**
		 * The input or output property name of the component.
		 */
		property: string;
	};
	/**
	 * A factory and container for a collection of scene nodes and components connected via property bindings.
	 */
	export interface IObject {
		/**
		 * Adds a scene node to this scene object and returns it. If an id isn't provided, one will be autogenerated.
		 *
		 * @param id a optional unique id
		 *
		 * @return The new scene node.
		 */
		addNode(id?: string): INode;
		/**
		 * Starts all nodes referenced by this scene object.
		 */
		start(): void;
		/**
		 * Stops all nodes referenced by this scene object. The scene object cannot be restarted after this function has been called.
		 */
		stop(): void;
		/**
		 * Call this function to bind an input property of the target component to an output property of the source
		 * component between any nodes contained by this scene object.
		 *
		 * @param targetComponent The component listening to property changes.
		 * @param targetProp  The component input property name.
		 * @param sourceComponent The component broadcasting property changes.
		 * @param sourceProp The component output property name.
		 */
		bind(targetComponent: IComponent, targetProp: string, sourceComponent: IComponent, sourceProp: string): void;
		/**
		 * Add a path identified by a unique string.
		 *
		 * @param pathDesc The path descriptor to the component property.
		 */
		addPath(pathDesc: PathDesc): void;
		/**
		 * Sets the input property of a path. The path must be added prior to calling this function.
		 *
		 * @param pathId The path id.
		 * @param value The value to set.
		 */
		setValueAtPath(pathId: string, value: unknown): void;
		/**
		 * Reads the output property of a path. The path must be added prior to calling this function.
		 *
		 * @param pathId
		 * @returns the value of the output property.
		 */
		getValueAtPath(pathId: string): unknown;
	}
}
export interface Scene {
	InteractionType: typeof Scene.InteractionType;
	/**
	 * This is a convenience function that provides access to three.js framework objects.
	 * Typically used to configure global properties on the renderer or effect composer.
	 *
	 * ```
	 * await sdk.Scene.configure(function(renderer, three, effectComposer){
	 *   // configure PBR
	 *   renderer.physicallyCorrectLights = true;
	 *
	 *   // configure shadow mapping
	 *   renderer.shadowMap.enabled = true;
	 *   renderer.shadowMap.bias = 0.0001;
	 *   renderer.shadowMap.type = three.PCFSoftShadowMap;
	 *
	 *   if (effectsComposer) {
	 *     // add a custom pass here
	 *   }
	 * });
	 * ```
	 *
	 * @param callback.renderer Matterport's WebGLRenderer object.
	 * @param callback.three The r124 three.js module.
	 * @param callback.effectComposer Matterport's EffectComposer object. This value can be null. To enable the effect composer, you must set useEffectComposer: 1 in your application config.
	 */
	configure(callback: (renderer: THREE.WebGLRenderer, three: typeof THREE, effectComposer: EffectComposer | null) => void): Promise<void>;
	/**
	 * Creates a scene node.
	 * @return A promise that resolves with the new scene node.
	 */
	createNode(): Promise<Scene.INode>;
	/**
	 * Creates an array of scene nodes.
	 * @param count The number of scene nodes to create.
	 * @return A promise that resolves with the array of scene nodes.
	 */
	createNodes(count: number): Promise<Scene.INode[]>;
	/**
	 * Creates an array of scene objects.
	 * @param count The number of scene objects to create.
	 * @return A promise that resolves with the array of scene objects.
	 */
	createObjects(count: number): Promise<Scene.IObject[]>;
	/**
	 * This function returns an array of scene nodes from serialized scene.
	 * The returned scene nodes have not been started yet.
	 * @param text The serialized scene.
	 * @return A promise that resolves with an array of scene nodes.
	 */
	deserialize(text: string): Promise<Scene.INode[] | Scene.IObject>;
	/**
	 * This function serializes an array of scene nodes and their components to a string.
	 * @param sceneNodes An array of scene nodes.
	 * @return A promise that resolves with the serialized string.
	 */
	serialize(sceneNodes: Scene.INode[] | Scene.IObject): Promise<string>;
	/**
	 * Register a component factory.
	 * @param name A unique component name.
	 * @param factory A function that returns a new instance of the component.
	 */
	register(name: string, factory: () => Scene.IComponent): Promise<void>;
	/**
	 * Register an array of component factories all at once.
	 *
	 * ```
	 * function myComponent1Factory() {
	 *    return new MyComponent1();
	 * }
	 *
	 * function myComponent2Factory() {
	 *    return new MyComponent2();
	 * }
	 *
	 * sdk.Scene.registerComponents([
	 *   {
	 *     name: 'myComponent1',
	 *     factory: myComponent1Factory,
	 *   },
	 *   {
	 *     name: 'myComponent2',
	 *     factory: myComponent2Factory,
	 *   },
	 * ]);
	 * ```
	 *
	 * @param components An array of [[IComponentDesc]]
	 *
	 */
	registerComponents(components: Scene.IComponentDesc[]): Promise<void>;
}
/**
 * Our Sensor system allows for generating spatial queries to understand a Matterport digital twin.
 * By utilizing and setting up Sources around the scene, some questions that can be answered are:
 * - "what things are currently visible on screen?"
 * - "what things are near me?"
 *
 * where "things" can be Mattertag posts, sweeps, arbitrary locations (that you choose), or any combination of those.
 */
export declare namespace Sensor {
	export enum SensorType {
		CAMERA = "sensor.sensortype.camera"
	}
	export enum SourceType {
		SPHERE = "sensor.sourcetype.sphere",
		BOX = "sensor.sourcetype.box",
		CYLINDER = "sensor.sourcetype.cylinder"
	}
	/**
	 * A Sensor that detects Sources and provides information about the reading of each.
	 */
	export interface ISensor extends IObservable<ISensor> {
		/** The world-space position of the sensor. */
		origin: Vector3;
		/** The world-space "forward" direction describing which direction the sensor is facing. */
		forward: Vector3;
		/**
		 * Add a source, to add its readings to the set of readings provided by `.subscribe`.
		 * @param sources
		 */
		addSource(...sources: ISource[]): void;
		/**
		 * Start receiving updates when properties of this sensor change, e.g. `origin` or `forward`, not its `readings`.<br>
		 * Subscribe to `readings` to receive updates about associated `ISources`
		 */
		subscribe<DataT>(observer: IObserver<DataT> | ObserverCallback<DataT>): ISubscription;
		/**
		 * An observable used to get information about assocated `ISources` added with [[ISensor.addSource]]
		 */
		readings: {
			/**
			 * Start receiving updates about the current set of sources added to this sensor.
			 * @param observer
			 */
			subscribe(observer: ISensorObserver): ISubscription;
		};
		/**
		 * Show debug visuals for this sensor. Existing visuals are disposed.
		 * @param show
		 */
		showDebug(show: boolean): void;
		/**
		 * Teardown and cleanup the sensor, and stop receiving updates.
		 */
		dispose(): void;
	}
	export type SphereVolume = {
		/** The origin of the sphere. */
		origin: Vector3;
		/** The distance from origin of the sphere volume. */
		radius: number;
	};
	export type BoxVolume = {
		/** The center position of the box. */
		center: Vector3;
		/** The length, width, and depth of the box volume. */
		size: Vector3;
		/** The orientation of the box. The rotations are applied in yaw, pitch, then roll order. */
		orientation: Orientation;
	};
	export type CylinderVolume = {
		/** The point which defines the position (base) from which the height in the +Y, and radius in the XZ-plane are relative to. */
		basePoint: Vector3;
		/** The height of the cylinder. */
		height: number;
		/** The radius of the cylinder. */
		radius: number;
	};
	/**
	 * A Source represents a volume that will be detected by a Sensor.
	 * The type of the source, describes the type of volume associated with it.
	 * For example, with a `type` of `SourceType.SPHERE` the `volume` is a `SphereVolume`; a `SourceType.BOX` has a `BoxVolume`.
	 */
	export interface ISource<Volume = SphereVolume | BoxVolume | CylinderVolume> {
		/** The type of source. */
		type: SourceType;
		/** The volume that represents the range of emissions from this `ISource`. */
		volume: Volume;
		/** Arbitrary data that can be used to set additional metadata, for example. */
		userData: object;
		/**
		 * Let the sensor system know there is an update to this `ISource`.<br>
		 * When changing any properties on `volume`, no changes will be reflected in Showcase until `commit` is called.
		 */
		commit(): void;
	}
	/**
	 * A specialized [[IMapObserver]] which maps an `ISource` to its current `SensorReading`.
	 */
	export interface ISensorObserver {
		/** Called when a the first `reading` is added from `source`. */
		onAdded?(source: ISource, reading: SensorReading, collection: Map<ISource, SensorReading>): void;
		/** Called when `source` and its `reading` is removed. */
		onRemoved?(source: ISource, reading: SensorReading, collection: Map<ISource, SensorReading>): void;
		/** Called when an existing `reading` is altered from `source`. */
		onUpdated?(source: ISource, reading: SensorReading, collection: Map<ISource, SensorReading>): void;
		/** Called when a set of changes happens within the `collection`. */
		onCollectionUpdated?(collection: Map<ISource, SensorReading>): void;
	}
	/**
	 * Information about the Source as read by the Sensor.
	 */
	export type SensorReading = {
		/** The sensor is currently within the broadcast range of the source. */
		inRange: boolean;
		/** The sensor is within the source's broadcast range and the sensor has clear line of sight to the source. */
		inView: boolean;
		/** The distance between the sensor and the source. */
		distance: number;
		/** The squared distance from the sensor to the source. */
		distanceSquared: number;
		/** The world-space direction from the sensor to the source. */
		direction: Vector3;
	};
	/**
	 * Additional `userData` to associate with an `ISource` when creating it.
	 * This is a free dictionary that can contain any key/values deemed necessary.
	 */
	export type SourceOptions = {
		userData: object;
	};
}
export interface Sensor {
	SensorType: typeof Sensor.SensorType;
	SourceType: typeof Sensor.SourceType;
	/**
	 * Create an [[`ISensor`]] which can sense and provide information about [[`ISource`]].
	 *
	 * ```
	 * const sensor = await mpSdk.Sensor.createSensor(mpSdk.Sensor.SensorType.CAMERA);
	 * // add sources from calls to `Sensor.createSource()`
	 * sensor.addSource(...sources);
	 * // start listening for changes to the sensor's readings
	 * sensor.readings.subscribe({
	 *   onAdded(source, reading) {
	 *     console.log(source.userData.id, 'has a reading of', );
	 *   },
	 *   onUpdated(source, reading) {
	 *     console.log(source.userData.id, 'has an updated reading');
	 *     if (reading.inRange) {
	 *       console.log(source.userData.id, 'is currently in range');
	 *       if (reading.inView) {
	 *         console.log('... and currently visible on screen');
	 *       }
	 *     }
	 *   }
	 * });
	 * ```
	 */
	createSensor(type: Sensor.SensorType.CAMERA): Promise<Sensor.ISensor>;
	/**
	 * Create a spherical [[`ISource`]] which can be sensed by an [[`ISensor`]].<br>
	 * A shallow copy of `options.userData` is applied to the Source upon creation.
	 *
	 * Omitting `options.origin` will default the source's `volume.origin` to `{ x: 0, y: 0, z: 0 }`.<br>
	 * Omitting `options.radius` will default the source's `volume.radius` to `Infinity`.
	 *
	 * ```
	 * const sources = await Promise.all([
	 *   mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.SPHERE, {
	 *     origin: { x: 1, y: 2, z: 3 },
	 *     radius: 20,
	 *     userData: {
	 *       id: 'sphere-source-1',
	 *     },
	 *   }),
	 *   mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.SPHERE, {
	 *     radius: 4,
	 *     userData: {
	 *       id: 'sphere-source-2,
	 *     },
	 *   }),
	 * ]);
	 * // attach to a sensor previously created with `Sensor.createSensor()`
	 * sensor.addSource(...sources);
	 * ```
	 * @param options
	 */
	createSource(type: Sensor.SourceType.SPHERE, options: Sensor.SphereVolume & Sensor.SourceOptions): Promise<Sensor.ISource<Sensor.SphereVolume>>;
	/**
	 * Create an box shaped [[`ISource`]] which can be sensed by an [[`ISensor`]].<br>
	 * A shallow copy of `options.userData` is applied to the Source upon creation.
	 *
	 * Omitting `options.center` will default the source's `volume.center` to `{ x: 0, y: 0, z: 0 }`.<br>
	 * Omitting `options.size` will default the source's `volume.size` to `{ x: Infinity, y: Infinity, z: Infinity }`.
	 * Omitting `options.orientation` will default the source's `volume.orientatin` to `{ yaw: 0, pitch: 0, roll: 0 }`.
	 *
	 * ```
	 * const sources = await Promise.all([
	 *   mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.BOX, {
	 *     center: { x: 1, y: 1, z: 1 },
	 *     size: { x: 2, y: 1, z: 2 },
	 *     userData: {
	 *       id: 'box-source-1',
	 *     },
	 *   }),
	 *   mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.BOX, {
	 *     size: { x: 2: y: 2, z: 2 },
	 *     orientation: { yaw: 45, pitch: 45, roll: 45 },
	 *     userData: {
	 *       id: 'box-source-2,
	 *     },
	 *   }),
	 * ]);
	 * // attach to a sensor previously created with `Sensor.createSensor()`
	 * sensor.addSource(...sources);
	 * ```
	 * @param options
	 */
	createSource(type: Sensor.SourceType.BOX, options: Sensor.BoxVolume & Sensor.SourceOptions): Promise<Sensor.ISource<Sensor.BoxVolume>>;
	/**
	 * Create a cylindrical [[`ISource`]] which can be sensed by an [[`ISensor`]].<br>
	 * A shallow copy of `options.userData` is applied to the Source upon creation.
	 *
	 * Omitting `options.basePoint` will default the source's `volume.basePoint` to `{ x: 0, y: 0, z: 0 }`.<br>
	 * Omitting `options.radius` will default the source's `volume.radius` to `Infinity`.<br>
	 * Omitting `options.height` will default the source's `volume.height` to `Infinity`.
	 * ```
	 * const sources = await Promise.all([
	 *   mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.CYLINDER, {
	 *     basePoint: { x: 0, y: 0, z: 0 },
	 *     radius: 2,
	 *     height: 5,
	 *     userData: {
	 *       id: 'cylinder-source-1',
	 *     },
	 *   }),
	 *   mpSdk.Sensor.createSource(mpSdk.Sensor.SourceType.CYLINDER, {
		   basePoint: { x: 1, y: 2, z: 3 },
		   radius: 3,
	 *     userData: {
	 *       id: 'cylinder-source-2,
	 *     },
	 *   }),
	 * ]);
	 * // attach to a sensor previously created with `Sensor.createSensor()`
	 * sensor.addSource(...sources);
	 * ```
	 */
	createSource(type: Sensor.SourceType.CYLINDER, options: Sensor.CylinderVolume & Sensor.SourceOptions): Promise<Sensor.ISource<Sensor.CylinderVolume>>;
}
export declare namespace Settings {
}
export interface Settings {
	/**
	 * This function returns the value of a setting if it exists, if it does not currently exist, it will return undefined.
	 *
	 * ```
	 * mpSdk.Settings.get('labels')
	 *   .then(function(data) {
	 *     // Setting retreival complete.
	 *     console.log('Labels setting: ' + data);
	 *   })
	 *   .catch(function(error) {
	 *     // Setting  retrieval error.
	 *   });
	 * ```
	 */
	get(): Promise<any | undefined>;
	/**
	 * This function updates the value of a setting if it exists, returning the new value when it is set
	 *
	 * ```
	 * mpSdk.Settings.update('labels', false)
	 *   .then(function(data) {
	 *     // Setting update complete.
	 *     console.log('Labels setting: ' + data);
	 *   })
	 *   .catch(function(error) {
	 *     // Setting update error.
	 *   });
	 * ```
	 */
	update(key: string, value: any): Promise<void>;
}
/**
 * Sample custom tour.
 *
 * ```
 * const connect = function(sdk) {
 *   const mpSdk = sdk;
 *
 *   mpSdk.Tour.Event.on(Tour.Event.STEPPED, function(tourIndex){
 *     console.log('Tour index ' + tourIndex);
 *   });
 *   mpSdk.Tour.Event.on(Tour.Event.STARTED, function(){
 *     console.log('Tour started');
 *   });
 *   mpSdk.Tour.Event.on(Tour.Event.STOPPED, function(){
 *     console.log('Tour stopped');
 *   });
 *
 *   mpSdk.Tour.getData()
 *     .then(function(tour) {
 *       console.log('tour has ' + tour.length + ' stops');
 *       return mpSdk.Tour.start(0);
 *     })
 *     .then(function(){
 *       // console 'Tour started'
 *       // console -> 'Tour index 0'
 *       return mpSdk.Tour.next();
 *     })
 *     .then(function(){
 *       // console -> 'Tour index 1'
 *       return mpSdk.Tour.step(3);
 *     })
 *     .then(function(){
 *       // console -> 'Tour index 3'
 *       return mpSdk.Tour.prev();
 *     })
 *     .then(function(){
 *       // console -> 'Tour index 2'
 *       // console -> 'Tour stopped'
 *       return mpSdk.Tour.stop();
 *     });
 * }
 * ```
 *
 */
export declare namespace Tour {
	export type Snapshot = {
		sid: string;
		thumbnailUrl: string;
		imageUrl: string;
		is360: boolean;
		name: string;
		mode: Mode.Mode | undefined;
		position: Vector3;
		rotation: Vector3;
		zoom: number;
	};
	export enum Event {
		/** @event */
		STARTED = "tour.started",
		/** @event */
		STOPPED = "tour.stopped",
		/** @event */
		ENDED = "tour.ended",
		/** @event */
		STEPPED = "tour.stepped"
	}
}
export declare interface Tour {
	Event: typeof Tour.Event;
	/**
	 * This function start the tour.
	 *
	 * ```
	 * const tourIndex = 1;
	 *
	 * mpSdk.Tour.start(tourIndex)
	 *   .then(function() {
	 *     // Tour start complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Tour start error.
	 *   });
	 * ```
	 */
	start(index?: number): Promise<void>;
	/**
	 * This function stop the tour.
	 *
	 * ```
	 * mpSdk.Tour.stop()
	 *   .then(function() {
	 *     // Tour stop complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Tour stop error.
	 *   });
	 * ```
	 */
	stop(): Promise<void>;
	/**
	 * This function moves the camera to a specific snapshot in the tour.
	 *
	 * ```
	 * const myStep = 2;
	 * mpSdk.Tour.step(myStep)
	 *   .then(function() {
	 *     //Tour step complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Tour step error.
	 *   });
	 * ```
	 */
	step(index: number): Promise<void>;
	/**
	 * This function moves the camera to the next snapshot in the tour.
	 *
	 * ```
	 * mpSdk.Tour.next()
	 *   .then(function() {
	 *     // Tour next complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Tour next error.
	 *   });
	 * ```
	 */
	next(): Promise<void>;
	/**
	 * This function moves the camera to the previous snapshot in the tour.
	 *
	 * ```
	 * mpSdk.Tour.prev()
	 *   .then(function() {
	 *     // Tour prev complete.
	 *   })
	 *   .catch(function(error) {
	 *     // Tour prev error.
	 *   });
	 * ```
	 */
	prev(): Promise<void>;
	/**
	 * This function returns an array of Snapshots.
	 *
	 * ```
	 * mpSdk.Tour.getData()
	 *   .then(function(snapshots) {
	 *     // Tour getData complete.
	 *     if(snapshots.length > 0){
	 *       console.log('First snapshot sid: ' + snapshots[0].sid);
	 *       console.log('First snapshot name: ' + snapshots[0].name);
	 *       console.log('First snapshot position: ' + snapshots[0].position);
	 *     }
	 *   })
	 *   .catch(function(error) {
	 *     // Tour getData error.
	 *   });
	 * ```
	 */
	getData(): Promise<Tour.Snapshot[]>;
}
interface Emitter {
	/** Start listening for an event */
	on: typeof on;
	/** Stop listening for an event */
	off: typeof off;
}
declare function off(event: any, callback: (any: any) => void): Emitter;
declare function on(event: App.Event.PHASE_CHANGE, callback: (app: App.Phase) => void): Emitter;
declare function on(event: Camera.Event.MOVE, callback: (pose: Camera.Pose) => void): Emitter;
declare function on(event: Floor.Event.CHANGE_START, callback: (to: number, from: number) => void): Emitter;
declare function on(event: Floor.Event.CHANGE_END, callback: (floorIndex: number, floorName: string) => void): Emitter;
declare function on(event: Label.Event.POSITION_UPDATED, callback: (labelData: Label.Label[]) => void): Emitter;
declare function on(event: Mattertag.Event.HOVER, callback: (tagSid: string, hovering: boolean) => void): Emitter;
declare function on(event: Mattertag.Event.CLICK, callback: (tagSid: string) => void): Emitter;
declare function on(event: Mattertag.Event.LINK_OPEN, callback: (tagSid: string, url: string) => void): Emitter;
declare function on(event: Mode.Event.CHANGE_START, callback: (oldMode: string, newMode: string) => void): Emitter;
declare function on(event: Mode.Event.CHANGE_END, callback: (oldMode: string, newMode: string) => void): Emitter;
declare function on(event: Model.Event.MODEL_LOADED, callback: (model: Model.ModelData) => void): Emitter;
declare function on(event: Sweep.Event.ENTER, callback: (oldSweep: string, newSweep: string) => void): Emitter;
declare function on(event: Sweep.Event.EXIT, callback: (fromSweep: string, toSweep: string | undefined) => void): Emitter;
declare function on(event: Tour.Event.STARTED, callback: () => void): Emitter;
declare function on(event: Tour.Event.STOPPED, callback: () => void): Emitter;
declare function on(event: Tour.Event.ENDED, callback: () => void): Emitter;
declare function on(event: Tour.Event.STEPPED, callback: (activeIndex: number) => void): Emitter;
export declare type MpSdk = {
	App: App;
	Camera: Camera;
	Conversion: Conversion;
	Floor: Floor;
	Label: Label;
	Mattertag: Mattertag;
	Measurements: Measurements;
	Mode: Mode;
	Model: Model;
	Pointer: Pointer;
	Renderer: Renderer;
	Room: Room;
	Scene: Scene;
	Sensor: Sensor;
	Settings: Settings;
	Sweep: Sweep;
	Tour: Tour;
	on: typeof on;
	off: typeof off;
};
export declare namespace MpSdk {
	export { App, Camera, Conversion, Floor, Label, Mattertag, Measurements, Mode, Model, Pointer, Renderer, Room, Scene, Sensor, Settings, Sweep, Tour, };
}
/**
 * A Window type that can be use to cast the bundle's iframe's contentWindow to hint at the existance of the `MP_SDK`.
 * ```
 * const bundleIframe = document.getElementById('showcase-bundle') as HTMLIFrameElement;
 * const showcaseWindow = bundleIframe.contentWindow as ShowcaseBundleWindow;
 * showcaseWindow.MP_SDK.connect(bundleIframe, 'my-sdk-key');
 * ```
 */
export declare type ShowcaseBundleWindow = Window & typeof globalThis & {
	MP_SDK: {
		connect(target: Window, sdkKey: string): Promise<MpSdk>;
	};
};

export {};
