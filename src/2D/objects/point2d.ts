import * as THREE from 'three';
import { Vector2 } from 'three';
import { IObject2D } from '../iobject2d'

export class Point2D implements IObject2D {
	position: THREE.Vector2;
	color: THREE.Color;
	name: string;
	private renderRadius: number;

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

	//TODO: test, may not work. in that case we should use mesh.material instead
	//		and geometry and material shouldn't even be stored as a class variable
	changeColor(color: THREE.Color): void {
		this.material.color.set(color);
	}

	changeSize(size: number): void {
		throw new Error('Method not implemented.');
	}
	
	toggleName(): void {
		throw new Error('Method not implemented.');
	}
}