import { useEffect, useState } from "react";

const TypingEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 5);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <p
      className="bg-dark text-white py-2 px-4 rounded shadow-lg"
      style={{ maxWidth: "75%" }}
    >
      {displayedText}
    </p>
  );
};

export default TypingEffect;
