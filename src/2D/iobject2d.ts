import { Color } from "three";

//An interface that represents a drawable 2D object in the scene. Can be a point, line, square etc.
 export interface IObject2D {
    name: string;
    color: Color;

    showName: boolean;

    getMesh(): THREE.Mesh;

    //TODO: possibly add size and color parameters, maybe with default values
    //Will highlight the object (for example by enlargening and changing its color a little)
    highlight(): void;

    //Will remove the highlight from the object
    unHighlight(): void;

    changeColor(color: Color): void;

    changeSize(size: number): void;

    //Toggles whether the object's name is shown or not
    toggleName(): void;
}