import * as THREE from "three";

//TODO: delete this interface, Object2D is sufficient now
/**
 * An interface that represents a drawable 2D object in the scene. Can be a point, line, square etc.
 */
export interface IObject2D {
	/**
	 * A method that's called when a user either hovers their cursor over or away from the object.
	 * Will not have any effect if the object's hoverable property is set to false.
	 * @param hover true if the mouse is over the object, false if not
	 */
	hover(hover: boolean): void;

	/**
	 * Called when the user clicks on the object.
	 */
	click(): void;

	/**
	 * Returns the three.js mesh of this object
	 * @returns The three.js mesh of this object
	 */
	getMesh(): THREE.Mesh;

	/**
	 * Changes the position of the object, smoothly interpolating between the old and the new value.
	 * @param newPos The new position of the object
	 * @param time The time it takes for the move animation. Set to 0 for an instantaneous result
	 */
	changePosition(newPos: THREE.Vector2, time?: number): void;

	/**
	 * Changes the color of the object, smoothly interpolating between the old and the new value.
	 * @param color The new color of the object
	 * @param time The time it takes for the color change animation. Set to 0 for an instantaneous result
	 */
	changeColor(color: THREE.Color, time?: number): void;

	/**
	 * Changes the scale of the object, smoothly interpolating between the old and the new value.
	 * @param newScale The new scale of the object
	 * @param time The time it takes for the scaling animation. Set to 0 for an instantaneous result
	 */
	changeScale(newScale: number, time?: number): void;

	/**
	 *
	 * @returns The mathematical center of the object.
	 */
	getCenter(): THREE.Vector2;

	/**
	 * Toggles whether the object's name is visible above it or not.
	 */
	toggleName(): void;
}
