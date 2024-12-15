import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleProfile() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // request backend for google profile
        const profileResponse = await fetch(
          "http://localhost:3000/auth/google/profile",
          {
            method: "GET",
            credentials: "include", // Include cookies
          }
        );

        if (!profileResponse.ok) {
          console.error("Error fetching profile:", profileResponse.statusText);
          console.log("Error fetching profile:", profileResponse.statusText);
          return;
        }

        // log profile data and navigate to profiles page using google id
        const profileData = await profileResponse.json();
        console.log("Profile Data:", profileData);

        const user_id = profileData.id;

        const user_name = profileData.displayName;
        const type_ = "google";
        let emailUpper = profileData.emails[0].value;
        const image_url = profileData.photos[0].value;

        let email = emailUpper.toLowerCase();

        console.log("User params: ", {
          user_id,
          user_name,
          type_,
          email,
          image_url,
        });

        const addUser = await fetch("http://localhost:3000/user", {
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

        const spotifyUser = await fetch(
          `http://localhost:3000/user/email/${encodeURIComponent(email)}`,
          {
            method: "GET",
            //include session cookie
            credentials: "include",
          }
        );

        console.log("Spotify User: ", spotifyUser);
        if (!spotifyUser.ok) {
          console.error("Error adding profile:", spotifyUser.statusText);
          const errorText = await spotifyUser.text();
          console.error("Add user error:", errorText);
        } else {
          const spotifyData = await spotifyUser.json();
          console.log("Spotify Data:", spotifyData);

          const spotifyID = spotifyData[0].user_id;
          navigate(`/profile/${spotifyID}`);
          return;
        }

        navigate(`/profile/${user_id}`);
      } catch (error) {
        console.error("Error in handleCallback:", error);
        console.log("Error in handleCallback:", error);
      }
    };

    handleCallback();
  }, []);

  return <div>GoogleProfile</div>;
}

export default GoogleProfile;
