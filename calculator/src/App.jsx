import React, { useState } from "react";
import { evaluate, format } from "mathjs";


const Calculator = () => {
  const [result, setResult] = useState("");

  const numbers = Array.from({ length: 10 }, (_, index) => index)
  const operators = ["/", "*", "-", "+"]


  const handleClick = (value) => {
    setResult(result+value)
  }

  const handleClear = () => {
    setResult("");
  };

  const handleBackspace = () => {
    setResult(result.slice(0, -1))
  }

  const handleCalculate = () => {
    try {
      const evaluatedResult = evaluate(result);
      const formattedResult = format(evaluatedResult, {notation: "fixed"})
      setResult(formattedResult)
    } catch (error) {
      setResult("Error")
    }
  }



  return (
    <div className="calculator-container">
      <div className="screen">
        <input type="text" value={result} readOnly />
      </div>

      <div className="button-panel">
        <div className="numbers">
          {numbers.map((number) => (
            <button
              key={number}
              className="number-btn"
              onClick={() => handleClick(number.toString())}>
              {number}
            </button>
          ))}
        </div>
      </div>

      <div className="operators">
        {operators.map((operator) => (
          <button
          key={operator}
          className="operator-btn"
          onClick={() => handleClick(operator)}>
            {operator}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="clear-btn" onClick={handleClear}>Clear</button>
        <button className="backspace-btn" onClick={handleBackspace}>C</button>
        <button className="equal-btn" onClick={handleCalculate}>=</button>
      </div>

    </div>
  );
};

export default Calculator;

