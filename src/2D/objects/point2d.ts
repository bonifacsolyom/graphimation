import * as THREE from "three";
import { Object2D } from "./object2d";
import * as COLOR_UTIL from "../../utils/color-util";
import { tween } from "../../utils/tweening-utils";

/**
 * A class that represents a 2D point on the scene.
 */
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

		let geometry = new THREE.CircleGeometry(renderRadius, this.SEGMENTS);
		let material = new THREE.MeshBasicMaterial({ color: color });
		this.tObject = new THREE.Mesh(geometry, material);

		this.init();
		this.updateMesh();
	}

	changeColor(color: THREE.Color, time: number = 0): void {
		tween(this.baseColor, color, this.updateMesh.bind(this), time);
	}

	getCenter(): THREE.Vector2 {
		return this.position;
	}

	protected updateMesh() {
		super.updateMesh();

		let newColor = COLOR_UTIL.changeBrightness(
			this.baseColor,
			this.highlightBrightnessPlus.value
		);
		(this.getMaterial() as THREE.MeshBasicMaterial).color.set(newColor);
	}
}
