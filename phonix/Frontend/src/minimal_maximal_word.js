import React, { useState } from "react";
import "./minimal.css";
import { useNavigate } from "react-router-dom";
import { PhonemeHighlighter } from "./PhonemeHighlighter";

function MinimalPairWord({ onWordClick }) {
  const [word, setWord] = useState("");
  const [minimalPairs, setMinimalPairs] = useState([]);
  const [maximalPairs, setMaximalPairs] = useState([]);
  const navigate = useNavigate();
  const handleWordClick = (word) => {
    onWordClick(word);
    navigate("/SearchBar");
  };

  const fetchMinimalPairs = async () => {
    if (!word) return; // Do nothing if word is empty

    try {
      const response = await fetch(`/api/minimal_word/?word=${word}`);
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        const minimalPairsData = data.filter((item) => item.type === "minimal");
        const maximalPairsData = data.filter((item) => item.type === "maximal");
        setMinimalPairs(minimalPairsData);
        setMaximalPairs(maximalPairsData);
      } else {
        setMinimalPairs([]);
        setMaximalPairs([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMinimalPairs([]);
      setMaximalPairs([]);
    }
  };

  return (
    <div className="minimal-pair-container">
      <p>
        Enter a word, and discover its minimal and maximal pairs, unveiling a
        network of words linked by subtle phonetic changes.
      </p>

      <h1>Minimal Pair And Maximal Pair for Word</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button className="button-cat" onClick={fetchMinimalPairs}>
          Search
        </button>
      </div>
      <div className="result-container">
        <div className="pairs-tables">
          <div className="pairs-table">
            <h2>Matching Minimal Pairs:</h2>
            <table className="pairs-table">
              <thead>
                <tr className="table-head">
                  <th>Minimal Pairs</th>
                  <th>Phonemes</th>
                </tr>
              </thead>
              <tbody>
                {minimalPairs.map((pair, index) => (
                  <tr key={index}>
                    <td>
                      <span
                        className="wordlink"
                        onClick={() => handleWordClick(pair.word)}
                      >
                        {pair.word}
                      </span>
                    </td>
                    <td>
                      <PhonemeHighlighter
                        phonemeString={pair.phoneme.join(",")}
                        elementsToHighlight={""}
                        indicesToHighlight={[pair.diffIndex]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pairs-table">
            <h2>Matching Maximal Pairs:</h2>
            <table className="pairs-table">
              <thead>
                <tr className="table-head">
                  <th>Maximal Pairs</th>
                  <th>Phonemes</th>
                </tr>
              </thead>
              <tbody>
                {maximalPairs.map((pair, index) => (
                  <tr key={index}>
                    <td>
                      <span
                        className="wordlink"
                        onClick={() => handleWordClick(pair.word)}
                      >
                        {pair.word}
                      </span>
                    </td>
                    <td>
                      <PhonemeHighlighter
                        phonemeString={pair.phoneme.join(",")}
                        elementsToHighlight={""}
                        indicesToHighlight={[pair.diffIndex]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimalPairWord;
