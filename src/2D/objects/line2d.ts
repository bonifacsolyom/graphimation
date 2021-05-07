import * as THREE from "three";
import { Vector2 } from "three";
import { Object2D } from "./object2d";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { tween } from "../../utils/tweening-utils";
import { AbstractLine2D } from "./abstract-line2d";

/**
 * A class that represents a 2D line on the scene.
 */
export class Line2D extends AbstractLine2D {
	constructor(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		name: string,
		color: THREE.Color = new THREE.Color("white")
	) {
		super(x1, y1, x2, y2, name, color);

		let material = new LineMaterial({
			color: color.getHex(),
			linewidth: this.baseScale.value,
		});
		let geometry = this.createLineGeometry();
		this.tObject = new Line2(geometry, material);

		this.init();
	}

	protected createLineGeometry(): LineGeometry {
		let geometry = new LineGeometry();
		let relativeEndPoint = this.getRelativeEndPoint();
		geometry.setPositions([
			0,
			0,
			this.zPos,
			relativeEndPoint.x,
			relativeEndPoint.y,
			this.zPos,
		]);
		return geometry;
	}

	protected updateMesh() {
		this.tObject.position.set(this.position.x, this.position.y, this.zPos);

		let newWidth = this.baseScale.value + this.highlightScalePlus.value;
		(this.getMaterial() as LineMaterial).linewidth = newWidth;
	}

	_setResolution(width: number, height: number): void {
		(this.getMaterial() as LineMaterial).resolution.set(width, height);
	}

	protected getRelativeEndPoint(): Vector2 {
		return new Vector2(
			this.endPosition.x - this.position.x,
			this.endPosition.y - this.position.y
		);
	}
}
