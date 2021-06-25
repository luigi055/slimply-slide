import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import externals from "rollup-plugin-node-externals";
import del from "rollup-plugin-delete";
import pkg from "./package.json";
import copy from "rollup-plugin-copy";

export default [
	{
		input: "./src/index.js",
		plugins: [
			del({ targets: "dist/*" }),
			externals({ deps: true }),
			nodeResolve({
				extensions: [".js", ".ts", ".tsx"],
			}),
			commonjs(),
			babel({
				babelHelpers: "runtime",
				exclude: "**/node_modules/**",
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			}),
			copy({
				targets: [
					{
						src: "src/style.css",
						dest: "dist",
						rename: "simply-slide.css",
					},
				],
			}),
		],
		output: [
			{ file: pkg.main, format: "cjs", sourcemap: true },
			{ file: pkg.module, format: "es", sourcemap: true },
			{
				file: "dist/simply-slide.js",
				format: "umd",
				sourcemap: true,
				name: "simplySlide",
			},
		],
	},
];
