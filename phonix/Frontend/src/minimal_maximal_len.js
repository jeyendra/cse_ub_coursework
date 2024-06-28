import React, { useState, useEffect } from "react";
import "./minimal.css";
import { PhonemeConverter } from "./PhonemeConvertor";
import { PhonemeHighlighter } from "./PhonemeHighlighter";
import { useNavigate } from "react-router-dom";

function MinimalPair({ onWordClick }) {
  const [phoneme1, setPhoneme1] = useState(""); // State for Phoneme 1
  const [phoneme2, setPhoneme2] = useState(""); // State for Phoneme 2
  const [length, setLength] = useState(""); // State for Length
  const [minimalPairs, setMinimalPairs] = useState({}); // State for Minimal Pairs
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

  const fetchMinimalPairs = async () => {
    try {
      const response = await fetch(
        `/api/minimal/?phoneme1=${phoneme1}&phoneme2=${phoneme2}&length=${length}`
      );
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setMinimalPairs(data);
      } else {
        setMinimalPairs({});
      }
    } catch (error) {
      console.error("Error:", error);
      setMinimalPairs({});
    }
  };

  // useEffect(() => {
  //   if (phoneme1 && phoneme2 && length) {
  //     fetchMinimalPairs();
  //   }
  // }, [phoneme1, phoneme2, length]);

  // Function to handle phoneme selection
  const handlePhonemeSelection = (setPhoneme, phoneme) => {
    setPhoneme((prevPhoneme) => (prevPhoneme === phoneme ? "" : phoneme));
  };
  const getIPASymbol = (phoneme) => phonemeToIPAMap[phoneme] || phoneme;

  return (
    <div>
      <p>
        Select a phoneme from each tile to define the differing sound and give
        the length, and unveil all words containing these variations as their
        minimal pairs. Explore the fascinating world of minimal pairs and
        witness the transformative power of a single sound change.
      </p>
      <div className="horizontal-layout">
        <div className="tile">
          <h2> Phoneme 1 :</h2>
          <div>
            {vowelSounds.map((phoneme) => (
              <button
                key={phoneme}
                className={phoneme1 === phoneme ? "selected" : ""}
                onClick={() => handlePhonemeSelection(setPhoneme1, phoneme)}
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
                className={phoneme1 === phoneme ? "selected" : ""}
                onClick={() => handlePhonemeSelection(setPhoneme1, phoneme)}
                title={getIPASymbol(phoneme)}
              >
                {phoneme} /{getIPASymbol(phoneme)}/
              </button>
            ))}
          </div>
        </div>

        <div className="tile">
          <h2>Phoneme 2 :</h2>
          <div>
            {vowelSounds.map((phoneme) => (
              <button
                key={phoneme}
                className={phoneme2 === phoneme ? "selected" : ""}
                onClick={() => handlePhonemeSelection(setPhoneme2, phoneme)}
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
                className={phoneme2 === phoneme ? "selected" : ""}
                onClick={() => handlePhonemeSelection(setPhoneme2, phoneme)}
                title={getIPASymbol(phoneme)}
              >
                {phoneme} /{getIPASymbol(phoneme)}/
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2>Enter Length</h2>
          <input
            type="text"
            placeholder="Enter Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
          <button onClick={fetchMinimalPairs}>Search</button>
        </div>
        <div className="result">
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>IPA</th>
                <th>Manner of Articulation / Height</th>
                <th>Place of Articulation/ Backness</th>
                <th>Voicing / Rounding</th>
              </tr>
            </thead>

            <tbody>
              {minimalPairs.length > 0 && (
                <>
                  <tr key={minimalPairs[minimalPairs.length - 1].id}>
                    <td>{phoneme1}</td>
                    <td>
                      <PhonemeConverter
                        phonemeString={phoneme1}
                        elementsToHighlight={""}
                        indicesToHighlight={""}
                      />
                    </td>
                    <td>
                      {minimalPairs[minimalPairs.length - 1].MOA1 ||
                        minimalPairs[minimalPairs.length - 1].H1}
                    </td>
                    <td>
                      {minimalPairs[minimalPairs.length - 1].POA1 ||
                        minimalPairs[minimalPairs.length - 1].B1}
                    </td>
                    <td>
                      {minimalPairs[minimalPairs.length - 1].VOA1 ||
                        minimalPairs[minimalPairs.length - 1].R1}
                    </td>
                  </tr>
                  <tr key={minimalPairs[minimalPairs.length - 1].id}>
                    <td>{phoneme2}</td>
                    <td>
                      <PhonemeConverter
                        phonemeString={phoneme2}
                        elementsToHighlight={""}
                        indicesToHighlight={""}
                      />
                    </td>
                    <td>
                      {minimalPairs[minimalPairs.length - 1].MOA2 ||
                        minimalPairs[minimalPairs.length - 1].H2}
                    </td>
                    <td>
                      {minimalPairs[minimalPairs.length - 1].POA2 ||
                        minimalPairs[minimalPairs.length - 1].B2}
                    </td>
                    <td>
                      {minimalPairs[minimalPairs.length - 1].VOA2 ||
                        minimalPairs[minimalPairs.length - 1].R2}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          <br></br>
          <h2>Matching Minimal Pairs:</h2>
          <table className="minimal-pair-table">
            <thead>
              <tr>
                <th>Word 1</th>
                <th>IPA 1</th>
                <th>Phoneme 1</th>
                <th>Word 2</th>
                <th>IPA 1</th>
                <th>Phoneme 2</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(minimalPairs) &&
                minimalPairs.map((pair, index) => (
                  <tr key={index}>
                    {/* <td>{pair.word1}</td> */}
                    <td>
                      <span
                        className="wordlink"
                        onClick={() => handleWordClick(pair.word1)}
                      >
                        {pair.word1}
                      </span>
                    </td>
                    <td>
                      <PhonemeConverter
                        phonemeString={pair.phoneme1 && pair.phoneme1.join(",")}
                        elementsToHighlight={phoneme1}
                        indicesToHighlight={""}
                      />
                    </td>
                    <td>
                      <PhonemeHighlighter
                        phonemeString={pair.phoneme1 && pair.phoneme1.join(",")}
                        elementsToHighlight={phoneme1}
                        indicesToHighlight={""}
                      />
                    </td>
                    {/* <td>{pair.word2}</td> */}
                    <td>
                      <span
                        className="wordlink"
                        onClick={() => handleWordClick(pair.word2)}
                      >
                        {pair.word2}
                      </span>
                    </td>
                    <td>
                      <PhonemeConverter
                        phonemeString={pair.phoneme2 && pair.phoneme2.join(",")}
                        elementsToHighlight={phoneme2}
                        indicesToHighlight={""}
                      />
                    </td>
                    <td>
                      <PhonemeHighlighter
                        phonemeString={pair.phoneme2 && pair.phoneme2.join(",")}
                        elementsToHighlight={phoneme2}
                        indicesToHighlight={""}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MinimalPair;
