import { useState, useEffect } from "react";

export default function CRTTerminal({ text, isActive = false }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!text) return;
    
    setDisplayText("");
    setCurrentIndex(0);
    
    const typeTimer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < text.length) {
          setDisplayText(text.slice(0, prev + 1));
          return prev + 1;
        } else {
          clearInterval(typeTimer);
          return prev;
        }
      });
    }, 80); // Slower typing for dramatic effect

    return () => clearInterval(typeTimer);
  }, [text]);

  useEffect(() => {
    // Cursor blink
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  if (!text) return null;

  return (
    <div className={`crt-terminal ${isActive ? 'crt-active' : ''}`}>
      <div className="crt-scanlines"></div>
      <div className="crt-content">
        <div className="crt-header">
          HR Assessment:
        </div>
        <div className="crt-text">
          {displayText}
          {showCursor && currentIndex >= text.length && <span className="crt-cursor">█</span>}
        </div>
      </div>
      <div className="crt-flicker"></div>
    </div>
  );
}