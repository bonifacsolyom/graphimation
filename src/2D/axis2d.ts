import * as THREE from "three";
import * as math from "mathjs";
import { ICameraProperties } from "./camera2d";
import { Line2D } from "./objects/line2d";

export class Axis2D {
	private axisColor: THREE.Color;
	private gridColor: THREE.Color;
	private gridShown: boolean;
	//the frequency of the gridlines (for example if set to 0.5, there will be one at 0.5, 1, 1.5 etc.)
	private increments: number;

	constructor() {
		this.axisColor = new THREE.Color("white");
		this.gridColor = new THREE.Color("gray");
		this.gridShown = true;
		this.increments = 1;
		let line = new Line2D(1, 1, 5, 6, "line1");
	}

	update(cameraProperties: ICameraProperties) {}

	private renderAxis() {}

	private renderGrid() {}
}
