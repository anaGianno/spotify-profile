import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientId = "12e3e93e854549c2a30f11df737b1a1d";

const SpotifyAuth = () => {
  // console.log("test2");
  const navigate = useNavigate();

  //runs after component has rendered; initiating logic on update
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    //function that makes requests to backend for spotify access token and profile
    const handleCallback = async () => {
      //verify that request is authentic
      const verifier = localStorage.getItem("verifier");
      // console.log("verifier from localstorage: ", verifier);

      try {
        //make a request to backend which gets the spotify access token
        // console.log("Sending to exchange token:", { clientId, code, verifier });
        const response = await fetch(
          "http://localhost:3000/auth/spotify/exchange-token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            //include session cookie
            credentials: "include",
            body: JSON.stringify({ clientId, code, codeVerifier: verifier }),
          }
        );

        //error handling
        if (!response.ok) {
          throw new Error("Failed to exchange token");
        }

        //log status of request to backend
        // const status = await response.json();
        // console.log("Spotify access token response: " + status);

        //make a GET request to backend which gets the spotify profile using the spotify access token
        const profileResponse = await fetch(
          "http://localhost:3000/auth/spotify/profile",
          {
            method: "GET",
            //include session cookie
            credentials: "include",
          }
        );

        //log status of request to backend
        const profileData = await profileResponse.json();
        console.log(profileData);

        const user_id = profileData.id;
        const user_name = profileData.display_name;
        const type_ = "spotify";
        const email = profileData.email;
        const image_url = profileData.images[0].url;

        console.log("User params: ", {
          user_id,
          user_name,
          type_,
          email,
          image_url,
        });

        const addUser = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          //include session cookie
          credentials: "include",
          body: JSON.stringify({ user_id, user_name, type_, email, image_url }),
        });

        if (!addUser.ok) {
          console.error("Error adding profile:", addUser.statusText);
          const errorText = await addUser.text();
          console.error("Add user error:", errorText);
        }

        //log status of request to backend
        console.log("User status: ", addUser);

        navigate(`/profiles/${user_id}`); // Redirect to a profile page after successful authentication
      } catch (error) {
        console.error("SpotifyAuth error: ", error);
      }
    };

    //function which redirects the user to the Spotify Authentication page
    const redirectToAuthCodeFlow = async () => {
      //verify that the request is authentic
      const verifier = generateCodeVerifier(128);
      // console.log("verifier generated: ", verifier);
      //hashed version of verifier
      const challenge = await generateCodeChallenge(verifier);

      //store verifier data in local storage: works like a password
      localStorage.setItem("verifier", verifier);

      const authParams = new URLSearchParams();
      authParams.append("client_id", clientId);
      authParams.append("response_type", "code");
      //URL that spotify will redirect after user authorization
      authParams.append(
        "redirect_uri",
        "http://localhost:5173/auth/spotify/callback"
      );
      //list of permissions
      authParams.append("scope", "user-read-private user-read-email");
      authParams.append("code_challenge_method", "S256");
      authParams.append("code_challenge", challenge);

      //Redirect to Spotify authorization page
      window.location.href = `https://accounts.spotify.com/authorize?${authParams.toString()}`;
    };

    //if callback contains code parameter make request to backend, otherwise redirect to auth page
    if (!code) {
      redirectToAuthCodeFlow();
    } else {
      handleCallback();
    }
  }, []);
  // [] ensures that useEffect only runs once when component mounts

  //generates the verifier used as an authentication parameter
  const generateCodeVerifier = (length: number): string => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      possible.charAt(Math.floor(Math.random() * possible.length))
    ).join("");
  };

  //generates the hashed version of the verifier
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

  return <div>Loading...</div>;
};

export default SpotifyAuth;
