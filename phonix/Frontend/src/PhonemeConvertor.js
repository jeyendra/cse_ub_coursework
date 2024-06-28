import React from 'react';
import './PhonemeSelector.css';
import IPA_symbols from './ipa_phoneme.json';


function highlight(phonemeString, elementsToHighlight,indicesToHighlight) {
  if (typeof phonemeString === 'string') {
    const phonemeArray = phonemeString.split(',');
    const result = phonemeArray.map((phoneme, index) => {
      const trimmedPhoneme = phoneme.trim();
      const isHighlighted =
      elementsToHighlight.indexOf(trimmedPhoneme) !== -1 ||
      indicesToHighlight.includes(index);
      const content = IPA_symbols.IPA_symbols[trimmedPhoneme] || trimmedPhoneme;
      const highlightClass = isHighlighted ? 'highlighted' : '';

      // Conditionally add a space after each span, except for the last one
      const space = index < phonemeArray.length - 1 ? ' ' : '';

      return (
        <span key={trimmedPhoneme + index} className={highlightClass}>
          {content}
          {space}
        </span>
      );
    });

    return result;
  } else {
    return phonemeString;
  }
}

export function PhonemeConverter({ phonemeString, elementsToHighlight, indicesToHighlight }) {
  const highlightedAndConverted = highlight(phonemeString, elementsToHighlight,indicesToHighlight);

  return <>{highlightedAndConverted}</>;
}
