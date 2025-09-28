/** @type {import('tailwindcss').Config} */
// const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/feedback/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Event type colors - solid variants (unique colors, no red)
    'bg-emerald-600',    // TRIP
    'bg-violet-600',     // MEETING/METING
    'bg-sky-600',        // TRAINING
    'bg-indigo-600',     // CONFERENCE
    'bg-teal-600',       // ACADEMIC
    'bg-amber-600',      // LEAVE
    'bg-orange-600',     // EXAM
    'bg-pink-600',       // SOCIAL
    'bg-slate-600',      // ADMINISTRATIVE
    'bg-fuchsia-600',    // ENTERTAINMENT
    'bg-gray-600',       // OTHER
    // Event type colors - light variants
    'bg-emerald-100',
    'bg-violet-100',
    'bg-sky-100',
    'bg-indigo-100',
    'bg-teal-100',
    'bg-amber-100',
    'bg-orange-100',
    'bg-pink-100',
    'bg-slate-100',
    'bg-fuchsia-100',
    'bg-gray-100',
    // Event type text colors
    'text-white',
    'text-emerald-700',
    'text-violet-700',
    'text-sky-700',
    'text-indigo-700',
    'text-teal-700',
    'text-amber-700',
    'text-orange-700',
    'text-pink-700',
    'text-slate-700',
    'text-fuchsia-700',
    'text-gray-700',
    // Border colors
    'border-emerald-600',
    'border-violet-600',
    'border-sky-600',
    'border-indigo-600',
    'border-teal-600',
    'border-amber-600',
    'border-orange-600',
    'border-pink-600',
    'border-slate-600',
    'border-fuchsia-600',
    'border-gray-600',
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#007473",
        secColor: "#F09814",
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
      boxShadow: {
        card: "0px 0px 4px 0px rgba(0, 0, 0, 0.16)",
        tag: "0px 0px 8px 0px rgba(0, 0, 0, 0.08)",
        profile: "4px 4px 16px 0 rgba(0, 0, 0, 0.08)",
        navigationDropdown: "0 4px 4px 0 rgba(0, 0, 0, 0.02)",
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
