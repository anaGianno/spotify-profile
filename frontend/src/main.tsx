// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.css"; // Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS bundle (includes Popper.js)

// import router and pages
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpotifyAuth from "./pages/SpotifyAuth.tsx";
import GoogleAuth from "./pages/GoogleAuth.tsx";
import GoogleProfile from "./pages/GoogleProfile.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";

// set all routes to a page
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth/spotify",
    element: <SpotifyAuth />,
  },
  {
    path: "/auth/spotify/callback",
    element: <SpotifyAuth />,
  },
  {
    path: "/auth/google",
    element: <GoogleAuth />,
  },
  {
    path: "/auth/google/callback",
    element: <GoogleProfile />,
  },
  {
    //dynamic path for each profile
    path: "/profile/:profileId",
    element: <Profile />,
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  //<App />
  <RouterProvider router={router} />
  // </StrictMode>
);
