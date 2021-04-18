import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {Vector2 } from 'three';
import { IObject2D } from '../iobject2d';
import * as CONVERT from '../../utils/convert'

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

	changeColor(color: THREE.Color, time: number = 300): void {
		//Converting the color to hsv makes the interpolation look much better
		const colorHSV = CONVERT.THREEColorToHSV(this.color);
		const goalColorHSV = CONVERT.THREEColorToHSV(color);

		new TWEEN.Tween(colorHSV).to(goalColorHSV, time)
			.easing(TWEEN.Easing.Cubic.Out)
			.onUpdate(() => {
				this.color.set(CONVERT.HSVToTHREEColor(colorHSV));
				console.log(this.color)
				this.material.color.set(this.color);
			})
			.start();
	}

	//Lightens the color of the objects by the given amount
	private lighten(amount: number) {

	}

	changeSize(newSize: number, time: number = 300): void {
		//We can't simply interpolate between numbers because Tween requires an object
		//Therefore we put our value in a temporary object
		const sizeObj = {value: this.size};
		
		new TWEEN.Tween(sizeObj).to({value: newSize}, time)
		.easing(TWEEN.Easing.Cubic.Out)
		.onUpdate(() => {
				//We need to update our original value here since sizeObj only has a copy of it that's being modified
				this.size = sizeObj.value;
				this.mesh.scale.set(this.size, this.size, 0);
			})
			.start();
	}

	changePosition(newPos: Vector2, time: number = 300) {
		new TWEEN.Tween(this.position).to(newPos, time)
			.easing(TWEEN.Easing.Cubic.Out)
			.onUpdate(() => {
				this.mesh.position.set(this.position.x, this.position.y, 0);
			})
			.start();
	}
	
	toggleName(): void {
		throw new Error('Method not implemented.');
	}
}