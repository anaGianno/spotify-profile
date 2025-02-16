import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultImage from "../assets/defaultPicture.png";

interface SearchbarProps {
  // pass in update function
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

    // return early on an empty query
    if (onSearchQuery === "") {
      return;
    }
    console.log("Query for edit:", onSearchQuery);

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

    // open dropdown when search button is clicked
    setIsDropdownOpen(true);

    // log search data
    const searchData = await searchResponse.json();
    console.log("Edit search Data: ", searchData);

    // save search data to useState
    setSearchResults(searchData);
  };

  // track the dropdown and the search button
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // close dropdown if clicked element is not a child of the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // add a listener for mouse clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // remove listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // reset search results/query when modal closes
  useEffect(() => {
    setSearchResults([]);
    setQuery("");
  }, [modalIsClosed]);

  // initialize profile ID from URL
  const params = useParams<{ profileId: string }>();
  const profile_id = params.profileId;

  // add selected item to database
  const addItem = async (item: Artist | Album | Track) => {
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

      const data = await response.json();

      if (!response.ok) {
        console.error(`Failed to add item: ${response.statusText}`);
        // display specific error message if it's related to the limit
        if (data.error === "Item limit reached (10 maximum).") {
          alert("You can't add more than 10 items!");
        } else {
          console.error(`Failed to add item: ${data.error}`);
          alert("An error occurred while adding the item.");
        }
        return;
      }

      console.log("Server response: ", data);
      // trigger update passed in from profile to get update profile data
      triggerUpdate();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  return (
    <nav className="navbar edit-navbar" data-bs-theme="dark">
      <div className="container-fluid d-flex justify-content-start">
        {/* track the dropdown for click*/}
        <div className="edit-searches-container" ref={dropdownRef}>
          {/* searchbar */}
          <div className="dropdown-wrapper">
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"></i>
              <input
                className="form-control edit-searchbar"
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

            {/* search results collapse */}
            <div
              // display results based on useState
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
                    <li
                      key={
                        result[
                          `${editCategory}_id` as keyof (Artist | Album | Track)
                        ]
                      }
                      className="list-group-item d-flex align-items-center edit-search-item"
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
                      <a
                        className="bi bi-plus-circle"
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(result);
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
