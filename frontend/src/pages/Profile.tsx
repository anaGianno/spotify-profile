import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import ProfilePicture from "../components/ProfilePicture";
import Searchbar from "../components/Searchbar";

function Profile() {
  // initialize image and username in null state
  const [image_url, setImage_url] = useState(null);
  const [user_name, setUser_name] = useState(null);

  // initialize profile ID from URL
  const params = useParams<{ profileId: string }>();
  const profile_id = params.profileId;

  useEffect(() => {
    const handleProfile = async () => {
      try {
        // fetch user
        const userResponse = await fetch(
          `http://localhost:3000/user/${profile_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!userResponse.ok) {
          const status = userResponse.status;
          const statusText = userResponse.statusText;
          const errorDetails = await userResponse.text();

          console.error("Error fetching user profile:", {
            status,
            statusText,
            details: errorDetails,
          });
        }

        // log user response and data
        console.log("User response: ", userResponse);
        const userData = await userResponse.json();
        console.log("User Data: ", userData);

        // set state of image and username to user data
        setImage_url(userData.image_url);
        setUser_name(userData.user_name);

        document.body.className = "profile";
        return () => {
          document.body.className = ""; // Clean up when the component unmounts
        };
      } catch (error) {
        console.error("Error in profile callback: ", error);
      }
    };

    handleProfile();
  }, []);

  return (
    // display profile
    <>
      <div className="profile-parent">
        <p>Profile {params.profileId}</p>

        {/* display image if available */}
        {image_url ? (
          <ProfilePicture src={image_url} />
        ) : (
          <div>No image available</div>
        )}

        {/* display username if available */}
        {user_name ? <p>{user_name}</p> : <p>No user_name available</p>}

        <Searchbar />
      </div>
    </>
  );
}

export default Profile;
