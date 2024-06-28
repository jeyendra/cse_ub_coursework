import React from 'react';

function highlight(phonemeString, elementsToHighlight, indicesToHighlight) {
  if (typeof phonemeString === 'string') {
    const phonemeArray = phonemeString.split(',');
    const result = phonemeArray.map((phoneme, index) => {
      const trimmedPhoneme = phoneme.trim();
      const isHighlighted = elementsToHighlight.includes(trimmedPhoneme) || indicesToHighlight.includes(index);
      const content = trimmedPhoneme;
      const highlightClass = isHighlighted ? 'highlighted' : '';

      // Conditionally add a space after each span, except for the last one
      const space = index < phonemeArray.length - 1 ? ', ' : '';

      return (
        <React.Fragment key={trimmedPhoneme + index}>
          <span className={highlightClass}>{content}</span>
          {space}
        </React.Fragment>
      );
    });

    return result;
  } else {
    return phonemeString;
  }
}

export function PhonemeHighlighter({ phonemeString, elementsToHighlight, indicesToHighlight }) {
  const highlightedAndConverted = highlight(phonemeString, elementsToHighlight, indicesToHighlight);

  return <>{highlightedAndConverted}</>; 
}
