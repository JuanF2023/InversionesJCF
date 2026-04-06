/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bgElev: "var(--bg-elev)",
        card: "var(--card)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        primary600: "var(--primary-600)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)"
      },
      borderRadius: {
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 6px)"
      },
      boxShadow: {
        soft: "var(--shadow)",
        strong: "var(--shadow-strong)"
      },
      keyframes: {
        "slide-fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(20px)" }
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } }
      },
      animation: {
        "slide-fade-out": "slide-fade-out 0.3s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-in"
      }
    }
  },
  plugins: [],
};
