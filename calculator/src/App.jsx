import React, { useState } from "react";
import { evaluate } from "mathjs";

function Display({ value }) {
  return (
    <div className="display">
      {value}
    </div>
  );
}

function ButtonPanel({ onButtonClick }) {
  const buttons = [
    "CE","%", "(", ")",
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="button-panel">
      {buttons.map((btn) => (
        <button key={btn} onClick={() => onButtonClick(btn)}>
          {btn}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('0');

  const handleButtonClick = (value) => {

    if (value === "Clear") {
      return setInput('0');
    }

    if (value === "CE") {
      if (input.length > 1) {
        return setInput(input.slice(0, -1));
      } else {
        return setInput('0');
      }
    }

    if (value === '=') {
      try {
        const result = evaluate(input);
        setInput(result.toString());
      } catch (error) {
        console.error("MathJS Evaluation Error:", error);
        setInput("Error");

        setTimeout(() => {
          setInput('0');
        }, 1000)
      }
    } else {
      if (input === "0" && value !== ".") {
        return setInput(value);
      }
      setInput(input + value);
    }
  };

  return (
    <div className="calculator">
      <Display value={input} />
      <ButtonPanel onButtonClick={handleButtonClick} />
    </div>
  );
}