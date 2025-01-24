import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultImage from "../assets/defaultPicture.png";

interface SearchbarProps {
  triggerUpdate: () => void;
}

const Searchbar = ({ triggerUpdate }: SearchbarProps) => {
  let categories = ["track", "artist", "album"];
  // set default category to track
  const [selectedCategory, setSelectedCategory] = useState("track");
  const [searchCategory, setSearchCategory] = useState("track");
  // set dropdown default to closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // set deafult search query as empty
  const [query, setQuery] = useState("");

  // set default search results as empty
  const [searchResults, setSearchResults] = useState<
    (Artist | Album | Track)[]
  >([]);

  const onSearch = async () => {
    // clear previous search results
    setSearchResults([]);

    // open dropdown when search button is clicked
    setIsDropdownOpen(true);
    console.log("Query:", query);
    console.log("Category:", selectedCategory);

    // fetch spotify response using query and selectedCategory
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

    setSearchResults(searchData);
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

  // initialize profile ID from URL
  const params = useParams<{ profileId: string }>();
  const profile_id = params.profileId;

  const selectItem = async (item: Artist | Album | Track) => {
    console.log("Selected Item: ", item);
    if (!profile_id) {
      console.error("Profile ID is undefined");
      return;
    }

    // dynamically set the key name based on the type
    const keyName = `${selectedCategory}_user_id`;

    // attach the dynamic key to the selected item
    const itemWithProfile = { ...item, [keyName]: profile_id };

    console.log("Item with profile: ", itemWithProfile);

    try {
      // add item to database
      const response = await fetch(
        `http://localhost:3000/${encodeURIComponent(selectedCategory)}`,
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
                    setSelectedCategory(category);
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
              // lock in the search category
              setSearchCategory(selectedCategory);
              onSearch();
            }}
          >
            {/* search button */}
            <button
              className="btn btn-outline-success"
              type="button"
              data-bs-target="#collapseExample"
              aria-expanded={isDropdownOpen}
              aria-controls="collapseExample"
              onClick={() => {
                // lock in the search category
                setSearchCategory(selectedCategory);
                onSearch();
              }}
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
              className={`collapse collapse-position ${
                isDropdownOpen ? "show" : ""
              }`}
              id="collapseExample"
              onTransitionEnd={() => {
                // sync state with bootstrap's collapse behavior
                const element = document.getElementById("collapseExample");
                setIsDropdownOpen(element?.classList.contains("show") || false);
              }}
            >
              <div className="list-group">
                {/* display all results */}
                {searchResults.map((result) => {
                  return (
                    // bracket notation for dynamic access
                    <li
                      key={
                        result[
                          `${searchCategory}_id` as keyof (
                            | Artist
                            | Album
                            | Track
                          )
                        ]
                      }
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
                          className="item-image"
                          src={
                            result.image_url == "No Image Available"
                              ? defaultImage
                              : result.image_url
                          }
                          alt="Artist"
                        />
                        <span className="item-text">
                          {
                            result[
                              `${searchCategory}_name` as keyof (
                                | Artist
                                | Album
                                | Track
                              )
                            ]
                          }
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
                          selectItem(result);
                        }}
                      >
                        Add to profile
                      </a>
                    </li>
                  );
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
