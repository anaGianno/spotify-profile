import OauthButton from "../components/OauthButton";
import Header from "../components/Header";

function Login() {
  return (
    <>
      {/* Set no profile data on login */}
      <Header user_name={""} image_url={""} profile_id={""} page={"login"} />
      <div className="log-in-parent">
        <p className="log-in-title">Spotify Profile</p>
        <p className="log-in-subtext">Sign in with:</p>
        <div className="log-in-button-row">
          <OauthButton route="/auth/spotify">Spotify</OauthButton>
          <OauthButton route="/auth/google">Google</OauthButton>
        </div>
      </div>
    </>
  );
}

export default Login;
