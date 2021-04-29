import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import { Object2D } from "./object2d";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { LineRaycast } from "three-line-raycast";

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
		this.baseScale.value = 0.005;
		this.higlightValues.growth = 0.005;
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
		this.mesh.raycast = LineRaycast;

		this.init();
	}

	protected updateMesh() {
		this.mesh.position.set(this.position.x, this.position.y, 0);

		let newWidth = this.baseScale.value + this.highlightScalePlus.value;
		(this.mesh.material as LineMaterial).linewidth = newWidth;
	}

	getCenter(): Vector2 {
		throw new Error("Method not implemented.");
	}

	changeColor(color: THREE.Color, time: number): void {
		throw new Error("Method not implemented.");
	}
}
