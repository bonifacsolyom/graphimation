//Sass configuration
var gulp = require("gulp");
var typescript = require("gulp-typescript");
var header = require("gulp-header");

//Custom variables
var sourceFiles = "typescript/*.ts";
var typescriptProject = typescript.createProject("tsconfig.json"); //we use this so that we can use configuarion from tsconfig.json

//Prints the error that was found during the compilation, and makes sure that the task keeps running
function catchError(e) {
	console.log(e.message);
	this.emit("end");
}

//Converts the .ts files described in the sourceFiles variable into js
gulp.task("typescript", function (cb) {
	gulp.src(sourceFiles)
		.pipe(typescriptProject())
		.on("error", catchError)
		.pipe(
			header(
				"/* Automatically generated from .typescript, do not directly edit */\n\n"
			)
		)
		.pipe(gulp.dest("./"));
	cb();
});

//Runs the typescript task whenever files described in the sourceFiles variable change
gulp.task(
	"default",
	gulp.series("typescript", function (cb) {
		gulp.watch(sourceFiles, gulp.series("typescript"));
		cb();
	})
);
