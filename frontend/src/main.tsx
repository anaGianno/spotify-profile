import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId="982088853000-6n7v5o77q20ku0bk36gbem9vm5qn9q7i.apps.googleusercontent.com"> */}
    <App />
    {/* </GoogleOAuthProvider> */}
  </StrictMode>
);
