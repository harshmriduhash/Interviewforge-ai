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
  			background: "var(--background)",
  			foreground: "var(--foreground)",
  			primary: {
  				DEFAULT: "var(--color-primary)",
  				hover: "var(--color-primary-hover)",
  				light: "var(--color-primary-light)",
  				foreground: "var(--primary-foreground)"
  			},
  			surface: {
  				DEFAULT: "var(--color-surface)",
  				2: "var(--color-surface-2)"
  			},
  			border: "var(--color-border)",
  			text: {
  				primary: "var(--color-text-primary)",
  				secondary: "var(--color-text-secondary)",
  				muted: "var(--color-text-muted)"
  			},
  			success: "var(--color-success)",
  			warning: "var(--color-warning)",
  			error: "var(--color-error)",
  			score: {
  				high: "var(--color-score-high)",
  				mid: "var(--color-score-mid)",
  				low: "var(--color-score-low)"
  			},
  			card: {
  				DEFAULT: "var(--card)",
  				foreground: "var(--card-foreground)"
  			},
  			popover: {
  				DEFAULT: "var(--popover)",
  				foreground: "var(--popover-foreground)"
  			},
  			secondary: {
  				DEFAULT: "var(--secondary)",
  				foreground: "var(--secondary-foreground)"
  			},
  			muted: {
  				DEFAULT: "var(--muted)",
  				foreground: "var(--muted-foreground)"
  			},
  			accent: {
  				DEFAULT: "var(--accent)",
  				foreground: "var(--accent-foreground)"
  			},
  			destructive: {
  				DEFAULT: "var(--destructive)",
  				foreground: "var(--destructive-foreground)"
  			},
  			input: "var(--input)",
  			ring: "var(--ring)"
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)"
  		},
  		fontFamily: {
  			sans: ["var(--font-inter)"],
  			mono: ["var(--font-jetbrains-mono)"]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
