import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import SpotifyAuth from "./pages/SpotifyAuth.tsx";
import GoogleAuth from "./pages/GoogleAuth.tsx";
import GoogleProfile from "./pages/GoogleProfile.tsx";
import Profile from "./pages/Profile.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
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
    //dynamic path
    path: "/profiles/:profileId",
    element: <Profile />,
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  //<App />
  <RouterProvider router={router} />
  // </StrictMode>
);
