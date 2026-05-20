// client/src/core/ui/feedback/AppToaster.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

const TOAST_DURATION_MS = 3500;

const baseToastStyle = {
    background:
        "linear-gradient(180deg, color-mix(in oklab, var(--panel) 96%, var(--accent) 4%), var(--panel))",
    color: "var(--text)",
    border: "1px solid color-mix(in oklab, var(--border) 70%, var(--accent) 30%)",
    borderRadius: "16px",
    boxShadow:
        "var(--out), 0 18px 45px color-mix(in oklab, #000 65%, var(--accent) 35% / 18%)",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.01em",
    padding: "12px 14px",
    maxWidth: "420px",
};

export default function AppToaster() {
    return (
        <Toaster
            position="top-right"
            gutter={10}
            containerStyle={{
                top: 18,
                right: 18,
                zIndex: 9999,
            }}
            toastOptions={{
                duration: TOAST_DURATION_MS,
                className: "jcf-app-toast",
                style: baseToastStyle,
                success: {
                    iconTheme: {
                        primary: "var(--accent)",
                        secondary: "var(--panel)",
                    },
                },
                error: {
                    duration: 4500,
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "var(--panel)",
                    },
                    style: {
                        ...baseToastStyle,
                        border:
                            "1px solid color-mix(in oklab, #ef4444 45%, var(--border) 55%)",
                        background:
                            "linear-gradient(180deg, color-mix(in oklab, var(--panel) 92%, #ef4444 8%), var(--panel))",
                    },
                },
                loading: {
                    duration: Infinity,
                    iconTheme: {
                        primary: "var(--accent)",
                        secondary: "var(--panel)",
                    },
                },
            }}
        />
    );
}
