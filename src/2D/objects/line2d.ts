import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { Object2D } from "./object2d";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { tween } from "../../utils/tweening-utils";

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
			// resolution: new Vector2(window.innerWidth, window.innerHeight),
		});

		(this.material as LineMaterial).resolution.set(
			window.innerWidth,
			window.innerHeight
		);

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
		this.mesh.position.set(this.position.x, this.position.y, 0);

		let newWidth = this.baseScale.value + this.highlightScalePlus.value;
		(this.mesh.material as LineMaterial).linewidth = newWidth;
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
