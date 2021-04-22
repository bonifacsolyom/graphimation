import * as THREE from "three";
import { Vector2 } from "three";
import { IObject2D } from "./ipassive-object2d";
import { TweenableNumber, tween } from "../../utils/tweening-utils";
import { PassiveObject2D } from "./passive-object2d";

export abstract class Object2D
	extends PassiveObject2D
	implements IInteractable {
	protected name: string;
	private hovered: boolean;
	protected highlightBrightnessPlus: TweenableNumber;
	private highlightScalePlus: TweenableNumber;

	protected higlightValues = {
		growth: 1,
		brightness: 10,
	};

	//Type predicate. yes as far as I understand this is actually the way of doing it
	isInteractable(): void {
		return;
	}

	constructor(
		x: number,
		y: number,
		name: string,
		color: THREE.Color = new THREE.Color("white")
	) {
		super(x, y, name, color);
		this.name = name;
		this.highlightBrightnessPlus = new TweenableNumber(0);
		this.highlightScalePlus = new TweenableNumber(0);
		this.hovered = false;
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

	//updates the mesh with this object's data, for example colors and position
	protected updateMesh() {
		this.mesh.position.set(this.position.x, this.position.y, 0);

		let newScale = this.baseScale.value + this.highlightScalePlus.value;
		this.mesh.scale.set(newScale, newScale, 1);
	}

	//Changes the position of the object, interpolating between the old and the new value
	changePosition(newPos: Vector2, time: number = 0) {
		tween(this.position, newPos, this.updateMesh.bind(this), time);
	}

	//Changes the color of the object, interpolating between the old and the new value
	//NOTE: THREE.Material doesn't have a color attribute, therefore we can't implement it here
	//We will most likely end up using MeshBasicMaterial for all objects but I'm not sure yet
	abstract changeColor(color: THREE.Color): void;

	//Changes the scale of the object, interpolating between the old and the new value
	changeScale(newScale: number, time: number = 0): void {
		tween(this.baseScale, newScale, this.updateMesh.bind(this), time);
	}

	toggleName(): void {
		this.showName = !this.showName;
		//TODO: implement the rest
	}
}
