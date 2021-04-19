import { Scene2D } from "./2D/scene2d";
import { Point2D } from "./2D/objects/point2d";
import { Color, Vector2 } from "three";

window.onload = function () {
	let scene2D = new Scene2D(window.innerWidth, window.innerHeight);
	let point = new Point2D(0, 0, "A");
	scene2D.addObject(point);
	document.body.appendChild(scene2D.getDomElement());
	point.changeColor(new Color("red"), 2000);
	point.changePosition(new Vector2(5, 1), 2000);
	point.changeScale(10, 2000);
};
