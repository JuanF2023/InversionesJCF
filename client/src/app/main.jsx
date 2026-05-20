// client/src/app/main.jsx
import "../index.css";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ThemeProvider } from "@/core/theme/ThemeProvider.jsx";

import "../styles/base.css";
import "@/styles/global/scrollbar.css";
import "@/core/theme/themes.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
