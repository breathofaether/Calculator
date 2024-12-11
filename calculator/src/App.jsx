import React, { useState, useRef, useEffect } from "react";
import { evaluate } from "mathjs";

function Display({ value }) {
  const displayRef = useRef(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [value]);

  return (
    <div
      className="display"
      ref={displayRef}>
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
    '0', '.', '=', '+',
    "sin", "cos", "tan", "log"
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
  const [errorLogs, setErrorLogs] = useState([])

  let hoverTimeout = null;
  let hideTimeout = null;

  const logError = (error) => {
    const errorLog = {
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    };

    const newErrorLog = [...errorLogs, errorLog]
    console.log("Error: ", errorLog)
    setInput("Error")
    setErrorLogs(newErrorLog)

    setTimeout(() => {
      setInput('0');
    }, 1750)
  }

  const handleButtonClick = (value) => {


    const functions = ['sin', 'cos', 'tan', 'log'];

    if (functions.includes(value)) {
      if (input === "0") {
        return setInput(`${value}(`);
      } else {
        return setInput((prev) => prev + `${value}(`);
      }
    }

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
        let formattedResult;


        if (Number.isSafeInteger(result)) {
          setInput(result.toString());
        } else if (result.toString().length > 18) {
          formattedResult = result.toExponential(4);
          setInput(formattedResult)
        } else {
          setInput(Number(result).toFixed(12));
        }
      } catch (error) {
        logError(error)
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

  const handleDownload = () => {
    const blob = new Blob([errorLogs.map(log => JSON.stringify(log)).join("\n")], { type: 'text/plain' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "error_log.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="calculator">
      {errorLogs.length > 0 && (
        <div className="error-log-container">
          <button className="download-btn" onClick={handleDownload}>
            Download Error Log(s) here
          </button>
        </div>
      )}
      <Display value={input} />
      <div className="tooltip-container">
        {showTooltip && (<div className="tooltip">Long press to clear</div>)}
      </div>
      <ButtonPanel onButtonClick={handleButtonClick} onLongPress={longPress} onHover={handleHoverTimeOut} />
    </div>
  );
}