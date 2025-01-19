import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import ProfilePicture from "../components/ProfilePicture";
import Searchbar from "../components/Searchbar";

import defaultImage from "../assets/defaultPicture.png";

function Profile() {
  // initialize image and username in null state
  const [image_url, setImage_url] = useState(null);
  const [user_name, setUser_name] = useState(null);

  // initialize user data
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [userArtists, setUserArtists] = useState<Artist[]>([]);

  // initialize profile ID from URL
  const params = useParams<{ profileId: string }>();
  const profile_id = params.profileId;

  useEffect(() => {
    getUserData();

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

  const getUserData = async () => {
    try {
      // get user tracks
      const trackResponse = await fetch(
        `http://localhost:3000/track/${profile_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!trackResponse.ok) {
        console.error(`Failed to get user tracks: ${trackResponse.statusText}`);
      }

      const trackData = await trackResponse.json();
      console.log("User tracks: ", trackData);
      setUserTracks(trackData);

      // get user albums
      const albumResponse = await fetch(
        `http://localhost:3000/album/${profile_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!albumResponse.ok) {
        console.error(`Failed to get user albums: ${albumResponse.statusText}`);
      }

      const albumData = await albumResponse.json();
      console.log("User albums: ", albumData);
      setUserAlbums(albumData);

      // get user artists
      const artistReponse = await fetch(
        `http://localhost:3000/artist/${profile_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!artistReponse.ok) {
        console.error(
          `Failed to get user artists: ${artistReponse.statusText}`
        );
      }

      const artistData = await artistReponse.json();
      console.log("User artists: ", artistData);
      setUserArtists(artistData);
    } catch (error) {
      console.error("Error displaying user data: ", error);
    }
  };

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

        <p>Artists</p>
        <div className="list-group">
          {userArtists.map((artist) => (
            <li
              key={artist.artist_id}
              className="list-group-item d-flex align-items-center"
              style={{
                backgroundColor: "rgb(0, 15, 15, 0.5)",
                border: "1px solid rgb(0, 243, 143, 0.25)",
                borderRadius: "5px",
                marginTop: "1rem",
                marginBottom: "1rem",
                width: "100%",
              }}
            >
              <div
                className="d-flex align-items-center flex-grow-1"
                style={{ overflow: "hidden" }}
              >
                <img
                  src={artist.image_url || defaultImage}
                  alt="Album"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flexGrow: 1,
                    color: "white",
                  }}
                >
                  {artist.artist_name}
                </span>
              </div>
            </li>
          ))}
        </div>

        <p>Albums</p>
        <div className="list-group">
          {userAlbums.map((album) => (
            <li
              key={album.album_id}
              className="list-group-item d-flex align-items-center"
              style={{
                backgroundColor: "rgb(0, 15, 15, 0.5)",
                border: "1px solid rgb(0, 243, 143, 0.25)",
                borderRadius: "5px",
                marginTop: "1rem",
                marginBottom: "1rem",
                width: "100%",
              }}
            >
              <div
                className="d-flex align-items-center flex-grow-1"
                style={{ overflow: "hidden" }}
              >
                <img
                  src={album.image_url || defaultImage}
                  alt="Album"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flexGrow: 1,
                    color: "white",
                  }}
                >
                  {album.album_name}
                </span>
              </div>
            </li>
          ))}
        </div>

        <p>Tracks</p>
        <div className="list-group">
          {userTracks.map((track) => (
            <li
              key={track.track_id}
              className="list-group-item d-flex align-items-center"
              style={{
                backgroundColor: "rgb(0, 15, 15, 0.5)",
                border: "1px solid rgb(0, 243, 143, 0.25)",
                borderRadius: "5px",
                marginTop: "1rem",
                marginBottom: "1rem",
                width: "100%",
              }}
            >
              <div
                className="d-flex align-items-center flex-grow-1"
                style={{ overflow: "hidden" }}
              >
                <img
                  src={track.image_url || defaultImage}
                  alt="track"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flexGrow: 1,
                    color: "white",
                  }}
                >
                  {track.track_name}
                </span>
              </div>
            </li>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
