import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Vector2 } from "three";
import { Object2D } from "./object2d";
import * as COLOR_UTIL from "../../utils/color-util";
import { tween } from "../../utils/tweening-utils";

export class Point2D extends Object2D {
	private renderRadius: number;

	//number of render segments (lower amount makes the edges blockier)
	private readonly SEGMENTS: number = 32;

	constructor(
		x: number,
		y: number,
		name: string,
		color: THREE.Color = new THREE.Color("white"),
		renderRadius: number = 0.075
	) {
		super(x, y, name, color);

		this.renderRadius = renderRadius;

		this.geometry = new THREE.CircleGeometry(renderRadius, this.SEGMENTS);
		this.material = new THREE.MeshBasicMaterial({ color: color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.init();
		this.updateMesh();
	}

	changeColor(color: THREE.Color, time: number = 0): void {
		tween(this.color.baseColor, color, this.updateMesh.bind(this), time);
	}

	getCenter(): THREE.Vector2 {
		return this.position;
	}

	protected updateMesh() {
		super.updateMesh();

		let newColor = COLOR_UTIL.changeBrightness(
			this.color.baseColor,
			this.color.highlightBrightnessPlus.value
		);
		(<THREE.MeshBasicMaterial>this.material).color.set(newColor);
	}
}
