import { Scene2D } from "./2D/scene2d";
import { Point2D } from "./2D/objects/point2d";
import { Color, Vector2 } from "three";
import { Line2D } from "./2D/objects/line2d";
import { Vector2D } from "./2D/objects/vector2d";

window.onload = function () {
	let scene2D = new Scene2D(window.innerWidth, window.innerHeight);
	// let point = new Point2D(0, 0, "A");
	// let point2 = new Point2D(0, 0, "B", new Color("blue"));
	// let line = new Line2D(0, 0, 2, 2, "line");
	let centerPoint = new Point2D(0, 0, "center", new Color("red"));
	let vector = new Vector2D(-1, -1, 2, 1, "vector");

	// scene2D.addObject(point);
	// scene2D.addObject(point2);
	// scene2D.addObject(line);
	scene2D.addObject(centerPoint);
	scene2D.addObject(vector);

	document.body.appendChild(scene2D.getDomElement());
	// point.changeColor(new Color("red"), 2000);
	// point.changePosition(new Vector2(5, 1), 2000);
	// point.changeScale(10, 2000);
	// point2.changeColor(new Color("green"), 4000);
	// point2.changePosition(new Vector2(-1, -1), 4000);
	// point2.changeScale(6, 4000);

	// scene2D.changeCameraPosition(new Vector2(2, 1), 5000);
	// scene2D.changeCameraZoom(0.85, 5000);
	// scene2D.changeCameraRotation(0, 20000);
};
