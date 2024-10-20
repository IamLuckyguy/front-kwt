'use client';

import React, { useState, useEffect, useCallback, KeyboardEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playBeep, playSelectSound } from '@/utils/audio';

const asciiArt = [
  "                                                                                                    ",
  "                                                         ",
  "                                         +--------------+",
  "                                         |    Client    |",
  "                                         +--------------+",
  "                                                |",
  "                                                v",
  "                                   +--------------------------+",
  "                                   | Kubernetes Ingress Nginx |",
  "                                   +--------------------------+",
  "                                                |",
  "                                                v",
  "                             +------------------+--------------------+",
  "                             |                                       |",
  "                             v                                       v",
  "                     +---------------+                       +---------------+",
  "---------------------|     Front     |-----------------------|  Api-Gateway  |----------------- DMZ",
  "                     +---------------+                       +---------------+",
  "                             |                                       |",
  " +---------------+           |                                       |",
  " |    Jenkins    |           +-------------------+                   |",
  " +---------------+                               |                   |",
  "                                                 v                   |",
  "                     +---------------+   +---------------+           |",
  "                     |     Redis     |<--|      BFF      |           |",
  "                     +---------------+   +---------------+           |",
  "                                                 |                   |",
  "                             +-------------------+-------------------+",
  "                             |                   |                   |",
  "                             v                   v                   v",
  "                     +---------------+   +---------------+   +---------------+",
  "                     |   board-api   |---|  message-api  |---|   user-api    |-------- Upstream API",
  "                     +---------------+   +---------------+   +---------------+",
  "                             |                   |                   |",
  "         +-------------------+-------------------+-------------------+",
  "         |                   |                   |                   |",
  "         |                   v                   v                   v",
  "         |           +---------------+   +---------------+   +---------------+",
  "         |           |     MySQL     |   |     MySQL     |   |     MySQL     |------------ Database",
  "         |           +---------------+   +---------------+   +---------------+",
  "         v                                                                    ",
  " +---------------+   +---------------+   +---------------+   +---------------+",
  " |     Kafka     |-->|    Consumer   |-->| ElasticSearch |-->|     Kibana    |------------- Logging",
  " +---------------+   +---------------+   +---------------+   +---------------+"
];

const modulePositions = [
  { name: "client", row: 3, startCol: 42, endCol: 55 },
  { name: "kubernetes-ingress-nginx", row: 8, startCol: 36, endCol: 61 },
  { name: "front", row: 16, startCol: 22, endCol: 36 },
  { name: "api-gateway", row: 16, startCol: 62, endCol: 76 },
  { name: "jenkins", row: 20, startCol: 2, endCol: 16 },
  { name: "redis", row: 24, startCol: 22, endCol: 36 },
  { name: "bff", row: 24, startCol: 42, endCol: 56 },
  { name: "board-api", row: 31, startCol: 22, endCol: 36 },
  { name: "message-api", row: 31, startCol: 42, endCol: 56 },
  { name: "user-api", row: 31, startCol: 62, endCol: 76 },
  { name: "mysql1", row: 38, startCol: 22, endCol: 36 },
  { name: "mysql2", row: 38, startCol: 42, endCol: 56 },
  { name: "mysql3", row: 38, startCol: 62, endCol: 76 },
  { name: "kafka", row: 42, startCol: 2, endCol: 16 },
  { name: "consumer", row: 42, startCol: 22, endCol: 36 },
  { name: "elasticsearch", row: 42, startCol: 42, endCol: 56 },
  { name: "kibana", row: 42, startCol: 62, endCol: 76 },
  
];

