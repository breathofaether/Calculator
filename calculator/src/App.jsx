import React, { useState } from "react";
import { evaluate } from "mathjs";

function Display({ value }) {
  return (
    <div className="display">
      {value}
    </div>
  );
}

function ButtonPanel({ onButtonClick, onLongPress, onHover }) {
  const buttons = [
    "CE", "%", "(", ")",
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="button-panel">
      {buttons.map((btn) => (
        <button key={btn} onClick={() => onButtonClick(btn)}
          onMouseDown={btn === "CE" ? onLongPress.start : null}
          onMouseUp={btn === "CE" ? onLongPress.stop : null}
          onMouseEnter={btn === "CE" ? () => onHover(true) : null}
          onMouseLeave={btn === "CE" ? () => { onLongPress.stop; onHover(false) } : null}
        >
          {btn}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('0');
  const [showTooltip, setShowTooltip] = useState(false)
  let hoverTimeout = null;
  let hideTimeout = null;

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
      if (input === '0' && value !== '.') {
        return setInput(value);
      }
      setInput(input + value);
    }
  };

  const longPress = {
    timer: null,
    start: () => {
      longPress.timer = setTimeout(() => {
        setInput('0');
      }, 750);
    },
    stop: () => {
      clearTimeout(longPress.timer);
    }
  }

  const handleHoverTimeOut = (show) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }

    if (show) {
      hoverTimeout = setTimeout(() => {
        setShowTooltip(true);
        hideTimeout = setTimeout(() => {
          setShowTooltip(false);
        }, 1500);
      });
    } else {
      setShowTooltip(false);
    }
  };

return (
  <div className="calculator">
    <Display value={input} />
    <div className="tooltip-container">
      {showTooltip && (<div className="tooltip">Long press to clear</div>)}
    </div>
    <ButtonPanel onButtonClick={handleButtonClick} onLongPress={longPress} onHover={handleHoverTimeOut} />
  </div>
);
}