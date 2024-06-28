import React, { useState, useEffect } from "react";
import "./PhonemeSelector.css";
import { PhonemeConverter } from "./PhonemeConvertor";
import { PhonemeHighlighter } from "./PhonemeHighlighter";
import { useNavigate } from "react-router-dom";

function IncludeExclude({ onWordClick, selectedWord }) {
  const [selectedPhonemes, setSelectedPhonemes] = useState([]);
  const [unselectedPhonemes, setUnselectedPhonemes] = useState([]);
  const [matchingWords, setMatchingWords] = useState([]);
  const [sortParameter, setSortParameter] = useState("freq");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleWordClick = (word) => {
    onWordClick(word);
    navigate("/SearchBar");
  };

  const vowelSounds = [
    "AA",
    "AE",
    "AH",
    "AO",
    "AW",
    "AY",
    "EH",
    "ER",
    "EY",
    "IH",
    "IY",
    "OW",
    "OY",
    "UH",
    "UW",
  ];
  const consonantSounds = [
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

  const phonemeToIPAMap = {
    AA: "ɑ",
    AE: "æ",
    AH: "ʌ",
    AO: "ɔ",
    AW: "aʊ",
    AY: "aɪ",
    EH: "ɛ",
    ER: "ɜːr",
    EY: "eɪ",
    IH: "ɪ",
    IY: "i",
    OW: "oʊ",
    OY: "ɔɪ",
    UH: "ʊ",
    UW: "u",
    B: "b",
    CH: "tʃ",
    D: "d",
    DH: "ð",
    F: "f",
    G: "ɡ",
    HH: "h",
    JH: "dʒ",
    K: "k",
    L: "l",
    M: "m",
    N: "n",
    NG: "ŋ",
    P: "p",
    R: "r",
    S: "s",
    SH: "ʃ",
    T: "t",
    TH: "θ",
    V: "v",
    W: "w",
    Y: "j",
    Z: "z",
    ZH: "ʒ",
  };

  const apiUrl = `/api/phoneme/?include=${selectedPhonemes.join(
    ","
  )}&exclude=${unselectedPhonemes.join(
    ","
  )}&sort_parameter=${sortParameter}&sort_order=${sortOrder}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setMatchingWords(data);
        } else {
          console.error("API request failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [apiUrl]);

  const handlePhonemeClick = (phoneme) => {
    setSelectedPhonemes((prevSelected) =>
      prevSelected.includes(phoneme)
        ? prevSelected.filter((item) => item !== phoneme)
        : [...prevSelected, phoneme]
    );
  };

  const handlePhonemeunClick = (phoneme) => {
    setUnselectedPhonemes((prevUnselected) =>
      prevUnselected.includes(phoneme)
        ? prevUnselected.filter((item) => item !== phoneme)
        : [...prevUnselected, phoneme]
    );
  };

  const handleSortParameterChange = (event) => {
    setSortParameter(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div>
      <p>
        Take control of your word search by selecting specific phonemes shown
        below to include or exclude in the words. Uncover words that share a
        desired sound while filtering out unwanted ones. Refine your results
        further by sorting by frequency, phoneme length, or alphabetically, in
        either ascending or descending order.
      </p>
      <div className="horizontal-layout">
        <div className="tile">
          <h1>Include Phonemes</h1>
          <div className="vowel">
            <h2>Vowel Phonemes</h2>
            {vowelSounds.map((phoneme) => (
              <button
                key={phoneme}
                className={selectedPhonemes.includes(phoneme) ? "selected" : ""}
                onClick={() => handlePhonemeClick(phoneme)}
              >
                {phoneme} /{phonemeToIPAMap[phoneme] || "IPA"}/
              </button>
            ))}
          </div>
          <div className="consonant">
            <h2>Consonant Phonemes</h2>
            {consonantSounds.map((phoneme) => (
              <button
                key={phoneme}
                className={selectedPhonemes.includes(phoneme) ? "selected" : ""}
                onClick={() => handlePhonemeClick(phoneme)}
              >
                {phoneme} /{phonemeToIPAMap[phoneme] || "IPA"}/
              </button>
            ))}
          </div>
        </div>

        <div className="tile">
          <h1>Exclude Phonemes</h1>
          <div className="vowel">
            <h2>Vowel Phonemes</h2>
            {vowelSounds.map((phoneme) => (
              <button
                key={phoneme}
                className={`exclude-button ${
                  unselectedPhonemes.includes(phoneme)
                    ? "selected1"
                    : "unselected1"
                }`}
                onClick={() => handlePhonemeunClick(phoneme)}
              >
                {phoneme} /{phonemeToIPAMap[phoneme] || "IPA"}/
              </button>
            ))}
          </div>
          <div className="consonant">
            <h2>Consonant Phonemes</h2>
            {consonantSounds.map((phoneme) => (
              <button
                key={phoneme}
                className={`exclude-button ${
                  unselectedPhonemes.includes(phoneme)
                    ? "selected1"
                    : "unselected1"
                }`}
                onClick={() => handlePhonemeunClick(phoneme)}
              >
                {phoneme} /{phonemeToIPAMap[phoneme] || "IPA"}/
              </button>
            ))}
          </div>
        </div>

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
      </div>
      {/* <button>Search</button> */}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr className="table-head">
                <th>Word</th>
                <th>IPA</th>
                {/* <th></th> */}
                <th>Phonemes</th>
                {/* <th>Frequency</th>
                <th>Length</th> */}
              </tr>
            </thead>
            <tbody>
              {matchingWords.map((word) => (
                <tr
                  key={word.id}
                  className={word === selectedWord ? "highlighted" : ""}
                >
                  <td>
                    <span
                      className="wordlink"
                      onClick={() => handleWordClick(word.word)}
                    >
                      {word.word}
                    </span>
                  </td>
                  <td>
                    <PhonemeConverter
                      phonemeString={word.phoneme.join(",")}
                      elementsToHighlight={selectedPhonemes}
                      indicesToHighlight={""}
                    />
                  </td>
                  <td>
                    <PhonemeHighlighter
                      phonemeString={word.phoneme.join(",")}
                      elementsToHighlight={selectedPhonemes}
                      indicesToHighlight={""}
                    />
                  </td>
                  {/* <td>{word.phoneme.join(', ')}</td> */}
                  {/* <td>{word.freq}</td>
                  <td>{word.phoneme_length}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IncludeExclude;
