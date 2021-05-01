import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { Object2D } from "./object2d";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { tween } from "../../utils/tweening-utils";

/**
 * A class that represents a 2D line on the scene.
 */
export class Line2D extends Object2D {
	protected endPosition: Vector2;

	constructor(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		name: string,
		color: THREE.Color = new THREE.Color("white")
	) {
		super(x1, y1, name, color);
		this.endPosition = new Vector2(x2, y2);
		this.baseScale.value = 5;
		this.higlightValues.growth = 3;
		this.material = new LineMaterial({
			color: color.getHex(),
			linewidth: this.baseScale.value,
		});

		this.geometry = new LineGeometry();
		(this.geometry as LineGeometry).setPositions([
			this.position.x,
			this.position.y,
			0,
			this.endPosition.x,
			this.endPosition.y,
			0,
		]);

		this.mesh = new Line2(
			this.geometry as LineGeometry,
			this.material as LineMaterial
		);

		this.init();
	}

	protected updateMesh() {
		this.mesh.position.set(this.position.x, this.position.y, this.zPos);

		let newWidth = this.baseScale.value + this.highlightScalePlus.value;
		(this.mesh.material as LineMaterial).linewidth = newWidth;
	}

	/**
	 * Used internally to set the resolution of the line so that it doesn't look distorted on non 1:1 aspect ratios.
	 * There's probably no reason you'd want to call this function.
	 */
	_setResolution(width: number, height: number): void {
		(this.material as LineMaterial).resolution.set(width, height);
	}

	getCenter(): Vector2 {
		return this.position
			.clone()
			.add(this.endPosition.clone())
			.divideScalar(2);
	}

	changeColor(color: THREE.Color, time: number = 0): void {
		tween(this.baseColor, color, this.updateMesh.bind(this), time);
	}
}
