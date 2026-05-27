import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "rgb(var(--background) / <alpha-value>)",
				foreground: "rgb(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
					hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
				},
				surface: {
					DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
					2: "rgb(var(--color-surface-2) / <alpha-value>)"
				},
				border: "rgb(var(--color-border) / <alpha-value>)",
				text: {
					primary: "rgb(var(--color-text-primary) / <alpha-value>)",
					secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
					muted: "rgb(var(--color-text-muted) / <alpha-value>)"
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
