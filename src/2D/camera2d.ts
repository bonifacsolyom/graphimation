import {OrthographicCamera} from 'three';

export class Camera2D {
	private camera : OrthographicCamera;
	private aspect: number;
	private frustumSize: number;

	constructor(width: number, height: number) {
		this.aspect = width / height;
		this.frustumSize = 10;
		this.camera = new OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 1, 1000);
		this.camera.position.set(0, 0, 1);
	}

	getCamera(): OrthographicCamera {
		return this.camera;
	}
}