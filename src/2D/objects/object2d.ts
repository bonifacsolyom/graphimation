import * as THREE from "three";
import { Vector2 } from "three";
import { TweenableNumber, tween } from "../../utils/tweening-utils";
import { IObject2D } from "./iobject2d";

/**
 * Extend this abstract class if you want to create a !non-interactable! 2D object that can be added to the scene.
 * Make sure to call init() at the end of your constructor - I have not been able to find a workaround for this.
 */
export abstract class Object2D implements IObject2D {
	protected name: string;
	private hovered: boolean;
	protected highlightBrightnessPlus: TweenableNumber;
	private highlightScalePlus: TweenableNumber;
	//The position of the object - not necessarily the center, see getCenter()
	protected position: THREE.Vector2;

	//The object's final color and scale will be the sum of the base values and anything else that the subclass may implement
	protected baseColor: THREE.Color;
	protected baseScale: TweenableNumber;

	protected higlightValues = {
		growth: 1,
		brightness: 10,
	};

	//Whether the object should react to the user hovering over it
	hoverable = true;
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

		this.name = name;
		this.highlightBrightnessPlus = new TweenableNumber(0);
		this.highlightScalePlus = new TweenableNumber(0);
		this.hovered = false;
	}

	hover(hover: boolean): void {
		if (!this.hoverable) return;
		if (hover && !this.hovered) {
			this.hovered = true;
			this.highlight(
				this.higlightValues.brightness,
				this.higlightValues.growth
			);
		} else if (!hover && this.hovered) {
			this.hovered = false;
			this.highlight(0, 0);
		}
	}

	click(): void {
		throw new Error("Method not implemented.");
	}

	/**
	 * Highlights the object by enlargening and brightening it.
	 * Set the first two parameters to 0 to remove the highlight from the object.
	 * @param newHighlightBrightness How much brighter the object should become
	 * @param newHighlightScale How much larger the object should become
	 * @param time The time it takes for the highlight animation. Set to 0 for an instantaneous result
	 */
	private highlight(
		newHighlightBrightness: number,
		newHighlightScale: number,
		time: number = 0
	): void {
		//interpolate brightness
		tween(
			this.highlightBrightnessPlus,
			newHighlightBrightness,
			this.updateMesh.bind(this),
			time
		);

		//interpolate scale
		tween(
			this.highlightScalePlus,
			newHighlightScale,
			this.updateMesh.bind(this),
			time
		);
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

		let newScale = this.baseScale.value + this.highlightScalePlus.value;
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
