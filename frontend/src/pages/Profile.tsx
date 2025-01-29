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

  // initialize trigger for getting user data
  const [shouldFetchUserData, setShouldFetchUserData] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    "artist" | "album" | "track"
  >("artist");

  const capitalizedSelectedCategory = `user${
    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
  }s`;

  const data = {
    userArtists,
    userTracks,
    userAlbums,
  };

  const items = data[capitalizedSelectedCategory as keyof typeof data] || [];

  const [isModalClosed, setIsModalClosed] = useState(true);

  // get user and profile data on initial load
  useEffect(() => {
    handleProfile();
    setShouldFetchUserData(true);

    const modalElement = document.getElementById("exampleModal");

    // Add event listener for when the modal is hidden
    const handleModalHidden = () => {
      setIsModalClosed(true);
      console.log("closed?: true");
      // Add your logic here (e.g., reset state, fetch data, etc.)
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    // Add event listener for when the modal is hidden
    const handleModalShown = () => {
      setIsModalClosed(false);
      console.log("closed?: false");
      // Add your logic here (e.g., reset state, fetch data, etc.)
    };

    if (modalElement) {
      modalElement.addEventListener("shown.bs.modal", handleModalShown);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
        modalElement.removeEventListener("shown.bs.modal", handleModalShown);
      }
    };
  }, []);

  // get user data whenever a new item is added to the database
  useEffect(() => {
    if (shouldFetchUserData) {
      getUserData();
      // reset the state after fetching
      setShouldFetchUserData(false);
    }
  }, [shouldFetchUserData]);

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
        document.body.className = ""; // clean up when the component unmounts
      };
    } catch (error) {
      console.error("Error in profile callback: ", error);
    }
  };

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

  const deleteItem = async (item: Artist | Album | Track, category: string) => {
    console.log("Deleting Item: ", item);
    if (!profile_id) {
      console.error("Profile ID is undefined");
      return;
    }
    console.log(
      `http://localhost:3000/${category}/${profile_id}?${category}_id=${
        item[`${category}_id` as keyof (Artist | Album | Track)]
      }`
    );

    try {
      // delete item from database
      const response = await fetch(
        `http://localhost:3000/${category}/${profile_id}?${category}_id=${
          item[`${category}_id` as keyof (Artist | Album | Track)]
        }`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error(`Failed to delete item: ${response.statusText}`);
      }

      console.log("Deleted item");
      console.log("Delete item response: ", response);
      setShouldFetchUserData(true);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  return (
    // display profile
    <>
      <div className="profile-parent">
        <div className="profile-top-container">
          <div className="profile-top" />

          {image_url ? (
            <ProfilePicture src={image_url} />
          ) : (
            <div>No image available</div>
          )}

          {user_name ? (
            <p className="profile-top-username">{user_name}</p>
          ) : (
            <p>No user_name available</p>
          )}
        </div>

        <div
          className="btn-group category-select"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            checked={selectedCategory === "artist"}
            onChange={() => setSelectedCategory("artist")}
          />
          <label className="btn btn-outline-success" htmlFor="btnradio1">
            Artist
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            checked={selectedCategory === "album"}
            onChange={() => setSelectedCategory("album")}
          />
          <label className="btn btn-outline-success" htmlFor="btnradio2">
            Album
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio3"
            autoComplete="off"
            checked={selectedCategory === "track"}
            onChange={() => setSelectedCategory("track")}
          />
          <label className="btn btn-outline-success" htmlFor="btnradio3">
            Track
          </label>
        </div>

        <div className="list-group-flex">
          <div className="list-group-container">
            <div className="category-edit-flex">
              <p className="category-text">Artists</p>
              <button
                type="button"
                className="btn btn-success btn-edit"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <i className="bi bi-pen"></i>
              </button>
            </div>

            <div className="list-group user-items">
              {items.map((item) => {
                return (
                  <li
                    key={
                      item[
                        `${selectedCategory}_id` as keyof (
                          | Artist
                          | Album
                          | Track
                        )
                      ]
                    }
                    className="list-group-item user-item d-flex align-items-center"
                  >
                    <div
                      className="d-flex align-items-center flex-grow-1"
                      style={{ overflow: "hidden" }}
                    >
                      <img
                        className="item-image"
                        src={item.image_url || defaultImage}
                        alt={selectedCategory}
                      />
                      <span className="item-text">
                        {
                          item[
                            `${selectedCategory}_name` as keyof (
                              | Artist
                              | Album
                              | Track
                            )
                          ]
                        }
                      </span>
                    </div>
                  </li>
                );
              })}
            </div>
          </div>

          <div
            className="modal fade"
            id="exampleModal"
            tab-index="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog edit-modal-dialog">
              <div className="modal-content edit-modal-content">
                <div className="modal-header edit-modal-header">
                  <p className="modal-title fs-5" id="exampleModalLabel">
                    {`Edit ${selectedCategory}`}
                  </p>
                  <div data-bs-theme="dark">
                    <button
                      type="button"
                      className="btn-close edit-btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
                <div className="modal-body">
                  {/* searchbar that gets user data when a new item is added */}
                  <Searchbar
                    triggerUpdate={() => setShouldFetchUserData(true)}
                    editCategory={selectedCategory}
                    modalIsClosed={isModalClosed}
                  />
                  <div className="list-group user-items">
                    {items.map((item) => {
                      return (
                        <li
                          key={
                            item[
                              `${selectedCategory}_id` as keyof (
                                | Artist
                                | Album
                                | Track
                              )
                            ]
                          }
                          className="list-group-item user-item d-flex align-items-center"
                        >
                          <div
                            className="d-flex align-items-center flex-grow-1"
                            style={{ overflow: "hidden" }}
                          >
                            <img
                              className="item-image"
                              src={item.image_url || defaultImage}
                              alt={selectedCategory}
                            />
                            <span className="item-text">
                              {
                                item[
                                  `${selectedCategory}_name` as keyof (
                                    | Artist
                                    | Album
                                    | Track
                                  )
                                ]
                              }
                            </span>
                            {/* <div data-bs-theme="dark">
                              <button
                                type="button"
                                className="btn-close item-close"
                                aria-label="Close"
                                onClick={() => {
                                  deleteItem(item, `${selectedCategory}`);
                                }}
                              ></button>
                            </div> */}
                            <i
                              className="bi bi-x-circle"
                              onClick={() => {
                                deleteItem(item, `${selectedCategory}`);
                              }}
                            ></i>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                </div>
                <div className="modal-footer edit-modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-success">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <div
            className="list-group-container"
            style={{
              visibility: selectedCategory !== "artist" ? "hidden" : "visible",
              display: selectedCategory !== "artist" ? "none" : "block",
            }}
          >
            <div className="category-edit-flex">
              <p className="category-text">Artists</p>
              <button type="button" className="btn btn-success btn-edit">
                <i className="bi bi-pen"></i>
              </button>
            </div>

            <div className="list-group user-items">
              {userArtists.map((artist) => (
                <li
                  key={artist.artist_id}
                  className="list-group-item user-item d-flex align-items-center"
                >
                  <div
                    className="d-flex align-items-center flex-grow-1"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      className="item-image"
                      src={artist.image_url || defaultImage}
                      alt="Artist"
                    />
                    <span className="item-text">{artist.artist_name}</span>
                    <div data-bs-theme="dark">
                      <button
                        type="button"
                        className="btn-close item-close"
                        aria-label="Close"
                        onClick={() => {
                          deleteItem(artist, "artist");
                        }}
                      ></button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div> */}

          {/* <div
            className="list-group-container"
            style={{
              visibility: selectedCategory !== "album" ? "hidden" : "visible",
              display: selectedCategory !== "album" ? "none" : "block",
            }}
          >
            <div className="category-edit-flex">
              <p className="category-text">Albums</p>
              <button type="button" className="btn btn-success btn-edit">
                <i className="bi bi-pen"></i>
              </button>
            </div>
            <div className="list-group user-items">
              {userAlbums.map((album) => (
                <li
                  key={album.album_id}
                  className="list-group-item user-item d-flex align-items-center"
                >
                  <div
                    className="d-flex align-items-center flex-grow-1"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      className="item-image"
                      src={album.image_url || defaultImage}
                      alt="Album"
                    />
                    <span className="item-text">{album.album_name}</span>
                    <div data-bs-theme="dark">
                      <button
                        type="button"
                        className="btn-close item-close"
                        aria-label="Close"
                        onClick={() => {
                          deleteItem(album, "album");
                        }}
                      ></button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div> */}

          {/* <div
            className="list-group-container"
            style={{
              visibility: selectedCategory !== "track" ? "hidden" : "visible",
              display: selectedCategory !== "track" ? "none" : "block",
            }}
          >
            <div className="category-edit-flex">
              <p className="category-text">Tracks</p>
              <button type="button" className="btn btn-success btn-edit">
                <i className="bi bi-pen"></i>
              </button>
            </div>
            <div className="list-group user-items">
              {userTracks.map((track) => (
                <li
                  key={track.track_id}
                  className="list-group-item user-item d-flex align-items-center"
                >
                  <div
                    className="d-flex align-items-center flex-grow-1"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      className="item-image"
                      src={track.image_url || defaultImage}
                      alt="Track"
                    />
                    <span className="item-text">{track.track_name}</span>
                    <div data-bs-theme="dark">
                      <button
                        type="button"
                        className="btn-close item-close"
                        aria-label="Close"
                        onClick={() => {
                          deleteItem(track, "track");
                        }}
                      ></button>
                    </div>
                  </div>
                </li>
              ))}
            </div>
            
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Profile;
