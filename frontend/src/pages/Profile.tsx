import { useEffect } from "react";

function Profile() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const profileResponse = await fetch(
          "http://localhost:3000/profile/google",
          {
            method: "GET",
            credentials: "include", // Include cookies
          }
        );

        if (!profileResponse.ok) {
          console.error("Error fetching profile:", profileResponse.statusText);
          return;
        }

        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);
      } catch (error) {
        console.error("Error in handleCallback:", error);
      }
    };

    handleCallback();
  }, []);

  return <div>Profile</div>;
}

export default Profile;
