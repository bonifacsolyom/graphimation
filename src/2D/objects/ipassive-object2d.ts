import * as THREE from "three";

/**
 * An interface that represents a drawable 2D object in the scene. Can be a point, line, square etc.
 * Passive means that the user won't be able to interact with it, it just hangs out in the scene
 */
export interface IPassiveObject2D {
	/**
	 * Returns the three.js mesh of this object
	 * @returns The three.js mesh of this object
	 */
	getMesh(): THREE.Mesh;

	/**
	 * Changes the position of the object, interpolating between the old and the new value.
	 * @param newPos The new position of the object
	 * @param time The time it takes for the move animation. Set to 0 for an instantaneous result
	 */
	changePosition(newPos: THREE.Vector2, time?: number): void;

	/**
	 * Changes the color of the object, interpolating between the old and the new value
	 * @param color The new color of the object
	 * @param time The time it takes for the color change animation. Set to 0 for an instantaneous result
	 */
	changeColor(color: THREE.Color, time?: number): void;

	/**
	 * Changes the scale of the object, interpolating between the old and the new value
	 * @param newScale The new scale of the object
	 * @param time The time it takes for the scaling animation. Set to 0 for an instantaneous result
	 */
	changeScale(newScale: number, time?: number): void;

	/**
	 * Returns the mathematical center of the object
	 * @returns The center of the object
	 */
	getCenter(): THREE.Vector2;

	/**
	 * Toggles whether the object's name is visible above it or not
	 */
	toggleName(): void;
}
