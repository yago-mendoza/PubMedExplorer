import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const LoadingAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 9.6 * 1.3; // Increased by 30%
    const innerRadius = 70;
    const outerRadius = innerRadius * (2 / Math.sqrt(3));

    const circles = [
      // External circles
      { x: centerX, y: centerY - outerRadius },
      { x: centerX + (outerRadius * Math.sqrt(3)) / 2, y: centerY + outerRadius / 2 },
      { x: centerX - (outerRadius * Math.sqrt(3)) / 2, y: centerY + outerRadius / 2 },
      // Internal circles
      { x: centerX, y: centerY },
      { x: centerX, y: centerY - (innerRadius * 2) / 3 },
      { x: centerX + (innerRadius * Math.sqrt(3)) / 3, y: centerY - innerRadius / 3 },
      { x: centerX + (innerRadius * Math.sqrt(3)) / 3, y: centerY + innerRadius / 3 },
      { x: centerX, y: centerY + (innerRadius * 2) / 3 },
      { x: centerX - (innerRadius * Math.sqrt(3)) / 3, y: centerY + innerRadius / 3 },
      { x: centerX - (innerRadius * Math.sqrt(3)) / 3, y: centerY - innerRadius / 3 },
    ];

    let time = 0;
    const duration = 4000 / 0.7; // Adjusted to run at 70% of the original speed

    function easeOutBack(t) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function easeInOutBack(t) {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }

    function rotatePoint(x, y, angle) {
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      const translatedX = x - centerX;
      const translatedY = y - centerY;
      const rotatedX = translatedX * c - translatedY * s;
      const rotatedY = translatedX * s + translatedY * c;
      return {
        x: rotatedX + centerX,
        y: rotatedY + centerY
      };
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time = (time + 16) % duration;
      const progress = time / duration;

      const step = Math.floor(progress * 6);
      const stepProgress = (progress * 6) % 1;

      circles.forEach((circle, index) => {
        let x, y;
        if (index < 3) { // External circles
          if (stepProgress < 0.5) { // Movement
            const t = easeInOutBack(stepProgress * 2);
            const startAngle = (step * Math.PI * 2 / 6) + (index * 2 * Math.PI / 3);
            const endAngle = ((step + 1) * Math.PI * 2 / 6) + (index * 2 * Math.PI / 3);
            
            const controlRadius = outerRadius * 1.2;
            const controlAngle = (startAngle + endAngle) / 2;
            const controlX = centerX + controlRadius * Math.cos(controlAngle);
            const controlY = centerY + controlRadius * Math.sin(controlAngle);
            
            const startX = centerX + outerRadius * Math.cos(startAngle);
            const startY = centerY + outerRadius * Math.sin(startAngle);
            const endX = centerX + outerRadius * Math.cos(endAngle);
            const endY = centerY + outerRadius * Math.sin(endAngle);
            x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
            y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
          } else { // Pause
            const angle = ((step + 1) * Math.PI * 2 / 6) + (index * 2 * Math.PI / 3);
            x = centerX + outerRadius * Math.cos(angle);
            y = centerY + outerRadius * Math.sin(angle);
          }
        } else { // Internal circles
          const pulseStart = 0.5;
          const pulseEnd = 1;
          
          let scaleFactor = 1;
          if (stepProgress >= pulseStart && stepProgress < pulseEnd) {
            const pulseProgress = (stepProgress - pulseStart) / (pulseEnd - pulseStart);
            if (pulseProgress < 0.5) {
              // Movement towards center with bounce effect
              scaleFactor = 1 - 0.5 * easeOutBack(pulseProgress * 2);
            } else {
              // Expansion outward with bounce effect
              scaleFactor = 0.5 + 0.5 * easeOutBack((pulseProgress - 0.5) * 2);
            }
          }
          x = centerX + (circle.x - centerX) * scaleFactor;
          y = centerY + (circle.y - centerY) * scaleFactor;
        }
        const rotated = rotatePoint(x, y, Math.PI / 2);
        drawCircle(rotated.x, rotated.y, radius, 'black');
      });

      requestAnimationFrame(animate);
    }

    function drawCircle(x, y, r, color) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    animate();
  }, []);

  return (
    <canvas ref={canvasRef} width="280" height="280" className="border rounded" />
  );
};

// Render the LoadingAnimation component into the loading-animation div
ReactDOM.render(<LoadingAnimation />, document.getElementById('loading-animation'));

export default LoadingAnimation;    