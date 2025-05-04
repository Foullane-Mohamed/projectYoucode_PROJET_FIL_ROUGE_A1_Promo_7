import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

window.PLACEHOLDER_IMAGE = "/placeholder.png";

window.API_BASE_URL = "http://localhost:8000";
window.API_STORAGE_URL = `${window.API_BASE_URL}/storage`;





createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
