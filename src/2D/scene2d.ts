import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { IObject2D } from './iobject2d';
import {Camera2D} from './camera2d'
import { Vector2 } from 'three';

export class Scene2D {
	private scene: THREE.Scene;
	private camera : Camera2D;
	private renderer: THREE.WebGLRenderer;
	private raycaster: THREE.Raycaster;
	private pointer: THREE.Vector2;

	private width: number;
	private height: number;

	constructor(width: number, height: number) {
		this.scene = new THREE.Scene()
		this.width = width;
		this.height = height;

		this.camera = new Camera2D(width, height);
		this.pointer = new Vector2(0, 0);
		
		//set up renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(this.width, this.height);

		//set up raycaster
		this.raycaster = new THREE.Raycaster();

		//set up mouse move callback
		document.addEventListener('pointermove', this.onPointerMove.bind(this));

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

		this.renderer.render(this.scene, this.camera.getCamera());
	}

	//Checks if the pointer intersects with any object and if so, calls its highlight function
	private checkPointerIntersect() {
		this.raycaster.setFromCamera(this.pointer, this.camera.getCamera())
		const intersects = this.raycaster.intersectObjects( this.scene.children );

		//TODO: doesn't work
		// console.log(intersects);
	}


	private onPointerMove(event: PointerEvent): void {
		this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}
}