const Explorer: React.FC = () => {
  const router = useRouter();
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [displayLines, setDisplayLines] = useState<string[]>(Array(asciiArt.length).fill(''));
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [skipAnimation, setSkipAnimation] = useState<boolean>(false);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedModuleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let completedLines = 0;

    const completeAnimation = () => {
      setDisplayLines(asciiArt);
      setAnimationComplete(true);
      timers.forEach(clearTimeout);
    };

    if (skipAnimation) {
      completeAnimation();
      return;
    }

    asciiArt.forEach((line, lineIndex) => {
      let currentIndex = 0;
      const typeLine = () => {
        if (currentIndex < line.length) {
          setDisplayLines(prev => {
            const newLines = [...prev];
            newLines[lineIndex] = line.substring(0, currentIndex + 1);
            return newLines;
          });
          currentIndex++;
          const randomDelay = Math.random() * 10 + 5;
          timers.push(setTimeout(typeLine, randomDelay));
        } else {
          completedLines++;
          if (completedLines === asciiArt.length) {
            setAnimationComplete(true);
          }
        }
      };
      const initialDelay = Math.random() * 600;
      timers.push(setTimeout(typeLine, initialDelay));
    });

    return () => timers.forEach(clearTimeout);
  }, [skipAnimation]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }

    if (selectedModuleRef.current && containerRef.current) {
      const container = containerRef.current;
      const selectedElement = selectedModuleRef.current;

      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();

      if (selectedRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - selectedRect.top;
      } else if (selectedRect.bottom > containerRect.bottom) {
        container.scrollTop += selectedRect.bottom - containerRect.bottom;
      }
    }
  }, [selectedModuleIndex]);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (!animationComplete) {
        setSkipAnimation(true);
        return;
      }
    };

    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [animationComplete]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!animationComplete) {
      setSkipAnimation(true);
      return;
    }

    event.preventDefault();

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        setSelectedModuleIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : modulePositions.length - 1;
          playBeep();
          return newIndex;
        });
        break;
      case 'ArrowDown':
      case 'ArrowRight':
      case 'Tab':
        setSelectedModuleIndex((prev) => {
          const newIndex = prev < modulePositions.length - 1 ? prev + 1 : 0;
          playBeep();
          return newIndex;
        });
        break;
      case 'Enter':
      case ' ':
        playSelectSound();
        const selectedModule = modulePositions[selectedModuleIndex].name;
        router.push(`/explorer/${selectedModule}`);
        break;
      default:
        break;
    }
  }, [animationComplete, selectedModuleIndex, router]);

  const handleClick = (index: number) => {
    playSelectSound();
    setSelectedModuleIndex(index);
    const selectedModule = modulePositions[index].name;
    router.push(`/explorer/${selectedModule}`);
  };

  const handleMouseOver = useCallback((moduleName: string) => {
    if (hoveredModule !== moduleName) {
      setHoveredModule(moduleName);
      playBeep();
      setSelectedModuleIndex((prevIndex) => {
        const newIndex = modulePositions.findIndex(m => m.name === moduleName);
        return newIndex !== -1 ? newIndex : prevIndex;
      });
    }
  }, [hoveredModule, setSelectedModuleIndex]);

  return (
    <div 
      ref={containerRef} 
      className="font-mono text-[0.35rem] xs:text-[0.45rem] sm:text-xs md:text-sm lg:text-base bg-black text-green-500 p-1 xs:p-2 sm:p-4 h-screen overflow-auto" 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div id={'ascii-art'}>
        <h1 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4">둘러보기</h1>
        <div>
          <pre className="explorer-ascii-art">
            {displayLines.map((line, rowIndex) => (
              <div key={rowIndex} style={{ whiteSpace: 'pre' }}>
                {line && line.split('').map((char, colIndex) => {
                  const moduleItem = modulePositions.find(
                    m => m.row === rowIndex && colIndex >= m.startCol && colIndex <= m.endCol
                  );
                  const isSelected = moduleItem && modulePositions.findIndex(m => m.name === moduleItem.name) === selectedModuleIndex;
                  return (
                    <span
                      key={colIndex}
                      ref={isSelected ? selectedModuleRef : null}
                      style={{
                        color: isSelected ? 'black' : 'inherit',
                        backgroundColor: isSelected ? 'green' : 'transparent',
                        cursor: moduleItem ? 'pointer' : 'default'
                      }}
                      onMouseOver={() => {
                        if (moduleItem) {
                          handleMouseOver(moduleItem.name);
                        }
                      }}
                      onClick={() => {
                        if (moduleItem) {
                          handleClick(modulePositions.findIndex(m => m.name === moduleItem.name));
                        }
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Explorer;