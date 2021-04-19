import * as CONVERT from 'color-convert';
import * as THREE from 'three';

//H: 0-360
//S: 0-100
//V: 0-100
export function THREEColorToHSV(color: THREE.Color): [number, number, number] {
	return CONVERT.hex.hsv(color.getHexString())
}

export function HSVToTHREEColor(hsv: [number, number, number]): THREE.Color {
	let color = CONVERT.hsv.rgb(hsv)
	color[0] /= 255;
	color[1] /= 255;
	color[2] /= 255;
	return new THREE.Color(color[0], color[1], color[2]);
}

export function THREEColorToHSL(color: THREE.Color): [number, number, number] {
	return CONVERT.hex.hsl(color.getHexString())
}


export function HSLToTHREEColor(hsl: [number, number, number]): THREE.Color {
	let color = CONVERT.hsl.rgb(hsl)
	color[0] /= 255;
	color[1] /= 255;
	color[2] /= 255;
	return new THREE.Color(color[0], color[1], color[2]);
}

export function HSLtoHSV(hsl: [number, number, number]) {
	return CONVERT.hsl.hsv(hsl);
}

export function HSVtoHSL(hsv: [number, number, number]) {
	return CONVERT.hsv.hsl(hsv);
}