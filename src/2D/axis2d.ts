import * as THREE from "three";
import * as math from "mathjs";

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
	}

	update(viewEdges: any) {
		let cameraPoints = {
			left: viewEdges.left,
			right: viewEdges.right,
			top: viewEdges.top,
			bottom: viewEdges.bottom,
			// topleft: MATH.intersect()
		}
    }

    private renderAxis() {
        
    }

    private renderGrid() {

    }
}
