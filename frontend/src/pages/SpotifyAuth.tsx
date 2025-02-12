import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientId = "12e3e93e854549c2a30f11df737b1a1d";

const SpotifyAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // function that makes requests to backend for spotify access token and profile
    const fetchUser = async () => {
      const verifier = localStorage.getItem("verifier");

      try {
        // fetch spotify access token
        const tokenResponse = await fetch(
          "http://localhost:3000/auth/spotify/exchange-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ clientId, code, codeVerifier: verifier }),
          }
        );

        // return error if token exchange failed
        if (!tokenResponse.ok) {
          const status = tokenResponse.status;
          const statusText = tokenResponse.statusText;
          const errorDetails = await tokenResponse.text();

          console.error("Error fetching spotify token:", {
            status,
            statusText,
            details: errorDetails,
          });

          return;
        }

        // fetch spotify profile
        const profileResponse = await fetch(
          "http://localhost:3000/auth/spotify/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        // log error if fetching spotify profile failed
        if (!profileResponse.ok) {
          const status = profileResponse.status;
          const statusText = profileResponse.statusText;
          const errorDetails = await profileResponse.text();

          console.error("Error fetching spotify profile:", {
            status,
            statusText,
            details: errorDetails,
          });

          return;
        }

        // log profile data
        const profileData = await profileResponse.json();
        console.log("Profile data ", profileData);

        // get profile parameters from profile data
        const user_id = profileData.id;
        const user_name = profileData.display_name;
        const type_ = "spotify";
        const email = profileData.email;
        const image_url = profileData.images[0].url;

        // add user to database
        const addUserResponse = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id, user_name, type_, email, image_url }),
        });

        // log response
        console.log("Add user response:", addUserResponse);

        // log error if adding user fails
        if (!addUserResponse.ok) {
          const status = addUserResponse.status;
          const statusText = addUserResponse.statusText;
          const errorDetails = await addUserResponse.text();

          console.error("Error adding Spotify profile:", {
            status,
            statusText,
            details: errorDetails,
          });

          return;
        }

        // log status of request to backend
        console.log("Add spotify user response: ", addUserResponse);

        // navigate to spotify profile
        navigate(`/profile/${user_id}`, { state: { fromNavigation: true } });
      } catch (error) {
        console.error("Error authenticating spotify user: ", error);
      }
    };

    // redirect to spotify authorization page
    const redirectToAuthCodeFlow = async () => {
      // verify that the request is authentic
      const verifier = generateCodeVerifier(128);

      // hashed version of verifier
      const challenge = await generateCodeChallenge(verifier);

      // store verifier data in local storage
      localStorage.setItem("verifier", verifier);

      // append all params for authorization
      const authParams = new URLSearchParams();
      authParams.append("client_id", clientId);
      authParams.append("response_type", "code");
      // URL that spotify will redirect after user authorization
      authParams.append(
        "redirect_uri",
        "http://localhost:5173/auth/spotify/callback"
      );
      //list of permissions
      authParams.append("scope", "user-read-private user-read-email");
      authParams.append("code_challenge_method", "S256");
      authParams.append("code_challenge", challenge);

      //redirect to Spotify authorization page
      window.location.href = `https://accounts.spotify.com/authorize?${authParams.toString()}`;
    };

    // if url doesnt include code parameter redirect to spotify auth page
    if (!code) {
      redirectToAuthCodeFlow();
    } else {
      // otherwise fetch spotify user
      fetchUser();
    }
  }, []);

  // generates the verifier used as an authentication parameter
  const generateCodeVerifier = (length: number): string => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      possible.charAt(Math.floor(Math.random() * possible.length))
    ).join("");
  };

  // generates the hashed version of the verifier
  const generateCodeChallenge = async (
    codeVerifier: string
  ): Promise<string> => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  return (
    <div className="loading">
      <div className="spinner-border  text-primary" role="status">
        <span className="visually-hidden " style={{}}>
          Loading...
        </span>
      </div>
    </div>
  );
};

export default SpotifyAuth;
