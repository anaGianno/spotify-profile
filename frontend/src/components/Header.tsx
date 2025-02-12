import { useState, useEffect, useRef } from "react";
import defaultImage from "../assets/defaultPicture.png";
import Searchbar from "../components/Searchbar";

import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  user_name: string | "";
  image_url: string | "";
  profile_id: string | "";
  section: string;
}

const Header = ({ user_name, image_url, profile_id, section }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.removeItem("loggedInProfile");

    localStorage.removeItem("loggedInImage");
    navigate("/", { state: { fromNavigation: true } });
  };

  const logIn = () => {
    navigate("/login", { state: { fromNavigation: true } });
  };

  const back = () => {
    navigate("/", { state: { fromNavigation: true } });
  };

  const profile = () => {
    const storedProfileId = localStorage.getItem("loggedInProfile");

    if (storedProfileId) {
      navigate(`/profile/${storedProfileId}`);
    }
  };

  useEffect(() => {
    console.log("TEST123");
    console.log("username1:", user_name);
    console.log("image1:", image_url);
    console.log("profileID1:", profile_id);
    console.log("storage1:", localStorage.getItem("loggedInProfile"));
    console.log("storageI1:", localStorage.getItem("loggedInImage"));

    const navigatedHere = location.state?.fromNavigation || false;
    if (navigatedHere && profile_id) {
      console.log("User logged in with profile_id:", profile_id);
      localStorage.setItem("loggedInProfile", profile_id);
      localStorage.setItem("loggedInImage", image_url);
    } else {
      console.log("User accessed via direct URL or refresh.");
    }
    console.log("storage2:", localStorage.getItem("loggedInProfile"));
    console.log("storageI2:", localStorage.getItem("loggedInImage"));
  }, [location, profile_id, user_name, image_url]);

  const renderSectionContent = () => {
    const isLoggedIn = localStorage.getItem("loggedInProfile");
    switch (section) {
      case "profile":
        return (
          <>
            <Searchbar homepage={false} />
            <img
              className="header-profile-picture"
              src={localStorage.getItem("loggedInImage") || defaultImage}
              onClick={profile}
            />
            {isLoggedIn ? (
              <button
                type="button"
                className="btn btn-dark log-button"
                onClick={logOut}
              >
                Sign out <i className="bi bi-box-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-dark log-button"
                onClick={logIn}
              >
                Sign in <i className="bi bi-box-arrow-in-right"></i>
              </button>
            )}
          </>
        );
      case "home":
        return (
          <>
            <img
              className="header-profile-picture"
              src={localStorage.getItem("loggedInImage") || defaultImage}
              onClick={profile}
            />

            {isLoggedIn ? (
              <button
                type="button"
                className="btn btn-dark log-button"
                onClick={logOut}
              >
                Sign out <i className="bi bi-box-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-dark log-button"
                onClick={logIn}
              >
                Sign in <i className="bi bi-box-arrow-in-right"></i>
              </button>
            )}
          </>
        );
      default:
        return null; // No need for empty fragments
    }
  };

  return (
    <nav className="navbar user-searchbar" data-bs-theme="dark">
      <div className="container-fluid d-flex  flex-user-searchbar">
        <p className="header-text" onClick={back}>
          Spotify Profile
        </p>
        {renderSectionContent()}
      </div>
    </nav>
  );
};

export default Header;
