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
		let lineGeometry = this.createLineGeometry();
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

	protected createLineGeometry(): LineGeometry {
		let geometry = new LineGeometry();
		let relativeEndPoint = this.getRelativeEndPoint();
		//We need to shorten the line a little, otherwise it shows up at the end of the arrow's head
		geometry.setPositions([
			0,
			0,
			this.zPos,
			relativeEndPoint.x - relativeEndPoint.x / 25,
			relativeEndPoint.y - relativeEndPoint.y / 25,
			this.zPos,
		]);
		return geometry;
	}

	private createHead(): THREE.Mesh {
		let geometry = new THREE.BufferGeometry();
		let vertices = new Float32Array([-2, -1, -2, 0, 0, 0, -2, 1, -2]);
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
		this.headMesh.position.set(relativeEndPoint.x, relativeEndPoint.y, 0);
		let angle = lineAngle(this.position, this.endPosition);
		this.headMesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), angle);
	}

	protected updateMesh() {
		this.updateHead();
		this.tObject.position.set(this.position.x, this.position.y, this.zPos);

		let newScale = this.baseScale.value + this.highlightScalePlus.value;
		this.lineMesh.material.linewidth = newScale;
		this.headMesh.scale.set(newScale, newScale, 1);
	}

	_setResolution(width: number, height: number): void {
		this.lineMesh.material.resolution.set(width, height);
	}
}
