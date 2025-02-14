import { useEffect } from "react";
import defaultImage from "../assets/defaultPicture.png";
import Searchbar from "../components/Searchbar";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  // pass in user data from profile page
  user_name: string | "";
  image_url: string | "";
  profile_id: string | "";
  page: string;
}

const Header = ({ user_name, image_url, profile_id, page }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // remove profile frome storage on logout and navigate to homepage
  const logOut = () => {
    localStorage.removeItem("loggedInProfile");
    localStorage.removeItem("loggedInImage");
    navigate("/", { state: { fromNavigation: true } });
  };

  // navigate to login page
  const logIn = () => {
    navigate("/login", { state: { fromNavigation: true } });
  };

  // navigate to homepage
  const back = () => {
    navigate("/", { state: { fromNavigation: true } });
  };

  // navigate to logged in profile
  const profile = () => {
    const storedProfileId = localStorage.getItem("loggedInProfile");
    if (storedProfileId) {
      navigate(`/profile/${storedProfileId}`);
    }
  };

  // store user data if they logged in
  useEffect(() => {
    const navigatedHere = location.state?.fromNavigation || false;
    if (navigatedHere && profile_id) {
      console.log("User logged in with profile_id:", profile_id);
      localStorage.setItem("loggedInProfile", profile_id);
      localStorage.setItem("loggedInImage", image_url);
    }
    // rerun effect when user data/location changes
  }, [location, profile_id, user_name, image_url]);

  // display header content based on page
  const renderSectionContent = () => {
    const isLoggedIn = localStorage.getItem("loggedInProfile");
    switch (page) {
      case "profile":
        return (
          <>
            <Searchbar page={"profile"} />
            {/* display profile content based on login */}
            {isLoggedIn ? (
              <>
                <img
                  className="header-profile-picture"
                  src={localStorage.getItem("loggedInImage") || defaultImage}
                  onClick={profile}
                />
                <button
                  type="button"
                  className="btn btn-dark header-log-button"
                  onClick={logOut}
                >
                  Sign out <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-dark header-log-button"
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
            {/* display home content based on login */}
            {isLoggedIn ? (
              <>
                <img
                  className="header-profile-picture"
                  src={localStorage.getItem("loggedInImage") || defaultImage}
                  onClick={profile}
                />
                <button
                  type="button"
                  className="btn btn-dark header-log-button"
                  onClick={logOut}
                >
                  Sign out <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-dark header-log-button"
                onClick={logIn}
              >
                Sign in <i className="bi bi-box-arrow-in-right"></i>
              </button>
            )}
          </>
        );
      default:
        return null;
    }
  };

  // return header text and dynamic content
  return (
    <nav className="navbar header" data-bs-theme="dark">
      <div className="container-fluid d-flex  header-flex-container">
        <p className="header-text" onClick={back}>
          Spotify Profile
        </p>
        {renderSectionContent()}
      </div>
    </nav>
  );
};

export default Header;
