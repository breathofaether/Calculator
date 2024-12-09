import React, { useState } from "react";

const Calculator = () => {
  let [result, setResult] = useState("");

  const handleClick = (e) => {
    if (result.length >= 16) {
      setResult("!Large Input");
      setTimeout(() => {
        setResult("");
      }, 500);
      return;
    }
    if (result.charAt(0) === "0") {q

      result = result.slice(1, result.length);
    }
    setResult(result.concat(e.target.name));
  };

  const handleBackspace = () => {
    setResult(result.slice(0, result.length - 1));
  };

  const calculate = () => {
    try {
      result = eval(result).toString();
      if (result.includes(".")) {
        result = +eval(result);
        result = result.toFixed(4).toString();
        setResult(result);
      } else {
        setResult(eval(result).toString());
      }
    } catch (err) {
      setResult("Error");
    }
  };

  const buttons = [
    { name: "clear", label: "clear", className: "clear color", onClick: () => setResult("") },
    { name: "C", label: "C", className: "backspace color", onClick: handleBackspace },
    { name: "/", label: "/", className: "color", onClick: handleClick },
    { name: "7", label: "7", onClick: handleClick },
    { name: "8", label: "8", onClick: handleClick },
    { name: "9", label: "9", onClick: handleClick },
    { name: "*", label: "*", className: "color", onClick: handleClick },
    { name: "4", label: "4", onClick: handleClick },
    { name: "5", label: "5", onClick: handleClick },
    { name: "6", label: "6", onClick: handleClick },
    { name: "-", label: "-", className: "color", onClick: handleClick },
    { name: "1", label: "1", onClick: handleClick },
    { name: "2", label: "2", onClick: handleClick },
    { name: "3", label: "3", onClick: handleClick },
    { name: "+", label: "+", className: "color", onClick: handleClick },
    { name: "0", label: "0", onClick: handleClick },
    { name: ".", label: ".", onClick: handleClick },
    { name: "=", label: "=", className: "equal color", onClick: calculate },
  ];



  return (
    <div className="container">
      <form action="">
        <input type="text" value={result} readOnly />
      </form>

      <div className="keypad">
        {buttons.map((button, index) => (
          <button
            key={index}
            name={button.name}
            className={button.className || ""}
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
