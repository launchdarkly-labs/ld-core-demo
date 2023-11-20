/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1536px",
        "3xl": "2500px",
      },
    },
    extend: {
      width: {
        '80': '80%', // Add this line
      },
      height: {
        '80': '80%', // Add this line
      },
      screens: {
        "3xl": "2500px",
      },
      height: {
        "screen-20": "calc(100vh - 5rem)", // 5rem is equivalent to 20 in Tailwind's spacing scale
      },
      backgroundImage: (theme) => ({
        "gradient-radial":
          "radial-gradient(ellipse at center, #00c0e7 0%, #a34fde 100%)",
        "gradient-releases": "linear-gradient(245deg, #00c0e7, #a34fde)",
        "gradient-blue":
          "linear-gradient(225deg, #405BFF -5.3%, #3DD6F5 112.86%)",
        "gradient-targeting":
          "linear-gradient(222deg,#18bdde 1.56%,#405bff 96.51%)",
        "gradient-experimentation":
          "linear-gradient(222deg,#c0d600 -2.68%,#05b0d2 92.81%);",
        "gradient-mobile": "linear-gradient(65deg,#ff386b 3.6%,#ffaf38 98.81%)",
        "market-header":
          "linear-gradient(108.59deg, #212121 2.18%, #000000 75.85%)",
        "gradient-airways":
          "linear-gradient(131deg, #A34FDE -15.82%, #405BFF 118.85%)",
        card1: "linear-gradient(210deg, #06F -22.78%, #3DD6F5 110.31%)",
        card2: "linear-gradient(193.42deg, #A34FDE -4.63%, #3DD6F5 138.52%)",
        card3: "linear-gradient(187.72deg, #FF386B -57.74%, #EBFF38 222.08%)",
        card4bottom:
          "linear-gradient(39.47deg, #A34FDE -17.19%, #FF386B 148.9%)",
        bankblue: "linear-gradient(225deg, #3DD6F5 -5.3%, #405BFF 112.86%)",
      }),
      fontFamily: {
        sohne: ["Sohne"],
        sohnemono: ["Sohne Mono"],
        sohnelight: ["Sohne Light"],
        audimat: ["Audimat"],
        roboto: ["Roboto"],
        robotobold: ["Roboto-Bold"],
        robotolight: ["Roboto-Light"],
        robotothin: ["Roboto-Thin"],
        audimat: ["Audimat"],
        sohnelight: ["Sohne Light"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ldblack: "#191919",
        ldgrey: "#282828",
        ldcardgrey: "#E6E6E6",
        ldlightgray: "#939598",
        ldstoreheader: "#D1D3D4",
        awsorange: "#FF9900",
        navgray: "#282828",
        airlinetext: "#D1D3D4",
        airlinepurple: "#A34FDE",
        airlinepink: "#FF386B",
        airlineinactive: "#939598",
        banklightblue: "#3DD6F5",
        bankdarkblue: "#405BFF",
        marketblue: "#3DD6F5",
        marketgreen: "#EBFF38",
        airlinePurple: "#7084FF",
        airlineBlack: "#2C2C2C",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
