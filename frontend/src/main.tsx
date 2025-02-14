import "./styles/style.css";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import router and pages
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.tsx";
import SpotifyAuth from "./pages/SpotifyAuth.tsx";
import GoogleAuth from "./pages/GoogleAuth.tsx";
import GoogleProfile from "./pages/GoogleProfile.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";

// set all routes to a page
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
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
  <RouterProvider router={router} />
);
