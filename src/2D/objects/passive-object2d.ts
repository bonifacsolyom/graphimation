import * as THREE from "three";
import { Vector2 } from "three";
import { IPassiveObject2D as IPassiveObject2D } from "./ipassive-object2d";
import { TweenableNumber, tween } from "../../utils/tweening-utils";

/**
 * Extend this abstract class if you want to create a !non-interactable! 2D object that can be added to the scene.
 * Make sure to call init() at the end of your constructor - I have not been able to find a workaround for this.
 */
export abstract class PassiveObject2D implements IPassiveObject2D {
	//The position of the object - not necessarily the center, see getCenter()
	protected position: THREE.Vector2;

	//The object's final color and scale will be the sum of the base values and anything else that the subclass may implement
	protected baseColor: THREE.Color;
	protected baseScale: TweenableNumber;

	protected showName: boolean;

	//WARN: definite assignment used - remember to define these variables in child class
	protected geometry!: THREE.BufferGeometry;
	protected material!: THREE.Material;
	protected mesh!: THREE.Mesh;

	constructor(
		x: number,
		y: number,
		name: string,
		color: THREE.Color = new THREE.Color("white")
	) {
		this.position = new Vector2(x, y);
		this.baseColor = color;
		this.showName = true;
		this.baseScale = new TweenableNumber(1);
	}

	abstract getCenter(): THREE.Vector2;

	/**
	 * Sets it so that this object's mesh has a reference back to this object, it's "container".
	 * This attribute is used at raytracing.
	 * Make sure to call this at the end of every child's constructor.
	 */
	protected init() {
		this.mesh.userData = { containerObject: this };
	}

	getMesh(): THREE.Mesh {
		return this.mesh;
	}

	/**
	 * Updates the mesh with this object's data, for example colors and position.
	 * This function should usually be the callback function while you're tweening a property of this object.
	 */
	protected updateMesh() {
		this.mesh.position.set(this.position.x, this.position.y, 0);

		let newScale = this.baseScale.value;
		this.mesh.scale.set(newScale, newScale, 1);
	}

	changePosition(newPos: Vector2, time: number = 0) {
		tween(this.position, newPos, this.updateMesh.bind(this), time);
	}

	//NOTE: THREE.Material doesn't have a color attribute, therefore we can't implement it here
	//We will most likely end up using MeshBasicMaterial for all objects but I'm not sure yet
	abstract changeColor(color: THREE.Color, time: number): void;

	changeScale(newScale: number, time: number = 0): void {
		tween(this.baseScale, newScale, this.updateMesh.bind(this), time);
	}

	toggleName(): void {
		this.showName = !this.showName;
		//TODO: implement the rest
	}
}
