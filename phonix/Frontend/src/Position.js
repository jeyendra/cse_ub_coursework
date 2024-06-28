import React, { useState, useEffect } from "react";
import "./PositionStyling.css";
import { PhonemeHighlighter } from "./PhonemeHighlighter";
import { useNavigate } from "react-router-dom";
import { PhonemeConverter } from './PhonemeConvertor';

const phonemeToIPAMap = {
  
    // Vowel sounds
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

    // Consonant sounds
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
const vowelSounds = ["AA","AE","AH","AO","AW","AY","EH","ER","EY","IH","IY","OW","OY","UH","UW",  ];
const consonantSounds = ["B","CH","D","DH","F","G","HH","JH","K","L","M","N","NG","P","R","S","SH","T","TH","V","W","Y","Z","ZH"];

function Position({ onWordClick }) {
  const [initialPhoneme, setInitialPhoneme] = useState("NA");
  const [middlePhoneme, setMiddlePhoneme] = useState("NA");
  const [finalPhoneme, setFinalPhoneme] = useState("NA");
  const [sortParameter, setSortParameter] = useState("freq");
  const [sortOrder, setSortOrder] = useState("desc");
  const [result, setResult] = useState([]);
  const newPhonemeArray = [initialPhoneme, middlePhoneme, finalPhoneme];
  const navigate = useNavigate();
  const handleWordClick = (word) => {
    onWordClick(word);
    navigate("/SearchBar");
  };

  const getIPASymbol = (phoneme) => phonemeToIPAMap[phoneme] || phoneme;

  const togglePhonemeSelection = (selectedPhoneme, setSelectedPhoneme) => {
    setSelectedPhoneme((prevSelected) =>
      prevSelected === selectedPhoneme ? "NA" : selectedPhoneme
    );
  };

  const handleSortParameterChange = (event) => {
    setSortParameter(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const fetchData = async () => {
    const apiUrl = `/api/phoneme_pos/?initial=${initialPhoneme}&middle=${middlePhoneme}&final=${finalPhoneme}&sort_parameter=${sortParameter}&sort_order=${sortOrder}`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setResult(data);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialPhoneme, middlePhoneme, finalPhoneme, sortParameter, sortOrder]);

  return (
    <div>
      <p>Craft your perfect word search by selecting the phonemes you want to see at the beginning, middle, or end of your results. Choose from a diverse range of phonemes and personalize your exploration with each selection. Further refine your findings by sorting by frequency, phoneme length, or alphabetical order, in either ascending or descending order.</p>
      <br></br>
    <div className="horizontal-layout">
      <div className="tile">
        <h2>Initial Phoneme:</h2>
        <div>
          {vowelSounds.map((phoneme) => (
            <button
              key={phoneme}
              className={initialPhoneme === phoneme ? "selected" : ""}
              onClick={() => togglePhonemeSelection(phoneme, setInitialPhoneme)}
              title={getIPASymbol(phoneme)}
            >
              {phoneme} /{getIPASymbol(phoneme)}/
            </button>
          ))}
        </div>
        <br></br>
        <div>
          {consonantSounds.map((phoneme) => (
            <button
              key={phoneme}
              className={initialPhoneme === phoneme ? "selected" : ""}
              onClick={() => togglePhonemeSelection(phoneme, setInitialPhoneme)}
              title={getIPASymbol(phoneme)}
            >
              {phoneme} /{getIPASymbol(phoneme)}/
            </button>
          ))}
        </div>
      </div>

      <div className="tile">
        <h2>Middle Phoneme:</h2>
        <div>
          {vowelSounds.map((phoneme) => (
            <button
              key={phoneme}
              className={middlePhoneme === phoneme ? "selected" : ""}
              onClick={() => togglePhonemeSelection(phoneme, setMiddlePhoneme)}
              title={getIPASymbol(phoneme)}
            >
              {phoneme} /{getIPASymbol(phoneme)}/
            </button>
          ))}
        </div>
        <br></br>
        <div>
          {consonantSounds.map((phoneme) => (
            <button
              key={phoneme}
              className={middlePhoneme === phoneme ? "selected" : ""}
              onClick={() => togglePhonemeSelection(phoneme, setMiddlePhoneme)}
              title={getIPASymbol(phoneme)}
            >
              {phoneme} /{getIPASymbol(phoneme)}/
            </button>
          ))}
        </div>
      </div>

      <div className="tile">
        <h2>Final Phoneme:</h2>
        <div>
          {vowelSounds.map((phoneme) => (
            <button
              key={phoneme}
              className={finalPhoneme === phoneme ? "selected" : ""}
              onClick={() => togglePhonemeSelection(phoneme, setFinalPhoneme)}
              title={getIPASymbol(phoneme)}
            >
              {phoneme} /{getIPASymbol(phoneme)}/
            </button>
          ))}
        </div>
        <div>
          <br></br>
          {consonantSounds.map((phoneme) => (
            <button
              key={phoneme}
              className={finalPhoneme === phoneme ? "selected" : ""}
              onClick={() => togglePhonemeSelection(phoneme, setFinalPhoneme)}
              title={getIPASymbol(phoneme)}
            >
              {phoneme} /{getIPASymbol(phoneme)}/
            </button>
          ))}
        </div>
      </div>

      <div className="result">
        <div className="sorting-options">
          <label>Sort By:</label>
          <select value={sortParameter} onChange={handleSortParameterChange}>
            <option value="freq">Frequency</option>
            <option value="phoneme_length">Phoneme Length</option>
            <option value="word">Alphabetical order</option>
          </select>
          <label>Sort Order:</label>
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <h2>Results:</h2>
        <table>
          <thead>
            <tr className="table-head">
              <th>Word</th>
              <th>IPA</th>
              <th>Phonemes</th>
            </tr>
          </thead>
          <tbody>
            {result.map((word) => (
              <tr key={word.id}>
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
                    elementsToHighlight={''} 
                    indicesToHighlight={word.highlight_indices}
                    />
                </td>
                <td>
                      <PhonemeHighlighter
                        phonemeString={word.phoneme.join(",")}
                        elementsToHighlight={''}
                        indicesToHighlight={word.highlight_indices}
                      />
                    </td>
                
                
                {/* <td>{word.freq}</td>
                <td>{word.phoneme_length}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default Position;
