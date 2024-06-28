import React, { useState } from "react";
import "./CategorySearch.css";
import { PhonemeConverter } from "./PhonemeConvertor";
import { useNavigate } from "react-router-dom";

function CategorySearch({ onWordClick }) {
  const [category, setCategory] = useState("");
  const [sortParameter, setSortParameter] = useState("freq");
  const [sortOrder, setSortOrder] = useState("desc");
  const [resultData, setResultData] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setCategory(event.target.value);
  };

  const handleWordClick = (word) => {
    onWordClick(word);
    navigate("/SearchBar");
  };

  const handleSortParameterChange = (event) => {
    setSortParameter(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `api/category/?category=${category}&sort_parameter=${sortParameter}&sort_order=${sortOrder}`
      );
      const data = await response.json();

      const result = data.map((item) => ({
        word: item.word,
        phonemes: item.phoneme.join(", "), // Join phonemes into a string
      }));

      setResultData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <p>
        Explore the depths of language by searching for categories and
        discovering all related words within them. You can even refine your
        results by sorting words based on their frequency, phonetic length, or
        alphabetical order, ascending or descending. The results will unveil a
        comprehensive list of words with their corresponding IPA and Arpabet
        representations of the Phonemes, empowering your linguistic exploration.
      </p>
      <label>
        Category:
        <input type="text" value={category} onChange={handleInputChange} />
      </label>

      <div className="sort-section">
        <div>
          <label>Sort By:</label>
          <select value={sortParameter} onChange={handleSortParameterChange}>
            <option value="freq">Frequency</option>
            <option value="phoneme_length">Phoneme Length</option>
            <option value="word">Alphabetical order</option>
          </select>
        </div>

        <div>
          <label>Sort Order:</label>
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <button onClick={handleSearch}>Search</button>

      <div>
        <h3>Results:</h3>
        {resultData.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>IPA</th>
                <th>Phonemes</th>
              </tr>
            </thead>
            <tbody>
              {resultData.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.word}</td> */}
                  <td>
                    <span
                      className="wordlink"
                      onClick={() => handleWordClick(item.word)}
                    >
                      {item.word}
                    </span>
                  </td>
                  <td>
                    <PhonemeConverter
                      phonemeString={item.phonemes}
                      indicesToHighlight={""}
                      elementsToHighlight={""}
                    />
                  </td>
                  <td>{item.phonemes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default CategorySearch;
