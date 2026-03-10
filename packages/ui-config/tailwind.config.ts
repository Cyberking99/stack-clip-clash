import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
    theme: {
        extend: {
            colors: {
                primary: "#8B5CF6", // Violet-500
                secondary: "#10B981", // Emerald-500
                background: "#0F172A", // Slate-900
                surface: "#1E293B", // Slate-800
                text: "#F8FAFC", // Slate-50
                muted: "#94A3B8", // Slate-400
                accent: "#F59E0B" // Amber-500
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Outfit", "sans-serif"]
            }
        },
    },
    plugins: [],
};

export default config;
