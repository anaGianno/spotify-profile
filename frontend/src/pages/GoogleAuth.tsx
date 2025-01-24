import { useEffect } from "react";

const GoogleAuth = () => {
  useEffect(() => {
    const handleCallback = async () => {
      // Redirects to backend; top level navigation request, not a fetch request
      window.location.href = "http://localhost:3000/auth/google";
    };
    handleCallback();
  }, []);

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

export default GoogleAuth;
