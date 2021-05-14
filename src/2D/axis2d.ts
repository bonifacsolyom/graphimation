import * as THREE from "three";
import * as math from "mathjs";
import { ICameraProperties } from "./camera2d";
import { Line2D } from "./objects/line2d";
import { Vector2 } from "three";
import { Point2D } from "./objects/point2d";

export class Axis2D {
	private axisColor: THREE.Color;
	private gridColor: THREE.Color;
	private gridShown: boolean;
	//the frequency of the gridlines (for example if set to 0.5, there will be one at 0.5, 1, 1.5 etc.)
	private increments: number;
	private camProps: ICameraProperties | null;
	private xAxis: Line2D;
	private yAxis: Line2D;

	constructor(scene: THREE.Scene) {
		this.axisColor = new THREE.Color("white");
		this.gridColor = new THREE.Color("gray");
		this.gridShown = true;
		this.increments = 1;
		this.camProps = null;

		this.xAxis = new Line2D(0, 0, 0, 1, "xAxis", new THREE.Color("white"));
		this.yAxis = new Line2D(0, 0, 0, 0, "yAxis", new THREE.Color("white"));
		this.xAxis.hoverable = false;
		this.yAxis.hoverable = false;
		this.xAxis.changeScale(1.5)
		this.yAxis.changeScale(1.5)
		scene.add(this.xAxis.getTHREEObject());
		scene.add(this.yAxis.getTHREEObject());
	}

	update(cameraProperties: ICameraProperties) {
		this.camProps = cameraProperties;
		this.renderAxis();
	}

	private renderAxis() {
		//TODO: update axises instead of creating em
		let scrBounds = this.getScreenBoundaries();
		this.xAxis.changeLine(
			new Vector2(scrBounds.minX, 0),
			new Vector2(scrBounds.maxX, 0)
		);
		this.yAxis.changeLine(
			new Vector2(0, scrBounds.minY),
			new Vector2(0, scrBounds.maxY)
		);
	}

	private renderGrid() {
		//TODO: create grid
	}

	private getScreenBoundaries() {
		if (this.camProps == null) throw new Error("camProps in is null!");
		let minX = Math.min(
			this.camProps.bottomLeft.x,
			this.camProps.bottomRight.x,
			this.camProps.topLeft.x,
			this.camProps.topRight.x
		);
		let maxX = Math.max(
			this.camProps.bottomLeft.x,
			this.camProps.bottomRight.x,
			this.camProps.topLeft.x,
			this.camProps.topRight.x
		);
		let minY = Math.min(
			this.camProps.bottomLeft.y,
			this.camProps.bottomRight.y,
			this.camProps.topLeft.y,
			this.camProps.topRight.y
		);
		let maxY = Math.max(
			this.camProps.bottomLeft.y,
			this.camProps.bottomRight.y,
			this.camProps.topLeft.y,
			this.camProps.topRight.y
		);
		return {
			minX: minX,
			maxX: maxX,
			minY: minY,
			maxY: maxY,
		};
	}

	_setResolution(width: number, height: number): void {
		this.xAxis._setResolution(width, height);
		this.yAxis._setResolution(width, height);
	}
}
