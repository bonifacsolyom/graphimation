import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { IObject2D } from "./objects/iobject2d";
import { Camera2D } from "./camera2d";
import { Vector2, Vector3 } from "three";
import { Object2D } from "./objects/object2d";
import { Point2D } from "./objects/point2d";
import { Axis2D } from "./axis2d";

export class Scene2D {
	private scene: THREE.Scene;
	private camera: Camera2D;
	private renderer: THREE.WebGLRenderer;
	private raycaster: THREE.Raycaster;
	private pointer: THREE.Vector2;
	private axis: Axis2D;

	private width: number;
	private height: number;

	constructor(width: number, height: number) {
		this.scene = new THREE.Scene();
		this.width = width;
		this.height = height;

		this.camera = new Camera2D(width, height);
		this.pointer = new Vector2(-1, 1);

		//set up renderer
		//TODO: only turn on antialias on powerful machines
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.width, this.height);

		//set up axises and grid
		this.axis = new Axis2D();
		
		//TODO: remove
		this.camera.changePosition(new Vector2(1, -3), 5000);
		this.camera.changeZoom(1.5, 5000);
		this.camera.changeRotation(45, 1000);
		const gridHelper = new THREE.GridHelper(10, 10);
		gridHelper.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2)
		// this.scene.add(gridHelper);

		//set up raycaster
		this.raycaster = new THREE.Raycaster();

		//set up mouse move callback
		document.addEventListener("pointermove", this.onPointerMove.bind(this));

		this.animate();
	}

	//Adds a 2D object (such as a point or a line) to the scene
	addObject(object: IObject2D): void {
		this.scene.add(object.getMesh());
	}

	//returns the dom element of the renderer that can be added to HTML
	getDomElement(): HTMLCanvasElement {
		return this.renderer.domElement;
	}

	private animate(): void {
		//bind is a workaround for javascript's weird behavior when it comes to 'this'
		requestAnimationFrame(this.animate.bind(this));

		TWEEN.update(); //we update all our interpolations

		this.checkPointerIntersect();

		this.axis.update(this.camera.getCameraProperties());

		//TODO: remove
		let debugCoords = this.camera.getCameraProperties().bottomEdge;
		this.addObject(new Point2D(debugCoords.x, debugCoords.y, "name"));

		this.renderer.render(this.scene, this.camera.getCamera());
	}

	private intersectedObject: Object2D | null = null;
	//Checks if the pointer intersects with any object and if so, calls its highlight function
	private checkPointerIntersect() {
		this.raycaster.setFromCamera(this.pointer, this.camera.getCamera());
		const intersects = this.raycaster.intersectObjects(this.scene.children);

		if (intersects.length > 0) {
			var object: Object2D =
				intersects[0].object.userData.containerObject;
			if (this.intersectedObject != object) {
				this.intersectedObject?.hover(false);
				object.hover(true);
				this.intersectedObject = object;
			}
		} else {
			//our pointer isn't intersecting with anything
			this.intersectedObject?.hover(false);
			this.intersectedObject = null;
		}
	}

	private onPointerMove(event: PointerEvent): void {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}
}
