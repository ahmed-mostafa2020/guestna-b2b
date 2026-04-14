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
    "bg-emerald-600", // TRIP
    "bg-violet-600", // MEETING/METING
    "bg-sky-600", // TRAINING
    "bg-indigo-600", // CONFERENCE
    "bg-teal-600", // ACADEMIC
    "bg-amber-600", // LEAVE
    "bg-orange-600", // EXAM
    "bg-pink-600", // SOCIAL
    "bg-slate-600", // ADMINISTRATIVE
    "bg-fuchsia-600", // ENTERTAINMENT
    "bg-gray-600", // OTHER
    // Event type colors - light variants
    "bg-emerald-100",
    "bg-violet-100",
    "bg-sky-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-amber-100",
    "bg-orange-100",
    "bg-pink-100",
    "bg-slate-100",
    "bg-fuchsia-100",
    "bg-gray-100",
    // Event type text colors
    "text-white",
    "text-emerald-700",
    "text-violet-700",
    "text-sky-700",
    "text-indigo-700",
    "text-teal-700",
    "text-amber-700",
    "text-orange-700",
    "text-pink-700",
    "text-slate-700",
    "text-fuchsia-700",
    "text-gray-700",
    // Border colors
    "border-emerald-600",
    "border-violet-600",
    "border-sky-600",
    "border-indigo-600",
    "border-teal-600",
    "border-amber-600",
    "border-orange-600",
    "border-pink-600",
    "border-slate-600",
    "border-fuchsia-600",
    "border-gray-600",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "var(--color-main)",
        secColor: "var(--color-secondary)",
        titleColor: "var(--color-title)",
        textDark: "var(--color-text-dark)",
        textLight: "var(--color-text-light)",
        homeBg: "var(--color-bg-home)",
        packageDetailsBg: "var(--color-bg-package-details)",
        activityDetailsBg: "var(--color-bg-activity-details)",
        linksHover: "var(--color-links-hover)",
        buttonsHover: "var(--color-buttons-hover)",
        badge: "var(--color-badge)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        disabled: "var(--color-disabled)",
        border: "var(--color-border)",
        tableRowBorder: "var(--color-border-table-row)",
        accordionBorder: "var(--color-border-accordion)",
        paginationBorder: "var(--color-border-pagination)",
        footerLink: "var(--color-footer-link)",
        sidePageBg: "var(--color-bg-side-page)",
        status: {
          success: {
            bg: "var(--color-status-success-bg)",
            fg: "var(--color-status-success-fg)",
            border: "var(--color-status-success-border)",
          },
          warning: {
            bg: "var(--color-status-warning-bg)",
            fg: "var(--color-status-warning-fg)",
            border: "var(--color-status-warning-border)",
          },
          info: {
            bg: "var(--color-status-info-bg)",
            fg: "var(--color-status-info-fg)",
            border: "var(--color-status-info-border)",
          },
          hold: {
            bg: "var(--color-status-hold-bg)",
            fg: "var(--color-status-hold-fg)",
            border: "var(--color-status-hold-border)",
          },
          danger: {
            bg: "var(--color-status-danger-bg)",
            fg: "var(--color-status-danger-fg)",
            border: "var(--color-status-danger-border)",
          },
          neutral: {
            bg: "var(--color-status-neutral-bg)",
            fg: "var(--color-status-neutral-fg)",
            border: "var(--color-status-neutral-border)",
          },
        },
        upperBarBg: "var(--color-bg-upper-bar)",
        headerBg: "var(--color-bg-header)",
        figure: "var(--color-bg-figure)",
      },
      boxShadow: {
        card: "0px 0px 4px 0px rgba(0, 0, 0, 0.16)",
        tag: "0px 0px 8px 0px rgba(0, 0, 0, 0.08)",
        profile: "4px 4px 16px 0 rgba(0, 0, 0, 0.08)",
        navigationDropdown: "0 4px 4px 0 rgba(0, 0, 0, 0.02)",
      },
      backgroundImage: {
        "activities-market-gradient":
          "linear-gradient(to bottom, rgba(120, 223, 255, 0.60) 9.28%, rgba(0, 129, 169, 0.60) 55.56%)",
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
