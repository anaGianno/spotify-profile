import { useState } from "react";
import defaultImage from "../assets/defaultPicture.png";

const Searchbar = () => {
  let categories = ["track", "artist", "album"];
  const [selectedCategory, setselectedCategory] = useState("track");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [searchResults, setSearchResults] = useState<
    (Artist | Album | Track)[]
  >([]);

  const onSelectCategory = (category: string) => {
    setselectedCategory(category);
  };

  const onSearch = async () => {
    setIsDropdownOpen((prev) => !prev);

    console.log("Query:", query);
    console.log("Category:", selectedCategory);

    const searchResponse = await fetch(
      `http://localhost:3000/spotify/search?query=${encodeURIComponent(
        query
      )}&type=${selectedCategory}`,
      {
        method: "GET",
      }
    );

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

    if (selectedCategory === "artist") {
      searchData.forEach((artist: Artist) => {
        const artistId = artist.artistId;
        const artistName = artist.artistName || "Unknown Artist";
        const imageUrl =
          artist.imageUrl === "No Image Available" || !artist.imageUrl
            ? defaultImage
            : artist.imageUrl;

        console.log("Artist Details:");
        console.log("ID:", artistId);
        console.log("Name:", artistName);
        console.log("Image URL:", imageUrl);
        searchResult.push({
          artistId,
          artistName,
          imageUrl,
        });
      });
    } else if (selectedCategory === "album") {
      // interface Album {
      //   albumId: string;
      //   albumName: string;
      //   albumReleaseDate: string;
      //   totalTracks: string;
      //   imageUrl: string;
      //   artistName: string;
      // }
      searchData.forEach((album: Album) => {
        const albumId = album.albumId;
        const albumName = album.albumName || "Unknown album";
        const albumReleaseDate = album.albumReleaseDate;
        const totalTracks = album.totalTracks;
        const imageUrl = album.imageUrl || "No Image Available";
        const artistName = album.artistName;

        console.log("Album Details:");
        console.log("ID:", albumId);
        console.log("Name:", albumName);
        console.log("Release Date:", albumReleaseDate);
        console.log("Total tracks:", totalTracks);
        console.log("Image URL:", imageUrl);
        console.log("Artist Name:", artistName);

        searchResult.push({
          albumId,
          albumName,
          albumReleaseDate,
          totalTracks,
          imageUrl,
          artistName,
        });
      });
    } else if (selectedCategory === "track") {
      // interface Track {
      //   trackId: string;
      //   trackName: string;
      //   artistName: string;
      //   duration: string;
      //   imageUrl: string;
      // }
      searchData.forEach((track: Track) => {
        const trackId = track.trackId;
        const trackName = track.trackName || "Unknown track";
        const artistName = track.artistName;
        const duration = track.duration;
        const imageUrl = track.imageUrl || "No Image Available";

        console.log("Track Details:");
        console.log("ID:", trackId);
        console.log("Name:", trackName);
        console.log("Artist:", artistName);
        console.log("Duration:", duration);
        console.log("Image URL:", imageUrl);
        searchResult.push({
          trackId,
          trackName,
          artistName,
          duration,
          imageUrl,
        });
      });
    }
    setSearchResults(searchResult);
  };

  return (
    <nav
      className="navbar bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid d-flex justify-content-start">
        <div className="dropdown me-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ width: "100px" }}
          >
            {selectedCategory}
          </button>
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
                    onSelectCategory(category);
                  }}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="d-flex position-relative" role="search">
          <button
            className="btn btn-outline-success"
            type="button"
            onClick={onSearch}
            // data-bs-toggle="collapse"
            // data-bs-target="#collapseExample"
            aria-expanded={isDropdownOpen}
            aria-controls="collapseExample"
          >
            Search
          </button>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "436.3px",
            }}
          />
          <div
            className={`collapse ${isDropdownOpen ? "show" : ""}`}
            id="collapseExample"
            style={{
              position: "absolute",
              top: "100%",
              left: "73px",
              zIndex: 1000,
            }}
          >
            <div className="list-group">
              {searchResults.map((result) => {
                if ("artistId" in result) {
                  return (
                    <a
                      key={result.artistId}
                      href="#"
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      style={{
                        width: "436.3px",
                      }}
                    >
                      <img
                        src={result.imageUrl || defaultImage}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        className="badge"
                        style={{
                          paddingRight: "200px",
                        }}
                      >
                        {result.artistName}
                      </span>
                    </a>
                  );
                }
                // Check if the result is an Album
                if ("albumId" in result) {
                  return (
                    <a
                      key={result.albumId}
                      href="#"
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      style={{
                        width: "436.3px",
                      }}
                    >
                      <img
                        src={result.imageUrl || defaultImage}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        className="badge"
                        style={{
                          paddingRight: "200px",
                        }}
                      >
                        {result.albumName}
                      </span>
                    </a>
                  );
                }

                // Check if the result is a Track
                if ("trackId" in result) {
                  return (
                    <a
                      key={result.trackId}
                      href="#"
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      style={{
                        width: "436.3px",
                      }}
                    >
                      <img
                        src={result.imageUrl || defaultImage}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      <span
                        className="badge"
                        style={{
                          paddingRight: "200px",
                        }}
                      >
                        {result.trackName}
                      </span>
                    </a>
                  );
                }

                return null; // Return nothing if the result doesn't match any type
              })}
            </div>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Searchbar;
