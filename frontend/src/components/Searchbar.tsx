import { useState, useEffect, useRef } from "react";
import defaultImage from "../assets/defaultPicture.png";
import { useNavigate } from "react-router-dom";

interface SearchbarProps {
  // pass in which page is using searchbar
  page: string;
}

const Searchbar = ({ page }: SearchbarProps) => {
  const navigate = useNavigate();

  // set dropdown default to closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // set deafult search query as empty
  const [userSearchQuery, setUserSearchQuery] = useState("");
  // set default search results as empty
  const [searchResults, setSearchResults] = useState<User[]>([]);
  // initialize reference for dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // handle dropdown on clicks outside the dropdown reference
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // close the dropdown if the clicked element is not inside the dropdown reference
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // add listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // clean up listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // query for getting users in database
  const onSearch = async (onSearchQuery: string) => {
    // clear previous search results
    setSearchResults([]);

    // return early on an empty query
    if (onSearchQuery === "") {
      return;
    }

    console.log("Query for users:", onSearchQuery);

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

    // open dropdown on success
    setIsDropdownOpen(true);

    // log user search data
    const searchData = await searchResponse.json();
    console.log("User search Data: ", searchData);

    // save search data to useState
    setSearchResults(searchData);
  };

  // navigate to chosen profile
  const profile = (user_id: string) => {
    navigate(`/profile/${user_id}`);
  };

  return (
    <>
      <div
        className={`${
          page === "home"
            ? "home-searches-container"
            : "header-searches-container"
        }`}
        ref={dropdownRef}
        data-bs-theme="dark"
      >
        {/* searchbar */}
        <div className="position-relative">
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
          <input
            className={`form-control ${
              page === "home" ? "home-searchbar" : "profile-searchbar"
            }`}
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
            page === "home" ? "home-collapse-position" : "collapse-position"
          } ${isDropdownOpen ? "show" : ""}`}
          id="collapseId"
          onTransitionEnd={() => {
            // sync state with bootstrap's collapse behavior
            const collapseRef = document.getElementById("collapseId");
            setIsDropdownOpen(collapseRef?.classList.contains("show") || false);
          }}
        >
          <div className="list-group list-group-search">
            {/* display all results */}
            {searchResults.map((result) => {
              return (
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
    </>
  );
};

export default Searchbar;
