import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// You can start from an existing theme and override its properties, or build one from scratch.
// Here, we create a custom rainbow style.
const rainbowStyle = {
  'code[class*="language-"]': {
    background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
    padding: '1em',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#fff'
  },
  'comment': { color: '#ddd' },
  'string': { color: '#000' },
  'keyword': { color: '#fff' },
  'function': { color: '#000' },
  // Add more token customizations as desired
};

const RainbowCode = ({ code, language = 'javascript' }) => {
  return (
    <SyntaxHighlighter language={language} style={rainbowStyle}>
      {code}
    </SyntaxHighlighter>
  );
};

export default RainbowCode;
