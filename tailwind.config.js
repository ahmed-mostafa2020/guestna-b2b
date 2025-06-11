/** @type {import('tailwindcss').Config} */
// const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/feedback/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#007473",
        secColor: "#ED8A22",
        titleColor: "#008F8F",
        textDark: "#1F2626",
        textLight: "#737373",
        homeBg: "#eee",
        packageDetailsBg: "#F3F3F3",
        activityDetailsBg: "#F9FAFD",
        linksHover: "#009883",
        buttonsHover: "#E1F5F5",
        badge: "#1858A5",
        error: "#bf0000",
        success: "#5cb85c ",
        disabled: "#D9D9D9",
        border: "#ECECEC",
        accordionBorder: "#C3C3C3",
        paginationBorder: "#BEBEBE",
        footerLink: "#00000099",
        sidePageBg: "#F0F4F7",
        upperBarBg: "#112137",
        headerBg: "#012F47",
        figure: "#f4f4f46e",
      },
      fontFamily: {
        somar: ["var(--font-somar-sans)", "sans-serif"],
        ibm: ["IBM Plex Sans Arabic", "sans-serif"],
        mulish: ["Mulish", "sans-serif"],
      },
      screens: {
        "3xl": "2000px",
      },
      scale: {
        70: "0.7",
        90: "0.9",
        140: "1.4",
      },
    },
    keyframes: {
      pumping: {
        "0%": { transform: "scale(1)" },
        "20%": { transform: "scale(0.8)" },
        "30%": { transform: "scale(1.1)" },
        "50%": { transform: "scale(1.5)" },
        "100%": { transform: "scale(1)" },
      },
      rotation: {
        "0%": { transform: "rotate(0deg)" },
        "50%": { transform: "rotate(20deg)" },
        "100%": { transform: "rotate(0deg)" },
      },
    },
    animation: {
      pumping: "pumping 1s ease-in-out infinite",
      rotation: "rotation 3s ease-in-out infinite",
    },
  },
  plugins: [],
};
