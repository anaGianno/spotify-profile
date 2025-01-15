import OauthButton from "./components/OauthButton";
import "./style.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.className = "root log-in"; // Set the className for the root div
    }
    return () => {
      if (rootElement) {
        rootElement.className = ""; // Clean up on unmount
      }
    };
  }, []);

  return (
    <>
      <div className="log-in-parent">
        <p className="log-in-title">Spotify Profile</p>
        <p className="log-in-subtext">Sign in with:</p>
        <div className="log-in-row">
          <OauthButton route="/auth/spotify" color="success">
            Spotify
          </OauthButton>

          <OauthButton route="/auth/google" color="success">
            Google
          </OauthButton>
        </div>
      </div>
    </>
  );
}

export default App;
