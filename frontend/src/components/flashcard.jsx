import React, { useState, useEffect } from "react";

const Flashcard = ({ flashcard, resetFlip }) => {
  const [flipped, setFlipped] = useState(false);

  // Effect to reset flip state when index changes
  useEffect(() => {
    setFlipped(false);
  }, [resetFlip]);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="flex justify-center">
      <div className="flip-card cursor-pointer" onClick={handleClick}>
        <div className={`flip-card-inner ${flipped ? "flip" : ""}`}>
          <div className="flip-card-front flex items-center justify-center bg-blue-200 text-black rounded-lg">
            <p>{flashcard.question}</p>
          </div>
          <div className="flip-card-back flex items-center justify-center bg-blue-500 text-white rounded-lg transform rotateY-180">
            <p>{flashcard.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
