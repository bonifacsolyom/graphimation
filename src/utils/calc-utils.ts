import * as math from "mathjs";
import { Vector2 } from "three";

export function radianToDegree(angle: number): number {
	return angle * (180 / Math.PI);
}

export function degreeToRadian(angle: number): number {
	return angle * (Math.PI / 180);
}

export function intersectRays(
	p1: Vector2,
	dir1: Vector2,
	p2: Vector2,
	dir2: Vector2
): Vector2 {
	let p11 = p1;
	let p12 = p1.clone().add(dir1);
	let p21 = p2;
	let p22 = p2.clone().add(dir2);
	return intersect(p11, p12, p21, p22);
}

export function intersect(
	p11: Vector2,
	p12: Vector2,
	p21: Vector2,
	p22: Vector2
): Vector2 {
	let p11_arr: [number, number] = [p11.x, p11.y];
	let p12_arr: [number, number] = [p12.x, p12.y];
	let p21_arr: [number, number] = [p21.x, p21.y];
	let p22_arr: [number, number] = [p22.x, p22.y];

	let intersect_arr: number[] = <number[]>(
		math.intersect(p11_arr, p12_arr, p21_arr, p22_arr)
	);
	return new Vector2(intersect_arr[0], intersect_arr[1]);
}

/**
 * Returns the angle of a line in radians.
 * @param startPoint
 * @param endPoint
 * @returns
 */
export function lineAngle(startPoint: Vector2, endPoint: Vector2) {
	var dy = endPoint.y - startPoint.y;
	var dx = endPoint.x - startPoint.x;
	var theta = Math.atan2(dy, dx); // range (-PI, PI]
	return theta;
}
