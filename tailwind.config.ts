/** @type {import('tailwindcss').Config} */
// Provide explicit content globs so Tailwind generates utilities for production builds.
module.exports = {
	content: [
		'./src/app/**/*.{ts,tsx,js,jsx,mdx}',
		'./src/components/**/*.{ts,tsx,js,jsx,mdx}',
		'./src/**/*.{ts,tsx,js,jsx,mdx}'
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
