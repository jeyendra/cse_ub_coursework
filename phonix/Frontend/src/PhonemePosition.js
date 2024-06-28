import React from 'react';

function highlight(phonemeString, elementsToHighlight,index_highlight) {
  if (typeof phonemeString === 'string') {
    const phonemeArray = phonemeString.split(',');
    const result = phonemeArray.map((phoneme, index) => {
      const trimmedPhoneme = phoneme.trim();
      const isHighlighted = elementsToHighlight.includes(trimmedPhoneme);
      const content = trimmedPhoneme;
      const highlightClass = isHighlighted ? 'highlighted' : '';

      const space = index < phonemeArray.length - 1 ? ',' : '';
      if(index_highlight.includes(index)){
        return (
          <span key={trimmedPhoneme + index} className={highlightClass}>
            {content}
            {space}
          </span>
        );
      }
      
    });

    return result;
  } else {
    return phonemeString;
  }
}

export function PhonemePosition({ phonemeString, elementsToHighlight, index_highlight}) {
  const highlightedAndConverted = highlight(phonemeString, elementsToHighlight,index_highlight);

  return <p>{highlightedAndConverted}</p>;
}
