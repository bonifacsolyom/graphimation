import * as THREE from "three";
import { Vector3 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { lineAngle, radianToDegree } from "../../utils/calc-utils";
import { AbstractLine2D } from "./abstract-line2d";
import { Line2D } from "./line2d";
import { Object2D } from "./object2d";

export class Vector2D extends AbstractLine2D {
	lineMesh: Line2;
	headMesh: THREE.Mesh;

	//we offset the line's end a little, so that it doesn't show up past the vector head
	readonly lineOffset: number = 0.04;

	//we offset the arrow's head, so when we shrink or grow the vector's scale, it looks better
	private readonly headXOffset = 1;

	constructor(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		name: string,
		color: THREE.Color = new THREE.Color("white")
	) {
		super(x1, y1, x2, y2, name, color);

		let lineMaterial = new LineMaterial({
			color: color.getHex(),
			linewidth: this.baseScale.value,
		});
		let lineGeometry = new LineGeometry();
		this.setLineGeometry(lineGeometry, 0.04);
		this.lineMesh = new Line2(lineGeometry, lineMaterial);

		this.headMesh = this.createHead();
		this.tObject = new THREE.Group();
		(this.tObject as THREE.Group).add(this.lineMesh);
		(this.tObject as THREE.Group).add(this.headMesh);

		this.init();
	}

	protected init() {
		super.init();
		this.lineMesh.userData = { containerObject: this };
		this.headMesh.userData = { containerObject: this };
	}

	private createHead(): THREE.Mesh {
		let geometry = new THREE.BufferGeometry();
		let vertices = new Float32Array([
			-2 + this.headXOffset,
			-1,
			0,
			0 + this.headXOffset,
			0,
			0,
			-2 + this.headXOffset,
			1,
			0,
		]);
		vertices = vertices.map((val) => val / 25); //we shrink the triangle
		geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(vertices, 3)
		);
		geometry.computeVertexNormals();
		let material = new THREE.MeshBasicMaterial({ color: this.baseColor });
		return new THREE.Mesh(geometry, material);
	}

	private updateHead(): void {
		let relativeEndPoint = this.getRelativeEndPoint();
		relativeEndPoint.x -= (relativeEndPoint.x * this.headXOffset) / 21;
		relativeEndPoint.y -= (relativeEndPoint.y * this.headXOffset) / 21;
		this.headMesh.position.set(relativeEndPoint.x, relativeEndPoint.y, 0);
		let angle = lineAngle(this.position, this.endPosition);
		this.headMesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), angle);
	}

	protected updateMesh() {
		this.updateHead();
		this.tObject.position.set(this.position.x, this.position.y, this.zPos);

		let newLineWidth = this.baseScale.value + this.highlightScalePlus.value;
		let newHeadScale =
			this.baseScale.value + this.highlightScalePlus.value / 3;
		this.lineMesh.material.linewidth = newLineWidth;
		this.headMesh.scale.set(newHeadScale, newHeadScale, 1);
	}

	_setResolution(width: number, height: number): void {
		this.lineMesh.material.resolution.set(width, height);
	}
}
