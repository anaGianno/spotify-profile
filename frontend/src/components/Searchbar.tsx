import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultImage from "../assets/defaultPicture.png";

interface SearchbarProps {
  triggerUpdate: () => void;
}

const Searchbar = ({ triggerUpdate }: SearchbarProps) => {
  let categories = ["track", "artist", "album"];
  // set default category to track
  const [selectedCategory, setselectedCategory] = useState("track");
  // set dropdown default to closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // set deafult search query as empty
  const [query, setQuery] = useState("");

  // set default search results as empty
  const [searchResults, setSearchResults] = useState<
    (Artist | Album | Track)[]
  >([]);

  const onSearch = async () => {
    // open dropdown when search button is clicked
    setIsDropdownOpen(true);
    console.log("Query:", query);
    console.log("Category:", selectedCategory);

    // fetch spotify response using query and category
    const searchResponse = await fetch(
      `http://localhost:3000/spotify/search?query=${encodeURIComponent(
        query
      )}&type=${selectedCategory}`,
      {
        method: "GET",
      }
    );

    // log error on failed fetch
    if (!searchResponse.ok) {
      const status = searchResponse.status;
      const statusText = searchResponse.statusText;
      const errorDetails = await searchResponse.text();

      console.error("Error searching spotify:", {
        status,
        statusText,
        details: errorDetails,
      });
    }

    // log search response and data
    console.log("Search response: ", searchResponse);
    const searchData = await searchResponse.json();
    console.log("Search Data: ", searchData);

    let searchResult: (Artist | Album | Track)[] = [];

    // push artist data to search result array
    if (selectedCategory === "artist") {
      searchData.forEach((artist: Artist) => {
        const artist_id = artist.artist_id;
        const artist_name = artist.artist_name || "Unknown Artist";
        const image_url =
          artist.image_url === "No Image Available" || !artist.image_url
            ? defaultImage
            : artist.image_url;

        console.log("Artist Details:");
        console.log("ID:", artist_id);
        console.log("Name:", artist_name);
        console.log("Image URL:", image_url);
        searchResult.push({
          artist_id,
          artist_name,
          image_url,
        });
      });
      // push album data to search result array
    } else if (selectedCategory === "album") {
      searchData.forEach((album: Album) => {
        const album_id = album.album_id;
        const album_name = album.album_name || "Unknown album";
        const album_release_date = album.album_release_date;
        const total_tracks = album.total_tracks;
        const image_url = album.image_url || "No Image Available";
        const artist_name = album.artist_name;

        console.log("Album Details:");
        console.log("ID:", album_id);
        console.log("Name:", album_name);
        console.log("Release Date:", album_release_date);
        console.log("Total tracks:", total_tracks);
        console.log("Image URL:", image_url);
        console.log("Artist Name:", artist_name);

        searchResult.push({
          album_id,
          album_name,
          album_release_date,
          total_tracks,
          image_url,
          artist_name,
        });
      });
      // push track data to search result array
    } else if (selectedCategory === "track") {
      searchData.forEach((track: Track) => {
        const track_id = track.track_id;
        const track_name = track.track_name || "Unknown track";
        const artist_name = track.artist_name;
        const duration = track.duration;
        const image_url = track.image_url || "No Image Available";

        console.log("Track Details:");
        console.log("ID:", track_id);
        console.log("Name:", track_name);
        console.log("Artist:", artist_name);
        console.log("Duration:", duration);
        console.log("Image URL:", image_url);
        searchResult.push({
          track_id,
          track_name,
          artist_name,
          duration,
          image_url,
        });
      });
    }
    // set search result to array with pushed data
    setSearchResults(searchResult);
  };

  // track the dropdown and the search button
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // close dropdown if clicked element is not a child of the dropdown
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // remove listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize profile ID from URL
  const params = useParams<{ profileId: string }>();
  const profile_id = params.profileId;

  const selectItem = async (item: Artist | Album | Track, type: string) => {
    console.log("Selected Item: ", item);
    if (!profile_id) {
      console.error("Profile ID is undefined");
      return;
    }

    // Dynamically set the key name based on the type
    const keyName = `${type}_user_id`; // This will be "artist_id", "album_id", or "track_id"

    // Attach the dynamic key to the selected item
    const itemWithProfile = { ...item, [keyName]: profile_id };

    console.log("Item with profile: ", itemWithProfile);

    try {
      // Add item to database
      const response = await fetch(
        `http://localhost:3000/${encodeURIComponent(type)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(itemWithProfile),
        }
      );

      if (!response.ok) {
        console.error(`Failed to add item: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Server response: ", data);
      triggerUpdate();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  return (
    <nav className="navbar searchbar" data-bs-theme="dark">
      <div className="container-fluid d-flex justify-content-start">
        <div className="dropdown me-2">
          {/* category button */}
          <button
            className="btn btn-success dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ width: "100px" }}
          >
            {selectedCategory}
          </button>
          {/* category dropdown */}
          <ul className="dropdown-menu">
            {categories.map((category) => (
              <li key={category}>
                <a
                  className={
                    selectedCategory === category
                      ? "dropdown-item active"
                      : "dropdown-item"
                  }
                  href="#"
                  onClick={() => {
                    setselectedCategory(category);
                  }}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* track the dropdown and the search button */}
        <div ref={dropdownRef}>
          <form
            className="d-flex position-relative"
            role="search"
            onSubmit={(e) => {
              // prevent page refresh
              e.preventDefault();
              onSearch();
            }}
          >
            {/* search button */}
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={onSearch}
              data-bs-target="#collapseExample"
              aria-expanded={isDropdownOpen}
              aria-controls="collapseExample"
            >
              Search
            </button>
            {/* searchbar */}
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  // only display dropdown if there are results
                  setIsDropdownOpen(true);
                }
              }}
              style={{
                width: "436.3px",
                marginLeft: "8px",
              }}
            />
            {/* results collapse */}
            <div
              // display results based on state
              className={`collapse ${isDropdownOpen ? "show" : ""}`}
              id="collapseExample"
              style={{
                position: "absolute",
                top: "100%",
                left: "81px",
                zIndex: 1000,
              }}
              onTransitionEnd={() => {
                // sync state with bootstrap's collapse behavior
                const element = document.getElementById("collapseExample");
                setIsDropdownOpen(element?.classList.contains("show") || false);
              }}
            >
              <div className="list-group">
                {/* display all results */}
                {searchResults.map((result) => {
                  if ("artist_id" in result) {
                    return (
                      <li
                        key={result.artist_id}
                        className="list-group-item d-flex align-items-center"
                        style={{
                          width: "436.3px",
                        }}
                      >
                        <div
                          className="d-flex align-items-center flex-grow-1"
                          style={{ overflow: "hidden" }}
                        >
                          <img
                            className="image-item"
                            src={result.image_url || defaultImage}
                            alt="Artist"
                          />
                          <span
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              flexGrow: 1,
                            }}
                          >
                            {result.artist_name}
                          </span>
                        </div>
                        <a
                          className="badge text-bg-success ms-auto"
                          href="#"
                          style={{
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            selectItem(result, "artist");
                          }}
                        >
                          Add to profile
                        </a>
                      </li>
                    );
                  }

                  if ("album_id" in result) {
                    return (
                      <li
                        key={result.album_id}
                        className="list-group-item  d-flex align-items-center"
                        style={{
                          width: "436.3px",
                        }}
                      >
                        <div
                          className="d-flex align-items-center flex-grow-1"
                          style={{ overflow: "hidden" }}
                        >
                          <img
                            className="image-item"
                            src={result.image_url || defaultImage}
                            alt="Album"
                          />
                          <span
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              flexGrow: 1,
                            }}
                          >
                            {result.album_name}
                          </span>
                        </div>
                        <a
                          className="badge text-bg-success ms-auto"
                          href="#"
                          style={{
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            selectItem(result, "album");
                          }}
                        >
                          Add to profile
                        </a>
                      </li>
                    );
                  }

                  if ("track_id" in result) {
                    return (
                      <li
                        key={result.track_id}
                        className="list-group-item d-flex align-items-center"
                        style={{
                          width: "436.3px",
                        }}
                      >
                        <div
                          className="d-flex align-items-center flex-grow-1"
                          style={{ overflow: "hidden" }}
                        >
                          <img
                            className="image-item"
                            src={result.image_url || defaultImage}
                            alt="Track"
                          />
                          <span
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              flexGrow: 1,
                            }}
                          >
                            {result.track_name}
                          </span>
                        </div>
                        <a
                          className="badge text-bg-success ms-auto"
                          href="#"
                          style={{
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            selectItem(result, "track");
                          }}
                        >
                          Add to profile
                        </a>
                      </li>
                    );
                  }

                  // return nothing if the result doesn't match any type
                  return null;
                })}
              </div>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Searchbar;
