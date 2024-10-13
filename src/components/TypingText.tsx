import React, { useState, useEffect } from 'react';

interface TypingTextProps {
    text: string;
    speed?: number;
    tag?: 'div' | 'pre';
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50, tag }) => {
    const [displayLines, setDisplayLines] = useState<string[]>(Array(text.split('\n').length).fill(''));

    useEffect(() => {
        const lines = text.split('\n');
        const timers: NodeJS.Timeout[] = [];
        let completedLines = 0;

        const completeAnimation = () => {
            setDisplayLines(lines);
        };

        lines.forEach((line, lineIndex) => {
            let currentIndex = 0;
            const typeLine = () => {
                if (currentIndex < line.length) {
                    setDisplayLines(prev => {
                        const newLines = [...prev];
                        newLines[lineIndex] = line.substring(0, currentIndex + 1);
                        return newLines;
                    });
                    currentIndex++;
                    const randomDelay = Math.random() * speed;
                    timers.push(setTimeout(typeLine, randomDelay));
                } else {
                    completedLines++;
                    if (completedLines === lines.length) {
                        completeAnimation();
                    }
                }
            };
            const initialDelay = Math.random() * 1000;
            timers.push(setTimeout(typeLine, initialDelay));
        });

        return () => timers.forEach(clearTimeout);
    }, [text, speed, tag]);

    if (tag === 'div') {
        return (
            <div>
          {displayLines.map((line, index) => (
              <div key={index}>{line}</div>
          ))}
        </div>
        );
    } else if (tag === 'pre') {
        return (
            <pre>
          {displayLines.map((line, index) => (
              <div key={index}>{line}</div>
          ))}
        </pre>
        );
    }
};

export default TypingText;