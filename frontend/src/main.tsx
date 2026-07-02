import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createAppServices } from "./composition/createAppServices";
import { ServicesProvider } from "./composition/ServicesContext";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import App from "./App.tsx";

const appServices = createAppServices();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServicesProvider services={appServices}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ServicesProvider>
  </StrictMode>,
);
