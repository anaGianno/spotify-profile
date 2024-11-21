// import { useState } from "react";
import "./App.css";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

// import googleButton from "./assets/btn_google_signin_dark_pressed_web.png";

// function navigate(url: string) {
//   window.location.href = url;
// }

// async function auth() {
//   const response = await fetch("http://127.0.0.1:3000/request", {
//     method: "post",
//   });
//   const data = await response.json();
//   navigate(data.url);
// }

function App() {
  return (
    <>
      {/* <h1>Welcome</h1>
      <h3>Google OAuth</h3>
      <button type="button" onClick={() => auth()}>
        <img src={googleButton} alt="google sign in" />
      </button> */}

      {/* <GoogleLogin
        onSuccess={(credentialResponse) => {
          // const decoded = jwtDecode(credentialResponse);
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      /> */}
    </>
  );
}

export default App;
