import * as THREE from "three";

/**
 * An interface that represents a drawable 2D object in the scene. Can be a point, line, square etc.
 */
export interface IObject2D {
	getMesh(): THREE.Mesh;

	hover(hover: boolean): void;

	click(): void;

	changePosition(newPos: THREE.Vector2, time?: number): void;

	changeColor(color: THREE.Color, time?: number): void;

	changeScale(newScale: number, time?: number): void;

	getCenter(): THREE.Vector2;

	//Toggles whether the object's name is shown or not
	toggleName(): void;
}
