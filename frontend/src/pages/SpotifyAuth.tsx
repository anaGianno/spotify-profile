import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientId = "12e3e93e854549c2a30f11df737b1a1d";

const SpotifyAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const handleCallback = async () => {
      const verifier = localStorage.getItem("verifier");
      const response = await fetch("http://localhost:3000/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clientId, code, codeVerifier: verifier }),
      });

      const status = await response.json();
      console.log(status);

      const profileResponse = await fetch("http://localhost:3000/profile", {
        method: "GET",
        credentials: "include",
      });

      const profileData = await profileResponse.json();
      console.log(profileData);

      // navigate("/profile"); // Redirect to a profile page after successful authentication
    };

    const redirectToAuthCodeFlow = async () => {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);
      localStorage.setItem("verifier", verifier);

      const authParams = new URLSearchParams();
      authParams.append("client_id", clientId);
      authParams.append("response_type", "code");
      authParams.append("redirect_uri", "http://localhost:5173/callback");
      authParams.append("scope", "user-read-private user-read-email");
      authParams.append("code_challenge_method", "S256");
      authParams.append("code_challenge", challenge);

      window.location.href = `https://accounts.spotify.com/authorize?${authParams.toString()}`;
    };

    if (!code) {
      redirectToAuthCodeFlow();
    } else {
      handleCallback();
    }
  }, [navigate]);

  const generateCodeVerifier = (length: number): string => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      possible.charAt(Math.floor(Math.random() * possible.length))
    ).join("");
  };

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
