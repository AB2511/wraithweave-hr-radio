import { useState, useEffect } from "react";

const COMPLIANCE_STATES = [
  { min: 75, label: "Operational Stability", color: "#00ff88", bg: "#003322" },
  { min: 50, label: "Performance Watch", color: "#ffaa00", bg: "#332200" },
  { min: 25, label: "Psychological Red Flag", color: "#ff4444", bg: "#330000" },
  { min: 0, label: "Termination Risk", color: "#ff0000", bg: "#440000" }
];

export default function PanicMeter({ compliance = 100 }) {
  const [displayLevel, setDisplayLevel] = useState(100);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    // Animate to new compliance level
    const timer = setInterval(() => {
      setDisplayLevel(prev => {
        if (prev < compliance) return Math.min(prev + 2, compliance);
        if (prev > compliance) return Math.max(prev - 2, compliance);
        return prev;
      });
    }, 50);

    // Animation effects based on compliance level
    if (compliance <= 25) {
      setIsShaking(true);
      const shakeTimer = setTimeout(() => setIsShaking(false), 2000);
      return () => {
        clearInterval(timer);
        clearTimeout(shakeTimer);
      };
    } else if (compliance < 50) {
      setIsShaking(true);
      const shakeTimer = setTimeout(() => setIsShaking(false), 1000);
      return () => {
        clearInterval(timer);
        clearTimeout(shakeTimer);
      };
    }

    return () => clearInterval(timer);
  }, [compliance]);

  const currentState = COMPLIANCE_STATES.find(state => displayLevel >= state.min);

  return (
    <div className={`panic-meter ${isShaking ? 'shake' : ''}`}>
      <div className="panic-header">
        Employee Emotional Compliance:
      </div>
      
      <div className="panic-bar-container">
        <div 
          className="panic-bar"
          style={{ 
            width: `${displayLevel}%`,
            backgroundColor: currentState.color,
            boxShadow: `0 0 10px ${currentState.color}`
          }}
        />
        <div className="panic-bar-bg" style={{ backgroundColor: currentState.bg }} />
      </div>
      
      <div className="panic-status">
        {Math.round(displayLevel)}% • Status: {currentState?.label || "Error"}
      </div>
    </div>
  );
}