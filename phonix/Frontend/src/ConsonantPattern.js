import React, { useState, useEffect } from 'react';
import './ConsonantPattern.css';
import { PhonemeConverter } from "./PhonemeConvertor";
import { useNavigate } from "react-router-dom";

function ConsonantPattern({ onWordClick }) {
  const [selections, setSelections] = useState([]);
  const [sortParameter, setSortParameter] = useState('freq');
  const [sortOrder, setSortOrder] = useState('desc');
  const [resultData, setResultData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pattern = selections.join("");
        const response = await fetch(`/api/words_by_pattern/?pattern=${pattern}&sort_parameter=${sortParameter}&sort_order=${sortOrder}`);
        const data = await response.json();
        console.log(data);

        const result = data.map(item => ({
          word: item.word,
          phonemes: item.phoneme.join(', '), 
        }));

        setResultData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selections, sortParameter, sortOrder]);

  const handleSelectionClick = (type) => {
    setSelections([...selections, type]);
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

  return (
    <div>
      <h2>Click on Consonants and Vowels to select pattern</h2>
      <p>Click on consonants and vowels to build a custom pattern, exploring the fascinating world of sound combinations!</p>
      <div className="box-container">
        <div className="box">
          <button onClick={() => handleSelectionClick("c")}>Consonant</button>
        </div>
        <div className="box">
          <button onClick={() => handleSelectionClick("v")}>Vowel</button>
        </div>
      </div>
      <div className="pattern-result">
        <h2>Pattern To Search For: {selections.join("")}</h2>
      </div>
      <div className="sort-section">
        <div>
          <label>Sort By:</label>
          <select value={sortParameter} onChange={handleSortParameterChange}>
            <option value="freq">Frequency</option>
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
      {/* <button onClick={handleSearch}>Search</button> */}
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
                      indicesToHighlight={''}
                      elementsToHighlight={''}
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

export default ConsonantPattern;
