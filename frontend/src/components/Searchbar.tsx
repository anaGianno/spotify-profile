import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultImage from "../assets/defaultPicture.png";

interface SearchbarProps {
  triggerUpdate: () => void;
  // pass in category from profile
  editCategory: "artist" | "album" | "track";
  // pass in the modal bool from profile
  modalIsClosed: true | false;
}

const Searchbar = ({
  triggerUpdate,
  editCategory,
  modalIsClosed,
}: SearchbarProps) => {
  // set dropdown default to closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // set deafult search query as empty
  const [query, setQuery] = useState("");

  // set default search results as empty
  const [searchResults, setSearchResults] = useState<
    (Artist | Album | Track)[]
  >([]);

  // use default parameter:
  const onSearch = async (onSearchQuery = query) => {
    // clear previous search results
    setSearchResults([]);

    // open dropdown when search button is clicked
    setIsDropdownOpen(true);
    console.log("Query:", onSearchQuery);
    console.log("Category:", editCategory);

    // return early on an empty query
    if (onSearchQuery === "") {
      console.log("Empty query, returning");
      return;
    }

    // fetch spotify response using query and editCategory
    const searchResponse = await fetch(
      `http://localhost:3000/spotify/search?query=${encodeURIComponent(
        onSearchQuery
      )}&type=${editCategory}`,
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

  useEffect(() => {
    setSearchResults([]);
    setQuery("");
  }, [modalIsClosed]);

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
    const keyName = `${editCategory}_user_id`;

    // attach the dynamic key to the selected item
    const itemWithProfile = { ...item, [keyName]: profile_id };

    console.log("Item with profile: ", itemWithProfile);

    try {
      // add item to database
      const response = await fetch(
        `http://localhost:3000/${encodeURIComponent(editCategory)}`,
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
        {/* track the dropdown*/}
        <div className="searches-container" ref={dropdownRef}>
          {/* searchbar */}
          <div className="dropdown-wrapper">
            {/* <input
              className="form-control me-2"
              type="search"
              placeholder={`&#xF52A; Search for ${editCategory}`}
              aria-label="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // pass query directly to onSearch to avoid asynchronous state update
                onSearch(e.target.value);
              }}
              onFocus={() => {
                if (searchResults.length > 0) {
                  // only display dropdown if there are results
                  setIsDropdownOpen(true);
                }
              }}
            /> */}
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2"></i>
              <input
                className="form-control"
                style={{ paddingLeft: "30px" }}
                type="search"
                placeholder={`Search for ${editCategory}`}
                aria-label="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // pass query directly to onSearch to avoid asynchronous state update
                  onSearch(e.target.value);
                }}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    // only display dropdown if there are results
                    setIsDropdownOpen(true);
                  }
                }}
              />
            </div>

            {/* results collapse */}
            <div
              // display results based on state
              className={`collapse collapse-position ${
                isDropdownOpen ? "show" : ""
              }`}
              id="collapseId"
              onTransitionEnd={() => {
                // sync state with bootstrap's collapse behavior
                const element = document.getElementById("collapseId");
                setIsDropdownOpen(element?.classList.contains("show") || false);
              }}
            >
              <div className="list-group list-group-search">
                {/* display all results */}
                {searchResults.map((result) => {
                  return (
                    // bracket notation for dynamic access
                    <li
                      key={
                        result[
                          `${editCategory}_id` as keyof (Artist | Album | Track)
                        ]
                      }
                      className="list-group-item d-flex align-items-center search-item"
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
                              `${editCategory}_name` as keyof (
                                | Artist
                                | Album
                                | Track
                              )
                            ]
                          }
                        </span>
                      </div>
                      <i
                        className="bi bi-plus-circle"
                        onClick={(e) => {
                          e.preventDefault();
                          selectItem(result);
                        }}
                      />
                    </li>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Searchbar;
