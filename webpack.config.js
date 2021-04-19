const path = require("path");
const DEV = true;

module.exports = {
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	devtool: DEV ? "eval-cheap-module-source-map" : "source-map",
	mode: DEV ? "development" : "production",
	watch: true,
	watchOptions: {
		aggregateTimeout: 200,
		poll: 1000,
		ignored: /node_modules/,
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
};
