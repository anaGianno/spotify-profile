import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // fetch google profile
        const profileResponse = await fetch(
          "http://localhost:3000/auth/google/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        // log error when failed to get google profile
        if (!profileResponse.ok) {
          const status = profileResponse.status;
          const statusText = profileResponse.statusText;
          const errorDetails = await profileResponse.text();

          console.error("Error fetching google profile:", {
            status,
            statusText,
            details: errorDetails,
          });

          return;
        }

        // log profile data
        const profileData = await profileResponse.json();
        console.log("Profile Data :", profileData);

        // get user parameters from profile
        const user_id = profileData.id;
        const user_name = profileData.displayName;
        const type_ = "google";
        let emailUpper = profileData.emails[0].value;
        let email = emailUpper.toLowerCase();
        const image_url = profileData.photos[0].value;

        // add user to database
        const addUserResponse = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id, user_name, type_, email, image_url }),
        });

        // log error if adding user failed
        if (!addUserResponse.ok) {
          const status = addUserResponse.status;
          const statusText = addUserResponse.statusText;
          const errorDetails = await addUserResponse.text();

          console.error("Error adding profile to database:", {
            status,
            statusText,
            details: errorDetails,
          });

          return;
        }

        // log response
        console.log("Add google user response: " + addUserResponse);

        // check if user has spotify linked
        const spotifyUserResponse = await fetch(
          `http://localhost:3000/user/email/${encodeURIComponent(email)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        // log response
        console.log("Spotify User: ", spotifyUserResponse);

        // log error if adding spotify account is unsuccessful
        if (!spotifyUserResponse.ok) {
          const status = spotifyUserResponse.status;
          const statusText = spotifyUserResponse.statusText;
          const errorDetails = await spotifyUserResponse.text();

          console.error("Error fetching spotify profile:", {
            status,
            statusText,
            details: errorDetails,
          });
        } else {
          // otherwise navigate to spotify profile page
          const spotifyData = await spotifyUserResponse.json();
          console.log("Spotify Data:", spotifyData);

          const spotifyID = spotifyData[0].user_id;
          navigate(`/profile/${spotifyID}`);
          return;
        }

        // navigate to google profile page
        navigate(`/profile/${user_id}`);
      } catch (error) {
        console.error("Error authenticating google user: ", error);
      }
    };

    fetchUser();
  }, []);

  return <div>GoogleProfile</div>;
}

export default GoogleProfile;
