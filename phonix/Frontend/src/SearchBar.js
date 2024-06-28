import React, { useEffect, useState } from "react";
import "./SearchBar.css";

function SearchBar({ setWordDetails, initialSearchTerm }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  useEffect(() => {
    if (initialSearchTerm) {
      fetchData(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchData(searchTerm);
    }
  };

  const fetchData = async (word) => {
    try {
      const response = await fetch(`/api/word/${word.toLowerCase()}`, {
        mode: "no-cors",
      });
      const text = await response.text();
      if (text && text.startsWith("{")) {
        const data = JSON.parse(text);
        setWordDetails(data);
      } else {
        console.error("Received unexpected response from the server:", text);
      }
    } catch (error) {
      console.error("Error fetching the word details:", error);
    }
  };

  return (
    <div>
      <h1 className="heading">Search for a word!</h1>
      <p>You can search for any word and discover its fascinating details, including its articulation, what this word is or which category it belongs to and its sources.</p>
      <div className="searchbar-container">
        <input
          className="searchbar-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a word..."
        />
        <button
          className="searchbar-button"
          onClick={() => fetchData(searchTerm)}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
