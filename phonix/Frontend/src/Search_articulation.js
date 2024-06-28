import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhonemeConverter } from "./PhonemeConvertor";

function SearchArticulation({ onWordClick }) {
  const [place, setPlace] = useState("NA");
  const [manner, setManner] = useState("NA");
  const [voice, setVoice] = useState("NA");
  const [height, setHeight] = useState("NA");
  const [back, setBack] = useState("NA");
  const [round, setRound] = useState("NA");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const poaOptions = [
    "NA",
    // "uvular",
    "palatal",
    // "velopharyngeal",
    "glottal",
    "dental",
    "velar",
    "labiodental",
    "labial-velar",
    // "retroflex",
    "dental;alveolar",
    // "bidental",
    "postalveolar",
    "bilabial",
    // "nasal",
    // "epiglottal",
    // "pharyngeal",
    // "simultaneous postalveolar and velar",
    // "palatoalveolar",
    // "(post)alveolar",
    // "labial-palatal",
    "alveolar",
    // "alveolo-palatal",
  ];
  const voaOptions = ["NA", "voiceless", "voiced"];
  const moaOptions = [
    "NA",
    // "tap",
    // "flap",
    // "lateral fricative",
    // "fricative;approximant",
    "approximant",
    // "nasal release",
    // "ejective",
    // "click",
    "plosive",
    // "trill",
    "nasal",
    "lateral approximant",
    // "implosive",
    // "lateral flap",
    // "fricative release",
    // "stop",
    // "lateral click",
    "affricate",
    "fricative",
    // "lateral affricate",
    // "release",
    // "percussive",
    // "lateral release",
  ];
  const backOptions = [
    "NA",
    "near-front",
    "near-back",
    "front",
    "back",
    // "central",
  ];
  const heightOptions = [
    "NA",
    // "mid",
    "near-open",
    // "close-mid",
    "open",
    "near-close",
    "open-mid",
    "close",
  ];
  const roundingOptions = [
    "NA",
    // "less rounded",
    "rounded",
    // "more rounded",
    "unrounded",
  ];

  const handleWordClick = (word) => {
    onWordClick(word);
    navigate("/SearchBar");
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/poa/?poa=${place}&moa=${manner}&voa=${voice}&height=${height}&back=${back}&round=${round}`
      );
      const data = await response.json();

      const result = data.map((item) => ({
        word: item.word,
        phonemes: item.phoneme.join(", "),
      }));

      setResults(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>
      Explore the intricate sounds of language with our powerful articulation search. Find all words that share the specific consonant or vowel sounds you're interested in, and refine your results by frequency, phoneme length, or alphabetical order – ascending or descending. Each result displays the word alongside its IPA and ARPABET representation, providing a complete picture of its pronunciation.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ marginRight: "20px" }}>
          <label>
            Place of Articulation:
            <select value={place} onChange={(e) => setPlace(e.target.value)}>
              {poaOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginRight: "20px" }}>
          <label>
            Manner of Articulation:
            <select value={manner} onChange={(e) => setManner(e.target.value)}>
              {moaOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Voice:
            <select value={voice} onChange={(e) => setVoice(e.target.value)}>
              {voaOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ marginRight: "20px" }}>
          <label>
            Height:
            <select value={height} onChange={(e) => setHeight(e.target.value)}>
              {heightOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginRight: "20px" }}>
          <label>
            Backness:
            <select value={back} onChange={(e) => setBack(e.target.value)}>
              {backOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Rounding:
            <select value={round} onChange={(e) => setRound(e.target.value)}>
              {roundingOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <button onClick={handleSearch}>Search</button>
      <div>
        <h3>Results:</h3>
        {results.length > 0 ? (
          <table className="result-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>IPA</th>
                <th>Phonemes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span
                      className="wordlink"
                      onClick={() => handleWordClick(item.word)}
                    >
                      {item.word}
                    </span>
                  </td>{" "}
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
          <p>No Results</p>
        )}
      </div>{" "}
    </div>
  );
}

export default SearchArticulation;
