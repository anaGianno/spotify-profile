import { useParams } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";
import { useState, useEffect } from "react";

function Profile() {
  const [image_url, setImage_url] = useState(null);
  const [user_name, setUser_name] = useState(null);
  const params = useParams<{ profileId: string }>();
  console.log(params);

  const profile_id = params.profileId;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const user = await fetch(`http://localhost:3000/user/${profile_id}`, {
          method: "GET",
          //include session cookie
          credentials: "include",
        });

        console.log("Profile.tsx user: ", user);
        const userData = await user.json();
        console.log("User Data:", userData);

        // const image_url = userData.image_url;
        setImage_url(userData.image_url);
        setUser_name(userData.user_name);
      } catch (error) {
        console.error("Error in handleCallback:", error);
      }
    };

    handleCallback();
  }, []);

  return (
    <>
      <div>Profile {params.profileId}</div>
      {image_url ? (
        <ProfilePicture src={image_url} /> // Display the profile picture once image_url is available
      ) : (
        <div>No image available</div> // Show a fallback if image_url is null
      )}
      {user_name ? (
        <div>{user_name}</div> // Display the profile picture once image_url is available
      ) : (
        <div>No user_name available</div> // Show a fallback if image_url is null
      )}
    </>
  );

  // return <div>Profile {params.profileId}</div>;
}

export default Profile;
