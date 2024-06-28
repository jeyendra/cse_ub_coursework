import React, { useState, useEffect } from "react";
import "./ConsonantCluster.css";
import { useNavigate } from "react-router-dom";
import { PhonemeConverter } from "./PhonemeConvertor";

const consonants = [
  "B",
  "CH",
  "D",
  "DH",
  "F",
  "G",
  "HH",
  "JH",
  "K",
  "L",
  "M",
  "N",
  "NG",
  "P",
  "R",
  "S",
  "SH",
  "T",
  "TH",
  "V",
  "W",
  "Y",
  "Z",
  "ZH",
];

function ConsonantCluster({ onWordClick }) {
  const [selections, setSelections] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [selectedDropdowns, setSelectedDropdowns] = useState([]);
  const navigate = useNavigate();

  const handleSelectionClick = (type) => {
    setSelections([...selections, type]);
    setSelectedDropdowns([...selectedDropdowns, { type, selection: "" }]);
  };

  const handleWordClick = (word) => {
    onWordClick(word);
    navigate("/SearchBar");
  };

  const handleDropdownChange = (index, value) => {
    const updatedDropdowns = [...selectedDropdowns];
    updatedDropdowns[index].selection = value;
    setSelectedDropdowns(updatedDropdowns);
  };

  const handleSearch = async () => {
    try {
      const dropdownValues = selectedDropdowns
        .map((dropdown) => dropdown.selection)
        .join(",");
      const cleanedString = dropdownValues.replace(/,+/g, ",");

      const response = await fetch(
        `/api/words_consonant_cluster/?cluster=${cleanedString}`
      );

      if (response.ok) {
        const data = await response.json();

        const result = data.map((item) => ({
          word: item.word,
          phonemes: item.phoneme_str,
        }));

        setResultData(result);
      } else {
        console.error("Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleSearch(); 
  }, []); 
  useEffect(() => {
    handleSearch();}, [selectedDropdowns]);

  return (
    <div className="combined-container">
      <h2>Click on Consonants to select pattern</h2>
      <p>
        Click the button to add more consonants and select the phonemes and
        create your own unique consonant-consonant pattern, exploring the
        endless possibilities of sound combinations!
      </p>
      <div className="box-container">
        <div className="box">
          <button onClick={() => handleSelectionClick("c")}>
            Click here to add a Consonant
          </button>
        </div>
      </div>
      <div className="dropdown-container">
        {selectedDropdowns.map((selectedDropdown, index) => (
          <div className="dropdowns" key={index}>
            <label>Select Consonant</label>
            <select
              onChange={(e) => handleDropdownChange(index, e.target.value)}
            >
              <option value="">-- Select --</option>
              {consonants.map((consonant, index) => (
                <option key={index} value={consonant}>
                  {consonant}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="pattern-result">
        <h3>
          {" "}
          Consonant Cluster :{" "}
          {selectedDropdowns
            .map((dropdown) => dropdown.selection)
            .join(",")
            .replace(/,+/g, ",")}
        </h3>
        {/* <h3>Pattern To Search For: {selections.join('')}</h3> */}
      </div>
      {/* <button onClick={handleSearch}>Search</button> */}
      <div>
        <h3>Results:</h3>
        {resultData.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Phoneme</th>
                <th>IPA</th>
              </tr>
            </thead>
            <tbody>
              {resultData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span
                      className="wordlink"
                      onClick={() => handleWordClick(item.word)}
                    >
                      {item.word}
                    </span>
                  </td>
                  <td>{item.phonemes}</td>
                  <td>
                    <PhonemeConverter
                      phonemeString={item.phonemes}
                      indicesToHighlight={""}
                      elementsToHighlight={""}
                    />
                  </td>
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

export default ConsonantCluster;
