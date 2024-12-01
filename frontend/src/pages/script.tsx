const clientId = "12e3e93e854549c2a30f11df737b1a1d";
//check if callback contains code parameter
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

//if URL doesnt contain code, redirect to auth
if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
  //else
  // const accessToken = await getAccessToken(clientId, code);
  const response = await fetch("http://localhost:3000/exchange-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      clientId,
      code,
      codeVerifier: localStorage.getItem("verifier"), // Retrieve code verifier from storage
    }),
  });
  const status = await response.json();
  console.log(status);

  const profile = await fetch("http://localhost:3000/profile", {
    method: "GET",
    //include cookies for session authentication
    credentials: "include",
  });
  const profileData = await profile.json();
  console.log(profileData);
  // const profile = await fetchProfile(accessToken);
  // console.log(profile);
  // populateUI(profile);
}

async function redirectToAuthCodeFlow(clientId: string) {
  //verify that request is authentic
  const verifier = generateCodeVerifier(128);
  //hashed version of the code verifier
  const challenge = await generateCodeChallenge(verifier);

  //store verifier data in local storage: works like a password
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  //URL that spotify will redirect after user authorization
  params.append("redirect_uri", "http://localhost:5173/callback");
  //list of permissions
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  //Redirect to Spotify authorization page
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// async function getAccessToken(clientId: string, code: string) {
//   //load verifier from local storage
//   const verifier = localStorage.getItem("verifier");

//   //use clientID, code returned from callback, and verifier for body params
//   const params = new URLSearchParams();
//   params.append("client_id", clientId);
//   params.append("grant_type", "authorization_code");
//   params.append("code", code);
//   params.append("redirect_uri", "http://localhost:5173/callback");
//   params.append("code_verifier", verifier!);

//   //make POST request to Spotify token API using params to verify request
//   const result = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: params,
//   });

//   //return access token from request
//   const { access_token } = await result.json();
//   return access_token;
// }

// async function fetchProfile(token: string): Promise<UserProfile> {
//   //call Web Fetch API to get profile data using Spotify Token API
//   const result = await fetch("https://api.spotify.com/v1/me", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return await result.json();
// }

//update ui with profile data
function populateUI(profile: UserProfile) {
  document.getElementById("displayName")!.innerText = profile.display_name;
  if (profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar")!.appendChild(profileImage);
  }
  document.getElementById("id")!.innerText = profile.id;
  document.getElementById("email")!.innerText = profile.email;
  document.getElementById("uri")!.innerText = profile.uri;
  document
    .getElementById("uri")!
    .setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url")!.innerText = profile.href;
  document.getElementById("url")!.setAttribute("href", profile.href);
  document.getElementById("imgUrl")!.innerText =
    profile.images[0]?.url ?? "(no profile image)";
}
