import { useState, useEffect, useRef } from "react";
import defaultImage from "../assets/defaultPicture.png";
import { useNavigate } from "react-router-dom";

interface SearchbarProps {
  homepage?: boolean;
}

const Searchbar = ({ homepage }: SearchbarProps) => {
  const navigate = useNavigate();
  // set dropdown default to closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // set deafult search query as empty
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // set default search results as empty
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // get user and profile data on initial load
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

  // use default parameter:
  const onSearch = async (onSearchQuery = userSearchQuery) => {
    // clear previous search results
    setSearchResults([]);

    // open dropdown when search button is clicked
    setIsDropdownOpen(true);
    console.log("Query:", onSearchQuery);

    // return early on an empty query
    if (onSearchQuery === "") {
      console.log("Empty query, returning");
      return;
    }

    // fetch spotify response using query and editCategory
    const searchResponse = await fetch(
      `http://localhost:3000/user/search/${onSearchQuery}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    // log error on failed fetch
    if (!searchResponse.ok) {
      const status = searchResponse.status;
      const statusText = searchResponse.statusText;
      const errorDetails = await searchResponse.text();

      console.error("Error searching for user:", {
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

  const profile = (user_id: string) => {
    console.log("ABCD");
    navigate(`/profile/${user_id}`);
  };

  return (
    <>
      <div
        className={`${
          homepage ? "home-searches-container" : "searches-container"
        }`}
        ref={dropdownRef}
        data-bs-theme="dark"
      >
        {/* searchbar */}
        <div className="dropdown-wrapper">
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2"></i>
            <input
              className={`form-control ${
                homepage ? "home-searchbar" : "profile-searchbar"
              }`}
              style={{ paddingLeft: "30px" }}
              type="search"
              placeholder={`Search for user`}
              aria-label="Search"
              value={userSearchQuery}
              onChange={(e) => {
                setUserSearchQuery(e.target.value);
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
            className={`collapse ${
              homepage ? "home-collapse-position" : "collapse-position"
            } ${isDropdownOpen ? "show" : ""}`}
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
                    key={result.user_id}
                    className="list-group-item d-flex align-items-center search-item"
                    onClick={() => profile(result.user_id)}
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
                      <span className="item-text">{result.user_name}</span>
                    </div>

                    <div id="liveAlertPlaceholder"></div>
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Searchbar;
