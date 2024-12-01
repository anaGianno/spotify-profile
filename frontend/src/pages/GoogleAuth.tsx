import { useEffect } from "react";

const GoogleAuth = () => {
  useEffect(() => {
    const handleCallback = async () => {
      // const response = await fetch("http://localhost:3000/auth/google", {
      //   method: "GET",
      //   credentials: "include",
      // });

      // const status = await response.json();
      // console.log(status);
      window.location.href = "http://localhost:3000/auth/google"; // Redirects to backend
    };
    handleCallback();
  }, []);

  return <div>Loading...</div>;
};

export default GoogleAuth;
