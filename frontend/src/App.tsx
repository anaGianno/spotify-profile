import OauthButton from "./components/OauthButton";
import "./style.css";

function App() {
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
