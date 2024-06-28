import React, { useState } from 'react';
import { PhonemeConverter } from './PhonemeConvertor';
import { PhonemeHighlighter } from './PhonemeHighlighter';
import { useNavigate } from 'react-router-dom';

function MinimalCat({ onWordClick }) {
  const [category, setCategory] = useState('');
  const [pairsByLength, setPairsByLength] = useState([]);
  const navigate = useNavigate();

  const handleWordClick = (word) => {
    onWordClick(word);
    navigate('/SearchBar');
  };

  const handleButtonClick = () => {
    navigate('/categoryList');
  };

  const fetchMinimalPairs = async () => {
    try {
      const lowercaseCategory = category.toLowerCase();
      const response = await fetch(`/api/minimal_cat/?category=${lowercaseCategory}`);
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        setPairsByLength(data);
      } else {
        setPairsByLength([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setPairsByLength([]);
    }
  };

  return (
    <div className="minimal-pair-container">
      <p>Enter a category and discover all potential minimal and maximal pairs within that category, grouped by length, revealing the fascinating hidden interconnections within each word class.</p>
      <h1>Minimal Pair Finder</h1>
      <div>
        <h3>Enter Category</h3>
        <input
          type="text"
          placeholder="Eg : Plant, Animal, Object"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={fetchMinimalPairs}>Search</button>
<br></br>
        {/* <button onClick={handleButtonClick}>Click here to see more Categories</button> */}
      </div>
     
        {pairsByLength.map((pairs, index) => (
        <div key={index} className="result-container">
          <h2>{`Matching Pairs (Length ${pairs[0].phoneme1.length}):`}</h2>
          <table className={`pair-table pair-table-${pairs[0].phoneme1.length}`}>
            <thead>
              <tr>
                <th>Word 1</th>
                <th>IPA 1</th>
                <th>Phoneme 1</th>
                <th>Word 2</th>
                <th>IPA 2</th>
                <th>Phoneme 2</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, pairIndex) => (
                <tr key={pairIndex}>
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
                      phonemeString={pair.phoneme1 && pair.phoneme1.join(',')}
                      elementsToHighlight={''}
                      indicesToHighlight={''}
                    />
                  </td>
                  <td>
                    <PhonemeHighlighter
                      phonemeString={pair.phoneme1.join(',')}
                      elementsToHighlight={''}
                      indicesToHighlight={''}
                    />
                  </td>
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
                      phonemeString={pair.phoneme2 && pair.phoneme2.join(',')}
                      elementsToHighlight={''}
                      indicesToHighlight={''}
                    />
                  </td>
                  <td>
                    <PhonemeHighlighter
                      phonemeString={pair.phoneme2.join(',')}
                      elementsToHighlight={''}
                      indicesToHighlight={''}
                    />
                  </td>
                  <td>{pair.type}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default MinimalCat;
