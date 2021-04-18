import * as CONVERT from 'color-convert';
import * as THREE from 'three';

function THREEColorToHSV(color: THREE.Color): [number, number, number] {
    return CONVERT.hex.hsv(color.getHexString())
}

function HSVToTHREEColor(hsv: [number, number, number]): THREE.Color {
    let color = CONVERT.hsv.rgb(hsv)
    color[0] /= 255;
    color[1] /= 255;
    color[2] /= 255;
    return new THREE.Color(color[0], color[1], color[2]);
}

export {THREEColorToHSV, HSVToTHREEColor};