import OauthButton from "./components/OauthButton";

function App() {
  return (
    <>
      <OauthButton route="/auth/spotify" color="success">
        Sign in with Spotify
      </OauthButton>

      <OauthButton route="/auth/google" color="light">
        Sign in with Google
      </OauthButton>
    </>
  );
}

export default App;
