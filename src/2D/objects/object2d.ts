import * as THREE from "three";
import { TweenableNumber, tween } from "../../utils/tweening-utils";
import { PassiveObject2D } from "./passive-object2d";

/* It may seem strange that Object2D implements PassiveObject2D,
 * but the naming makes more sense from an API standpoint.
 * More often than not the user will want to add an Object2D to the scene and not a passive one,
 * therefore it makes sense to make its name shorter
 */

/**
 * Extend this abstract class if you want to create an !interactable! 2D object that you can add to the scene.
 * Make sure to call init() at the end of your constructor - I have not been able to find a workaround for this.
 */
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

	protected updateMesh() {
		this.mesh.position.set(this.position.x, this.position.y, 0);

		let newScale = this.baseScale.value + this.highlightScalePlus.value;
		this.mesh.scale.set(newScale, newScale, 1);
	}
}
