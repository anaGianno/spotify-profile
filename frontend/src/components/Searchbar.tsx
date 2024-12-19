import { useState } from "react";

const Searchbar = () => {
  let categories = ["track", "artist", "album"];
  const [selectedCategory, setselectedCategory] = useState("track");
  const [query, setQuery] = useState("");

  const onSelectCategory = (category: string) => {
    setselectedCategory(category);
  };

  const onSearch = async () => {
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

        <form className="d-flex" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn btn-outline-success"
            type="submit"
            onClick={onSearch}
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Searchbar;
