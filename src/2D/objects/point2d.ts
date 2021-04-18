import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Vector2, Vector3 } from 'three';
import { IObject2D } from '../iobject2d';

export class Point2D implements IObject2D {
	position: THREE.Vector2;
	color: THREE.Color;
	name: string;
	private renderRadius: number;
	private size: number;

	showName: boolean = true;
	//number of render segments (lower amount makes the edges blockier)
	private readonly SEGMENTS: number = 32; 

	private geometry: THREE.CircleGeometry;
	private material: THREE.MeshBasicMaterial;
	private mesh: THREE.Mesh;

	constructor(x: number, y: number, name: string, color: THREE.Color = new THREE.Color("white"), renderRadius: number = 0.075) {
		this.position = new Vector2(x, y);
		this.name = name;
		this.color = color;
		this.renderRadius = renderRadius;

		this.size = 1;

		this.geometry = new THREE.CircleGeometry(renderRadius, this.SEGMENTS);
		this.material = new THREE.MeshBasicMaterial( {color: color})
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	getMesh(): THREE.Mesh {
		return this.mesh;
	}

	highlight(): void {
		throw new Error('Method not implemented.');
	}

	unHighlight(): void {
		throw new Error('Method not implemented.');
	}

	changeColor(color: THREE.Color): void {
		this.color = color;
		this.material.color.set(this.color);
	}

	changeSize(newSize: number, time: number = 300): void {
		//We can't simply interpolate between numbers because Tween requires an object
		const sizeObj = {value: this.size};
		
		new TWEEN.Tween(sizeObj).to({value: newSize}, time)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(() => {
			this.size = sizeObj.value;
			this.mesh.scale.set(this.size, this.size, 0);
		}).start();
		console.log(this.mesh.scale);
	}

	changePosition(newPos: Vector2, time: number = 300) {
		new TWEEN.Tween(this.position).to(newPos, time)
			.easing(TWEEN.Easing.Cubic.Out)
			.onUpdate(() => {
				this.mesh.position.set(this.position.x, this.position.y, 0);
			}).start();
	}
	
	toggleName(): void {
		throw new Error('Method not implemented.');
	}
}