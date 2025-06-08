import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		logs: false,
		themes: [
			"light",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgb(76, 255, 60)",
					secondary: "rgb(24, 24, 24)",
					leaf:"rgb(123,247,111)"
				},
			},
		],
	},
};
