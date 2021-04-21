import { Easing, Tween } from "@tweenjs/tween.js";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import * as COLOR_UTIL from "./color-util";

/**
 * A simple class that's required for tweening.
 * You can't tween primitives, which means if you're working with a number
 * you need to box it with this class first
 */
export class TweenableNumber {
	value: number;

	constructor(value: number) {
		this.value = value;
	}
}

/**
 * Tweens (interpolates) a value using cubic ease out function.
 * @param initial The initial value of the object. Must be an object, because typescript doesn't pass references to primitives
 * @param newValue The value we want to tween to
 * @param onUpdate Which method to call when an update occurs
 * @param time The time which the tween should take
 * @returns Returns a new tween if time > 0, otherwise returns null (since the value is immediately set, thus no need for a tween)
 */
//yeah i know the header looks abysmal but that's what u get when you don't allow proper constructor overloading TYPESCRIPT
export function tween(
	initial: TweenableNumber,
	newValue: TweenableNumber | number,
	onUpdate: () => void,
	time?: number
): Tween<TweenableNumber> | null;
export function tween(
	initial: Vector2,
	newValue: Vector2,
	onUpdate: () => void,
	time?: number
): Tween<Vector2> | null;
export function tween(
	initial: Vector3,
	newValue: Vector3,
	onUpdate: () => void,
	time?: number
): Tween<Vector3> | null;
export function tween(
	initial: THREE.Color,
	newValue: THREE.Color,
	onUpdate: () => void,
	time?: number
): Tween<THREE.Color> | null;
export function tween(
	initial: any,
	newValue: any,
	onUpdate: () => void,
	time: number = 0
) {
	//if newValue is a number then we'll create a NumberHolder out of it
	if (typeof newValue === "number") {
		newValue = new TweenableNumber(newValue); //wow this is actually disgusting i'm so sorry
	}

	//if time is 0, we don't need to tween
	if (time == 0) {
		for (const property in initial) {
			initial[property] = newValue[property];
		}
		onUpdate();
		return null;
	}

	//if the value to be tweened is a color then we're dealing with an entirely different breed
	if (initial instanceof THREE.Color)
		return colorTween(initial, newValue, onUpdate, time);

	return new Tween(initial)
		.to(newValue, time)
		.easing(Easing.Cubic.Out)
		.onUpdate(onUpdate)
		.start();
}

/**
 * Tweens a color. Used internally in tween()
 * @param initial The initial color of the object.
 * @param newValue The color we want to tween to
 * @param onUpdate Which method to call when an update occurs
 * @param time The time which the tween should take
 * @returns
 */
function colorTween(
	initial: THREE.Color,
	newValue: THREE.Color,
	onUpdate: () => void,
	time?: number
): Tween<[number, number, number]> {
	//Converting the color to hsv makes the interpolation look much better
	const colorHSV = COLOR_UTIL.THREEColorToHSV(initial);
	const goalColorHSV = COLOR_UTIL.THREEColorToHSV(newValue);

	return new Tween(colorHSV)
		.to(goalColorHSV, time)
		.easing(Easing.Cubic.Out)
		.onUpdate(() => {
			initial.set(COLOR_UTIL.HSVToTHREEColor(colorHSV));
			onUpdate();
		})
		.start();
}
