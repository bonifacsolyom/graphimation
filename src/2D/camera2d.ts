import * as math from "mathjs";
import { OrthographicCamera, Quaternion, Vector2, Vector3 } from "three";
import { tween, TweenableNumber } from "../utils/tweening-utils";
import { degreeToRadian } from "../utils/unit-utils";

interface ICameraProperties {
	upDir: Vector2;
	downDir: Vector2;
	rightDir: Vector2;
	leftDir: Vector2;
	topEdge: Vector2;
	bottomEdge: Vector2;
	leftEdge: Vector2;
	rightEdge: Vector2;
	topRight: Vector2;
	topLeft: Vector2;
	bottomRight: Vector2;
	bottomLeft: Vector2;
}

export class Camera2D {
	private camera: OrthographicCamera;
	private aspect: number;
	private frustumSize: number;
	 position: Vector2;
	private zoom: TweenableNumber;
	private rotationAngle: TweenableNumber; //the rotation of the camera, in radians

	constructor(width: number, height: number) {
		this.aspect = width / height;
		this.frustumSize = 10;
		this.camera = new OrthographicCamera(
			(this.frustumSize * this.aspect) / -2,
			(this.frustumSize * this.aspect) / 2,
			this.frustumSize / 2,
			this.frustumSize / -2,
			1,
			1000
		);

		this.position = new Vector2(0, 0);
		this.zoom = new TweenableNumber(1);
		this.rotationAngle = new TweenableNumber(0);
		this.update();
	}

	getCamera(): OrthographicCamera {
		return this.camera;
	}

	private update(): void {
		this.camera.position.set(this.position.x, this.position.y, 1);
		this.camera.setRotationFromAxisAngle(
			new Vector3(0, 0, 1),
			this.rotationAngle.value
		);
		this.camera.zoom = this.zoom.value;
		this.camera.updateProjectionMatrix(); //this is needed for the new zoom value to take effect
	}

	changePosition(newPos: Vector2, time: number = 0): void {
		tween(this.position, newPos, this.update.bind(this), time);
	}

	changeZoom(newZoom: number, time: number = 0) {
		tween(this.zoom, newZoom, this.update.bind(this), time);
	}

	/**
	 *
	 * @param angle Angle in degrees
	 * @param time How long the change should take
	 */
	changeRotation(angle: number, time: number = 0): void {
		tween(
			this.rotationAngle,
			degreeToRadian(angle),
			this.update.bind(this),
			time
		);
	}

	getCameraProperties() {
		let upDir = this.getUpDir();
		let downDir = new Vector2(-upDir.x, -upDir.y);
		let rightDir = new Vector2(upDir.y, -upDir.x);
		let leftDir = new Vector2(-upDir.y, upDir.x);
		// let topEdge = this.position.add(
		// 	upDir.multiplyScalar(this.camera.top / (2 * this.zoom.value))
		// );
		let topEdge = this.convertToWorldCoordinates(
			new Vector2(0, this.camera.top)
		);
		let bottomEdge = this.convertToWorldCoordinates(
			new Vector2(0, this.camera.bottom)
		);
		let leftEdge = this.convertToWorldCoordinates(
			new Vector2(this.camera.left, 0)
		);
		let rightEdge = this.convertToWorldCoordinates(
			new Vector2(this.camera.right, 0)
		);
		// let topLeft = math.intersect(topEdge.);

		return {
			base: {} as ICameraProperties, //not sure if this is the proper way of doing it
			upDir: upDir,
			downDir: downDir,
			rightDir: rightDir,
			leftDir: leftDir,
			topEdge: topEdge,
			bottomEdge: bottomEdge,
			leftEdge: leftEdge,
			rightEdge: rightEdge,
			// topRight: Vector2,
			// topLeft: Vector2,
			// bottomRight: Vector2,
			// bottomLeft: Vector2,
		};
	}

	/**
	 *
	 * @returns A normalized vector pointing up from the camera
	 */
	getUpDir(): Vector2 {
		return new Vector2(0, 1).rotateAround(
			new Vector2(0, 0),
			this.rotationAngle.value
		);
	}

	// convertToScreenCoordinates(vec: Vector2): Vector2 {}

	convertToWorldCoordinates(vec: Vector2): Vector2 {
		let rightDir = new Vector2(this.getUpDir().y, -this.getUpDir().x);
		
		let rightOffset = rightDir.multiplyScalar(vec.x / (this.zoom.value));
		let upOffset = this.getUpDir().multiplyScalar(vec.y / (this.zoom.value));
		
		let cameraPos = this.position.clone();
		return cameraPos.add(upOffset.add(rightOffset))
	}
}
