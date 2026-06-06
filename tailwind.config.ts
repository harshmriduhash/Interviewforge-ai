/** @type {import('tailwindcss').Config} */
// Provide explicit content globs so Tailwind generates utilities for production builds.
module.exports = {
	content: [
		'./src/app/**/*.{ts,tsx,js,jsx,mdx}',
		'./src/components/**/*.{ts,tsx,js,jsx,mdx}',
		'./src/**/*.{ts,tsx,js,jsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				'primary-hover': 'var(--color-primary-hover)',
				'primary-light': 'var(--color-primary-light)',

				background: 'var(--color-background)',
				surface: 'var(--color-surface)',
				'surface-2': 'var(--color-surface-2)',
				'surface-3': 'var(--color-surface-3)',

				border: 'var(--color-border)',
				'border-subtle': 'var(--color-border-subtle)',

				'text-primary': 'var(--color-text-primary)',
				'text-secondary': 'var(--color-text-secondary)',
				'text-muted': 'var(--color-text-muted)',

				success: 'var(--color-success)',
				warning: 'var(--color-warning)',
				error: 'var(--color-error)',

				'score-high': 'var(--color-score-high)',
				'score-mid': 'var(--color-score-mid)',
				'score-low': 'var(--color-score-low)'
			},
			fontFamily: {
				sans: ['var(--font-sans)'],
				mono: ['var(--font-mono)'],
			}
		}
	},
	plugins: [],
};
