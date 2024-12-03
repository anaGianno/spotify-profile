import { useEffect } from "react";

const GoogleAuth = () => {
  useEffect(() => {
    const handleCallback = async () => {
      // Redirects to backend; top level navigation request, not a fetch request
      window.location.href = "http://localhost:3000/auth/google";
    };
    handleCallback();
  }, []);

  return <div>Loading...</div>;
};

export default GoogleAuth;
