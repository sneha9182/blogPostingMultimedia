//lettercanvas.js// LetterCanvas.js
import { useEffect, useRef } from 'react';

const LetterCanvas = ({ letter }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const radius = canvas.width / 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const fontSize = 20; // Adjust font size to fit the canvas

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#f0f0f0'; // Circle color
        ctx.fill();
        ctx.strokeStyle = '#000'; // Circle border color
        ctx.lineWidth = 2; // Circle border width
        ctx.stroke();

        // Draw the letter
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000'; // Letter color
        ctx.fillText(letter, centerX, centerY);
    }, [letter]); // Re-draw when letter prop changes

    return (
        <canvas
            ref={canvasRef}
            width="50" // Adjust canvas width
            height="50" // Adjust canvas height
            style={{ display: 'block', margin: 'auto', backgroundColor: 'transparent' }}
        />
    );
};

export default LetterCanvas;