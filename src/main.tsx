import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/globals.css"
import "./styles/bubbles.css"
import "./styles/ticker.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
