import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <SocketProvider>
    <App />
    <Toaster
      position="top-right"
      expand={false}
      richColors
      duration={3000}
      gap={10}
      visibleToasts={5}
    />
  </SocketProvider>,

  // </StrictMode>,
);
