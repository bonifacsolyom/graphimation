import {OrthographicCamera} from 'three';

export class Camera2D {
	private camera : OrthographicCamera;
	private aspect: number;
	private frustumSize: number;

	constructor(width: number, height: number) {
		const aspect = width / height;
		const frustumSize = 10;
		this.camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
		this.camera.position.set(0, 0, 1);
	}

	getCamera(): OrthographicCamera {
		return this.camera;
	}
}