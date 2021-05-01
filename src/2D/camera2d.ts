import * as math from "mathjs";
import {
	ClampToEdgeWrapping,
	OrthographicCamera,
	Quaternion,
	Vector2,
	Vector3,
} from "three";
import { tween, TweenableNumber } from "../utils/tweening-utils";
import { degreeToRadian, intersectRays } from "../utils/calc-utils";

export interface ICameraProperties {
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
	/**
	 * Represents the third coordinate of the camera's 3D position. Since the Z axis is only used
	 * as a means of deciding whether an object is behind or in front of other objects, it makes
	 * more sense to make the camera's position a vec2 and represent its Z coordinate this way.
	 */
	zPos: number;
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
		this.zPos = 0;
		this.zoom = new TweenableNumber(1);
		this.rotationAngle = new TweenableNumber(0);
		this.update();
	}

	getCamera(): OrthographicCamera {
		return this.camera;
	}

	private update(): void {
		this.camera.position.set(this.position.x, this.position.y, this.zPos);
		this.camera.setRotationFromAxisAngle(
			new Vector3(0, 0, 1),
			this.rotationAngle.value
		);
		this.camera.zoom = this.zoom.value;
		this.camera.updateProjectionMatrix(); //this is needed for the new zoom value to take effect
	}

	/**
	 * Changes the position of the camera, smoothly interpolating between the old and the new value.
	 * @param newPos The new position of the camera
	 * @param time The time it takes for the move animation. Set to 0 for an instantaneous result
	 */
	changePosition(newPos: Vector2, time: number = 0): void {
		tween(this.position, newPos, this.update.bind(this), time);
	}

	/**
	 * Changes the zoom level of the camera, smoothly interpolating between the old and the new value.
	 * @param newZoom The new zoom level of the camera
	 * @param time The time it takes for the zooming animation. Set to 0 for an instantaneous result
	 */
	changeZoom(newZoom: number, time: number = 0) {
		tween(this.zoom, newZoom, this.update.bind(this), time);
	}

	/**
	 * Changes the rotation of the camera, smoothly interpolating between the old and the new value.
	 * @param angle Angle in degrees
	 * @param time The time it takes for the rotation animation. Set to 0 for an instantaneous result
	 */
	changeRotation(angle: number, time: number = 0): void {
		tween(
			this.rotationAngle,
			degreeToRadian(angle),
			this.update.bind(this),
			time
		);
	}

	/**
	 *
	 * @returns The current properties of the camera
	 */
	getCameraProperties() {
		let upDir = this.getUpDir();
		let downDir = new Vector2(-upDir.x, -upDir.y);
		let rightDir = new Vector2(upDir.y, -upDir.x);
		let leftDir = new Vector2(-upDir.y, upDir.x);
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
		let topLeft = intersectRays(topEdge, leftDir, leftEdge, upDir);
		let topRight = intersectRays(topEdge, rightDir, rightEdge, upDir);
		let bottomLeft = intersectRays(bottomEdge, leftDir, leftEdge, downDir);
		let bottomRight = intersectRays(
			bottomEdge,
			rightDir,
			rightEdge,
			downDir
		);

		return {
			base: {} as ICameraProperties, //not sure if this is the proper way of doing it
			upDir: upDir,
			downDir: downDir,
			leftDir: leftDir,
			rightDir: rightDir,
			topEdge: topEdge,
			bottomEdge: bottomEdge,
			leftEdge: leftEdge,
			rightEdge: rightEdge,
			topLeft: topLeft,
			topRight: topRight,
			bottomLeft: bottomLeft,
			bottomRight: bottomRight,
		};
	}

	/**
	 *
	 * @returns A normalized vector pointing up from the camera
	 */
	private getUpDir(): Vector2 {
		return new Vector2(0, 1).rotateAround(
			new Vector2(0, 0),
			this.rotationAngle.value
		);
	}

	private convertToScreenCoordinates(vec: Vector2): Vector2 {
		//TODO: implement this method
		throw new Error("Method not implemented.");
	}

	private convertToWorldCoordinates(vec: Vector2): Vector2 {
		let rightDir = new Vector2(this.getUpDir().y, -this.getUpDir().x);

		let rightOffset = rightDir.multiplyScalar(vec.x / this.zoom.value);
		let upOffset = this.getUpDir().multiplyScalar(vec.y / this.zoom.value);

		let cameraPos = this.position.clone();
		return cameraPos.add(upOffset.add(rightOffset));
	}

	setZPos(value: number): void {
		//If the z position didn't actually change, there's no need to update the camera
		if (this.zPos == value) return;
		this.zPos = value;
		this.update();
	}
}
