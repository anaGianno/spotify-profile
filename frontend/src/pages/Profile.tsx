import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Searchbar from "../components/EditSearchbar";
import Header from "../components/Header";
import defaultImage from "../assets/defaultPicture.png";
import React from "react";

function Profile() {
  // image and username in null state
  const [image_url, setImage_url] = useState(null);
  const [user_name, setUser_name] = useState(null);

  // user data
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [userArtists, setUserArtists] = useState<Artist[]>([]);

  // profile ID from URL
  const params = useParams<{ profileId: string }>();
  const profile_id = params.profileId;

  // trigger for getting user data
  const [shouldFetchUserItems, setShouldFetchUserItems] = useState(false);

  // selected item category
  const [selectedCategory, setSelectedCategory] = useState<
    "artist" | "album" | "track"
  >("artist");

  // modal state
  const [isModalClosed, setIsModalClosed] = useState(true);

  // use capitalised category to display selected category items
  const capitalizedSelectedCategory = `user${
    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
  }s`;

  const data = {
    userArtists,
    userTracks,
    userAlbums,
  };

  const items = data[capitalizedSelectedCategory as keyof typeof data] || [];

  useEffect(() => {
    fetchUser();
    // get user and profile data on initial load
    setShouldFetchUserItems(true);

    const modalElement = document.getElementById("editModal");

    // Add event listener for when the modal is hidden
    const handleModalHidden = () => {
      setIsModalClosed(true);
      console.log("closed?: true");
    };

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    // Add event listener for when the modal is hidden
    const handleModalShown = () => {
      setIsModalClosed(false);
      console.log("closed?: false");
    };

    if (modalElement) {
      modalElement.addEventListener("shown.bs.modal", handleModalShown);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
        modalElement.removeEventListener("shown.bs.modal", handleModalShown);
      }
    };
  }, [profile_id]);

  // get user data whenever a new item is added to the database
  useEffect(() => {
    if (shouldFetchUserItems) {
      fetchUserItems();
      // reset the state after fetching
      setShouldFetchUserItems(false);
    }
  }, [shouldFetchUserItems]);

  // get user data and set their image/name
  const fetchUser = async () => {
    try {
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

      // log user data
      const userData = await userResponse.json();
      console.log("Fetched user data: ", userData);

      // set state of image and username to user data
      setImage_url(userData.image_url);
      setUser_name(userData.user_name);
    } catch (error) {
      console.error("Error in profile callback: ", error);
    }
  };

  const fetchUserItems = async () => {
    try {
      // get/set user tracks
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

      // get/set user albums
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

      // get/set user artists
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

  // delete selected item from database
  const deleteItem = async (item: Artist | Album | Track) => {
    try {
      // delete item from database
      const response = await fetch(
        `http://localhost:3000/${selectedCategory}/${profile_id}?${selectedCategory}_id=${
          item[`${selectedCategory}_id` as keyof (Artist | Album | Track)]
        }`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error(`Failed to delete item: ${response.statusText}`);
        return;
      }

      console.log("Deleted item: ", item);
      setShouldFetchUserItems(true);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  // get stored profile from local storage
  const isLoggedIn = localStorage.getItem("loggedInProfile");

  return (
    <>
      <Header
        user_name={user_name ?? ""}
        image_url={image_url ?? ""}
        profile_id={profile_id ?? ""}
        page={"profile"}
      />
      <div className="profile-parent">
        <div className="profile-top-container">
          <div className="profile-top" />
          {/* display profile image/username */}
          {image_url ? (
            <img
              src={image_url}
              className="img-fluid profile-top-picture"
              alt="profile-top-picture"
            ></img>
          ) : (
            <div>No image available</div>
          )}
          {user_name ? (
            <p className="profile-top-username">{user_name}</p>
          ) : (
            <p>No username available</p>
          )}
        </div>
        {/* category buttons */}
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
            {/* category name and edit button */}
            <div className="category-edit-flex">
              <p className="category-text">
                {selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}
              </p>
              {isLoggedIn === profile_id ? (
                <button
                  type="button"
                  className="btn btn-success btn-edit"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                >
                  <i className="bi bi-pen"></i>
                </button>
              ) : (
                <></>
              )}
            </div>

            {/* user items based on category */}
            <div className="list-group user-items">
              {items.map((item) => {
                return (
                  <React.Fragment
                    key={
                      item[
                        `${selectedCategory}_id` as keyof (
                          | Artist
                          | Album
                          | Track
                        )
                      ]
                    }
                  >
                    <li
                      className="list-group-item user-item d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target={`#${
                        item[
                          `${selectedCategory}_id` as keyof (
                            | Artist
                            | Album
                            | Track
                          )
                        ]
                      }`}
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

                    {/* modal of item information */}
                    <div
                      className="modal fade"
                      id={`${
                        item[
                          `${selectedCategory}_id` as keyof (
                            | Artist
                            | Album
                            | Track
                          )
                        ]
                      }`}
                      aria-labelledby={
                        item[
                          `${selectedCategory}_id_label` as keyof (
                            | Artist
                            | Album
                            | Track
                          )
                        ]
                      }
                      aria-hidden="true"
                    >
                      <div className="modal-dialog profile-modal-dialog">
                        <div className="modal-content profile-modal-content">
                          <div className="modal-header profile-modal-header">
                            <p
                              className="modal-title fs-5 profile-modal-title"
                              id="staticBackdropLabel"
                            >
                              Details
                            </p>
                            <div data-bs-theme="dark">
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                          </div>
                          <div className="modal-body details-modal-body">
                            <img
                              className="details-modal-image"
                              src={item.image_url || defaultImage}
                              alt={selectedCategory}
                            />
                            {/* display track modal details */}
                            {"track_id" in item ? (
                              <>
                                <div className="overflow-auto">
                                  <div className="details-container">
                                    <p className="details-name">
                                      {item[`track_name` as keyof Track]}
                                    </p>
                                    <h2>Artist</h2>
                                    <p className="details-text">
                                      {item[`artist_name` as keyof Track]}
                                    </p>
                                    <h2>Duration</h2>
                                    <p className="details-text">
                                      {item[`duration` as keyof Track]}
                                    </p>
                                    <h2>Release Date</h2>
                                    <p className="details-text">
                                      {
                                        item[
                                          `track_release_date` as keyof Track
                                        ]
                                      }
                                    </p>

                                    <h2>From</h2>
                                    <p className="details-text">
                                      {item[`album_name` as keyof Track]}
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : // display album item details
                            "album_id" in item ? (
                              <>
                                <div className="overflow-auto">
                                  <div className="details-container">
                                    <p className="details-name">
                                      {
                                        item[
                                          `${selectedCategory}_name` as keyof Album
                                        ]
                                      }
                                    </p>
                                    <h2>Release Date</h2>
                                    <p className="details-text">
                                      {
                                        item[
                                          `${selectedCategory}_release_date` as keyof Album
                                        ]
                                      }
                                    </p>
                                    <h2>Total tracks</h2>
                                    <p className="details-text">
                                      {item[`total_tracks` as keyof Album]}
                                    </p>
                                    <h2>Artist</h2>
                                    <p className="details-text">
                                      {item[`artist_name` as keyof Album]}
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : // display artist modal details
                            "artist_id" in item ? (
                              <>
                                <div className="overflow-auto">
                                  <div className="details-container">
                                    <p className="details-name">
                                      {
                                        item[
                                          `${selectedCategory}_name` as keyof Artist
                                        ]
                                      }
                                    </p>
                                    <h2>Genre</h2>
                                    <p className="details-text">
                                      {(
                                        item[
                                          `genres` as keyof Artist
                                        ] as string[]
                                      ).join(", ")}
                                    </p>
                                    <h2>Followers</h2>
                                    <p className="details-text">
                                      {item[
                                        "followers" as keyof Artist
                                      ].toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <p>Unknown item type</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* modal for editting items */}
          <div
            className="modal fade"
            id="editModal"
            tab-index="-1"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog edit-modal-dialog">
              <div className="modal-content edit-modal-content">
                <div className="modal-header edit-modal-header">
                  <p
                    className="modal-title fs-5 profile-modal-title"
                    id="editModalLabel"
                  >
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
                  {/* searchbar that gets refreshes display of user items when a new item is added */}
                  <Searchbar
                    triggerUpdate={() => setShouldFetchUserItems(true)}
                    editCategory={selectedCategory}
                    modalIsClosed={isModalClosed}
                  />
                  <div className="list-group user-items">
                    {/* display items based on category */}
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
                            <i
                              className="bi bi-x-circle"
                              onClick={() => {
                                deleteItem(item);
                              }}
                            ></i>
                          </div>
                        </li>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
