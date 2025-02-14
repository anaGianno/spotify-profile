import { useEffect } from "react";

function GoogleAuth() {
  useEffect(() => {
    const handleCallback = async () => {
      // redirects to backend to external authentication page using backend route
      window.location.href = "http://localhost:3000/auth/google";
    };
    handleCallback();
  }, []);

  return (
    <div className="loading">
      <div className="spinner-border  text-primary" role="status" />
    </div>
  );
}

export default GoogleAuth;
