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
        80: "80%", // Add this line
      },
      height: {
        80: "80%", // Add this line
      },
      screens: {
        "3xl": "2500px",
        investmentXL: "1440px",
      },
      height: {
        "screen-20": "calc(100vh - 5rem)", // 5rem is equivalent to 20 in Tailwind's spacing scale
      },
      backgroundImage: (theme) => ({
        "gradient-radial": "radial-gradient(ellipse at center, #00c0e7 0%, #a34fde 100%)",
        "gradient-bank": "linear-gradient(220.23deg, #3DD6F5 -8.97%, #A34FDE 94.12%)",
        "button-bank-gradient": "linear-gradient(195deg, #3DD6F5, #a34fde)",
        "gradient-targeting": "linear-gradient(222deg,#18bdde 1.56%,#405bff 96.51%)",
        "gradient-experimentation": "linear-gradient(222deg,#c0d600 -2.68%,#05b0d2 92.81%);",
        "gradient-mobile": "linear-gradient(65deg,#ff386b 3.6%,#ffaf38 98.81%)",
        "gradient-experimentation-black":
          "linear-gradient(108.59deg, #212121 2.18%, #000000 75.85%)",
        "gradient-experimentation-grey":
          "linear-gradient(200.65deg, #58595B -25.37%, #212121 75.5%)",
        "market-header": "linear-gradient(108.59deg, #212121 2.18%, #000000 75.85%)",
        
        "gradient-airways": "linear-gradient(224.68deg, #405BFF -5.3%, #3DD6F5 112.86%)",
        "gradient-airways-2":" linear-gradient(224.68deg, #405BFF 11.37%, #3DD6F5 112.86%)",
        "gradient-airways-darker-blue":
          "linear-gradient(178.76deg, #405BFF 1.06%, #7084FF 123.42%)",
        "gradient-airways-grey": "linear-gradient(200.65deg, #58595B -25.37%, #212121 75.5%)",
        "gradient-airways-red": "linear-gradient(223.42deg, #FF386B -1.29%, #A34FDE 110.16%)",
        "gradient-investment": "linear-gradient(223.42deg, #FF386B -1.29%, #A34FDE 110.16%)",
        card1: "linear-gradient(210deg, #06F -22.78%, #3DD6F5 110.31%)",
        card2: "linear-gradient(193.42deg, #A34FDE -4.63%, #3DD6F5 138.52%)",
        card3: "linear-gradient(187.72deg, #FF386B -57.74%, #EBFF38 222.08%)",
        "gradient-airline-buttons": "linear-gradient(224.68deg, #405BFF -5.3%, #3DD6F5 112.86%)",
        bankblue: "linear-gradient(225deg, #3DD6F5 -5.3%, #405BFF 112.86%)",
        // V2 UPDATED LIST BELOW
        'bank-homepage-background': "url('/banking/backgrounds/bank-homepage-background.svg')",
        'bank-homepage-hero-background': "url('/banking/backgrounds/bank-homepage-hero-background.svg')",
        'bank-gradient-text-color': 'linear-gradient(220.23deg, #3DD6F5 -8.97%, #A34FDE 94.12%)',
        'bank-gradient-blue-background': 'linear-gradient(178.76deg, #405BFF 1.06%, #7084FF 123.42%)',
        'bank-gradient-white-background': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
        "investment-graident-background": 'linear-gradient(0deg, rgba(248, 246, 255, 0) 18.81%, #F8F6FF 130.2%)'


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
        bglightblue: "#F5F7FF",
        ldblack: "#191919",
        ldgrey: "#282828",
        ldcardgrey: "#E6E6E6",
        ldlightgray: "#939598",
        ldstoreheader: "#D1D3D4",
        awsorange: "#FF9900",
        navgray: "#282828",
        navblue: "#405BFF",
        navlink: "#6D6E71",
        loginComponentBlue: "#405BFF",
        airlinepurple: "#A34FDE",
        airlinepink: "#FF386B",
        airlinetext: "#D1D3D4",
        airlinegray: "#939598",
        airlinelightgray: "#D1D3D4",
        airlinedarkblue: "#405BFF",
        airlinelightblue: "#3DD6F5",
        airlineblack: "#212121",
        banklightblue: "#3DD6F5",
        bankdarkblue: "#405BFF",
        markettext: "#D1D3D4",
        marketgray: "#939598",
        marketblue: "#3DD6F5",
        marketgreen: "#EBFF38",
        marketBaseBlue: "#405BFF",
        investmentblue: "#405BFF",
        investmentbackgroundgrey: "#E6E6E6",
        investmentgrey: "#939598",
        investmentred: "#E83B3B",
        investmentgreen: "#00B969",
        navbargrey: "#939598",
        navbarlightgrey: "#D1D3D4",
        navbardarkgrey: "#282828",
        metaColor: "#0668E1",
        cohereColor: "#39594D",
        anthropicColor:"#da7756",
        amazonColor:"#ff9900",
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
        //V2 Update List Below
        bankhomepagebuttonblue: '#405BFF',
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
