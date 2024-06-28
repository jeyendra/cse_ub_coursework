// WordDetails.js
import React, { useState, useEffect } from "react";
import "./WordDetails.css";
import axios from "axios";
import { PhonemeConverter } from "./PhonemeConvertor";


function WordDetails({ wordDetails }) {
  const [ipaNotation, setIpaNotation] = useState(null);

  useEffect(() => {
    if (wordDetails && wordDetails.word) {
      const fetchIpa = async () => {
        try {
          const response = await axios.get(`/api?word=${wordDetails.word}`);
          setIpaNotation(response.data.IPA);
        } catch (error) {
          console.error("Failed to fetch IPA:", error);
        }
      };

      fetchIpa();
    }
  }, [wordDetails]);

  return (
    <div className="details-container">
      <h1>Word Phoneme Details</h1>

      {wordDetails && wordDetails.category && wordDetails.category.length > 0 ? (
        <div>
          <h2>Category:</h2>
          <div className="category-buttons">
            {wordDetails.category.map((cat, index) => (
              <button key={index}>{cat}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="center-content">
          <h2>Category not found</h2>
        </div>
      )}

      {wordDetails && wordDetails.pos && (
        <div>
          <h2>Parts of Speech:</h2>
          {wordDetails.pos.map((pos, index) => (
            <span key={index}> {pos} </span>
          ))}
        </div>
      )}

      {wordDetails && wordDetails.phoneme && (
        <div>
          <h2>Articulation Details:</h2>
          <table className="details-table">
            <thead>
              <tr>
                <th>Phoneme</th>
                {wordDetails.phoneme.map((phoneme, index) => (
                  <td key={index}>{phoneme}</td>
                ))}
              </tr>
            </thead>
            <tbody>
            <tr>
                <th>IPA</th>
                {wordDetails.phoneme.map((phoneme, index) => (
                  <td key={index}><PhonemeConverter phonemeString={phoneme} indicesToHighlight={''} elementsToHighlight={''}/></td>
                ))}
              </tr>
              <tr>
                <th>Place of Articulation (POA):</th>
                {wordDetails.POA.map((poa, index) => (
                  <td key={index}>{poa}</td>
                ))}
              </tr>
              <tr>
                <th>Manner of Articulation (MOA):</th>
                {wordDetails.MOA.map((moa, index) => (
                  <td key={index}>{moa}</td>
                ))}
              </tr>
              <tr>
              <th>Voice of Articulation (VOA):</th>
              {wordDetails.VOA.map((voa, index) => (
                <td key={index}>{voa}</td>
              ))}
            </tr>
            <tr>
              <th>Height:</th>
              {wordDetails.H.map((H, index) => (
                <td key={index}>{H}</td>
              ))}
            </tr>
            <tr>
              <th>Backness:</th>
              {wordDetails.B.map((B, index) => (
                <td key={index}>{B}</td>
              ))}
            </tr>
            <tr>
              <th>Rounding:</th>
              {wordDetails.R.map((R, index) => (
                <td key={index}>{R}</td>
              ))}
            </tr>
            </tbody>
          </table>
        </div>
      )}

      {wordDetails && wordDetails.src_word && (
        <div>
          <h2>Source Details:</h2>
          <table className="no-border-table">
            <thead>
              <tr>
                <th>Source Word:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{wordDetails.src_word}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {wordDetails && wordDetails.src_category && (
        <div>
          <table className="no-border-table">
            <thead>
              <tr>
                <th>Source Category:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{wordDetails.src_category}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WordDetails;
