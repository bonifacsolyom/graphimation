import * as THREE from "three";
import { Vector2 } from "three";
import { IObject2D } from "./iobject2d";
import { TweenableNumber, tween } from "../utils/tweening-utils";

export abstract class Object2D implements IObject2D {
	//The position of the object - not necessarily the center, see getCenter()
	protected position: THREE.Vector2;
	protected name: string;

	//The object's final color and scale will be the sum of the base and the highlight plus
	protected color: {
		baseColor: THREE.Color;
		highlightBrightnessPlus: TweenableNumber;
	};
	protected scale: {
		baseScale: TweenableNumber;
		highlightScalePlus: TweenableNumber;
	};

	private showName: boolean;
	private higlightValues = {
		growth: 1,
		brightness: 20,
	};
	private hovered: boolean;

	//Note: definite assignment used - remember to define these variables in child class
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
		this.name = name;
		this.color = {
			baseColor: color,
			highlightBrightnessPlus: new TweenableNumber(0),
		};
		this.showName = true;
		this.scale = {
			baseScale: new TweenableNumber(1),
			highlightScalePlus: new TweenableNumber(0),
		};
		this.hovered = false;
	}
	abstract getCenter(): THREE.Vector2;

	//Call this at the end of every child's constructor
	protected init() {
		//We use this so that we can identify which object2D the mesh belongs to
		//Useful when raycasting
		this.mesh.userData = { containerObject: this };
	}

	getMesh(): THREE.Mesh {
		return this.mesh;
	}

	//Should be called whenever the pointer is above the object
	hover(hover: boolean): void {
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

	//Will highlight the object by enlargening and brightening it
	private highlight(
		newHighlightBrightness: number,
		newHighlightScale: number,
		time: number = 20
	): void {
		//interpolate brightness
		tween(
			this.color.highlightBrightnessPlus,
			newHighlightBrightness,
			this.updateMesh.bind(this),
			time
		);

		//interpolate scale
		tween(
			this.scale.highlightScalePlus,
			newHighlightScale,
			this.updateMesh.bind(this),
			time
		);
	}

	//updates the mesh with this object's data, for example colors and position
	protected updateMesh() {
		this.mesh.position.set(this.position.x, this.position.y, 0);

		let newScale =
			this.scale.baseScale.value + this.scale.highlightScalePlus.value;
		this.mesh.scale.set(newScale, newScale, 1);
	}

	//Changes the position of the object, interpolating between the old and the new value
	changePosition(newPos: Vector2, time: number = 300) {
		tween(this.position, newPos, this.updateMesh.bind(this), time);
	}

	//Changes the color of the object, interpolating between the old and the new value
	//NOTE: THREE.Material doesn't have a color attribute, therefore we can't implement it here
	//We will most likely end up using MeshBasicMaterial for all objects but I'm not sure yet
	abstract changeColor(color: THREE.Color): void;

	//Changes the scale of the object, interpolating between the old and the new value
	changeScale(newScale: number, time: number = 300): void {
		tween(this.scale.baseScale, newScale, this.updateMesh.bind(this), time);
	}

	toggleName(): void {
		this.showName = !this.showName;
		//TODO: implement the rest
	}
}
