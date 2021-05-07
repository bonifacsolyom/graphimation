import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Camera2D } from "./camera2d";
import { Vector2, Vector3 } from "three";
import { Object2D } from "./objects/object2d";
import { Axis2D } from "./axis2d";
import { Line2D } from "./objects/line2d";
import { removeFromArray } from "../utils/misc-utils";
import { AbstractLine2D } from "./objects/abstract-line2d";

/**
 * A scene that you can add objects to.
 * Has an optional axis display.
 */
export class Scene2D {
	private scene: THREE.Scene;
	private camera: Camera2D;
	private renderer: THREE.WebGLRenderer;
	private raycaster: THREE.Raycaster;
	private pointer: THREE.Vector2;
	private axis: Axis2D;

	private width: number;
	private height: number;
	/**
	 * The Z value of the
	 * Essentially the amount of objects that have been placed in the scene.
	 */
	private objects: Object2D[];

	constructor(width: number, height: number) {
		this.scene = new THREE.Scene();
		this.width = width;
		this.height = height;

		this.camera = new Camera2D(width, height);
		this.pointer = new Vector2(-1, 1);
		this.objects = [];

		//set up renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.width, this.height);

		//set up axises and grid
		this.axis = new Axis2D();

		//TODO: remove
		const gridHelper = new THREE.GridHelper(10, 10);
		gridHelper.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
		gridHelper.position.set(0, 0, -1);
		this.scene.add(gridHelper);

		//set up raycaster
		this.raycaster = new THREE.Raycaster();

		//set up mouse move callback
		document.addEventListener("pointermove", this.onPointerMove.bind(this));

		this.animate();
	}

	/**
	 * Changes the position of the camera, smoothly interpolating between the old and the new value.
	 * @param newPos The new position of the camera
	 * @param time The time it takes for the move animation. Set to 0 for an instantaneous result
	 */
	changeCameraPosition(newPos: Vector2, time: number = 0): void {
		this.camera.changePosition(newPos, time);
	}

	/**
	 * Changes the zoom level of the camera, smoothly interpolating between the old and the new value.
	 * @param newZoom The new zoom level of the camera
	 * @param time The time it takes for the zooming animation. Set to 0 for an instantaneous result
	 */
	changeCameraZoom(newZoom: number, time: number = 0) {
		this.camera.changeZoom(newZoom, time);
	}

	/**
	 * Changes the rotation of the camera, smoothly interpolating between the old and the new value.
	 * @param angle Angle in degrees
	 * @param time The time it takes for the rotation animation. Set to 0 for an instantaneous result
	 */
	changeCameraRotation(angle: number, time: number = 0): void {
		this.camera.changeRotation(angle, time);
	}

	/**
	 * Adds a 2D object (such as a point or a line) to the scene.
	 * @param object The object to be added to the scene
	 */
	addObject(object: Object2D): void {
		if (object instanceof AbstractLine2D)
			object._setResolution(this.width, this.height);

		//We change the Z position of the newly added object so that it's in front of every other object
		//We also push back the camera's Z position by one so that its frustum encompasses the newly added object too
		this.objects.push(object);
		object.setZPos(this.objects.length);
		this.camera.setZPos(this.objects.length + 1);

		this.scene.add(object.getTHREEObject());
	}

	/**
	 * Removes a 2D object from the scene. If you just want to temporarily hide an object,
	 * use its visible property instead. TODO: implement visible property
	 * @param object The object to be removed from the scene
	 */
	removeObject(object: Object2D): void {
		removeFromArray(this.objects, object);

		/*
		We refresh all the indexes of the objects. Not the most efficient way of doing this,
		But it shouldn't matter because the amount of objects we'll have at any given point
		will be relatively low
		*/
		//TODO: test that this actually works properly
		for (let i = 0; i < this.objects.length; i++) {
			this.objects[i].setZPos(i);
		}
		this.camera.setZPos(this.objects.length + 1);
	}

	/**
	 *
	 * @returns The dom element of the renderer that can be added to HTML
	 */
	getDomElement(): HTMLCanvasElement {
		return this.renderer.domElement;
	}

	/**
	 * A function that's called every time the screen refreshes to update the scene
	 */
	private animate(): void {
		//bind is a workaround for javascript's weird behavior when it comes to 'this'
		requestAnimationFrame(this.animate.bind(this));

		TWEEN.update(); //we update all our interpolations

		this.checkPointerIntersect();

		this.axis.update(this.camera.getCameraProperties());

		this.renderer.render(this.scene, this.camera.getCamera());
	}

	//A variable that stores the object that the user last pointed at
	private intersectedObject: Object2D | null = null;

	/**
	 * Checks if the pointer intersects any object and if so, calls its hover function
	 */
	private checkPointerIntersect() {
		this.raycaster.setFromCamera(this.pointer, this.camera.getCamera());
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true
		);

		//we check if the pointer is actually intersecting anything
		if (intersects.length > 0) {
			//The intersects array contains a threejs object. We want its container Object2D object
			var object: Object2D | null =
				intersects[0].object.userData.containerObject;
			if (this.intersectedObject != object)
				this.intersectedObject?.hover(false);
			//We only want to continue if the threejs object actually has a container, and the container implements the IInteractable interface
			if (object != null && object.hoverable) {
				object.hover(true);
				this.intersectedObject = object;
			}
		} else {
			//In this case our pointer isn't intersecting with anything
			this.intersectedObject?.hover(false);
			this.intersectedObject = null;
		}
	}

	/**
	 * A callback function that's called when the user moves their pointer
	 * @param event An object containing information about the pointer event
	 */
	private onPointerMove(event: PointerEvent): void {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}
}
