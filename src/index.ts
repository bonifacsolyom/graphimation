import {Scene2D} from './2D/scene2d'
import {Point2D} from './2D/objects/point2d'

window.onload = function () {
	var scene2D = new Scene2D(window.innerWidth, window.innerHeight);
	scene2D.addObject(new Point2D(0, 0, "A"));
	document.body.appendChild(scene2D.getDomElement());
};