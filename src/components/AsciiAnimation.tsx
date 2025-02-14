'use client';

import React, { useState, useEffect, useCallback, KeyboardEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playBeep, playSelectSound } from '@/utils/audio';

const asciiArt = `
888    d8P  888       888 88888888888      .d8888b.   .d88888b.      888    d8P  8888888b. 
888   d8P   888   o   888     888         d88P  Y88b d88P" "Y88b     888   d8P   888   Y88b
888  d8P    888  d8b  888     888         888    888 888     888     888  d8P    888    888
888d88K     888 d888b 888     888         888        888     888     888d88K     888   d88P
8888888b    888d88888b888     888         888        888     888     8888888b    8888888P" 
888  Y88b   88888P Y88888     888         888    888 888     888     888  Y88b   888 T88b  
888   Y88b  8888P   Y8888     888     d8b Y88b  d88P Y88b. .d88P d8b 888   Y88b  888  T88b 
888    Y88b 888P     Y888     888     Y8P  "Y8888P"   "Y88888P"  Y8P 888    Y88b 888   T88b
`.trim().split('\n');

const options = ['권한받기', '인증하기', '둘러보기', '연락하기'] as const;
type Option = typeof options[number];
const optionDescriptions: Record<Option, string> = {
  '권한받기': '아키텍쳐의 자세한 기능 조회, 테스트 권한을 신청할 수 있습니다.',
  '인증하기': '권한을 부여 받은 분은 인증을 해주시면 됩니다.',
  '둘러보기': '현재 웹사이트의 아키텍쳐를 확인 할 수 있습니다.',
  '연락하기': '궁금한 점이 있다면 문의를 남겨주세요. 메일로 답변 드리겠습니다.',
};

const AsciiAnimation: React.FC = () => {
  const router = useRouter();
  const [displayLines, setDisplayLines] = useState<string[]>(Array(asciiArt.length).fill(''));
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [skipAnimation, setSkipAnimation] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleOptionSelect = useCallback((index: number) => {
    playSelectSound();
    switch (options[index]) {
      case '권한받기':
        router.push('/request-permission');
        break;
      case '인증하기':
        router.push('/authenticate');
        break;
      case '둘러보기':
        router.push('/explorer');
        break;
      case '연락하기':
        router.push('/contact');
        break;
    }
  }, [options, router]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (!animationComplete) {
      setSkipAnimation(true);
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        playBeep();
        setSelectedOption((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'ArrowDown':
        playBeep();
        setSelectedOption((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case 'Enter':
      case ' ':
        playSelectSound();
        handleOptionSelect(selectedOption);
        break;
    }
  }, [animationComplete, selectedOption, handleOptionSelect]);

  const handleMouseOver = useCallback((index: number) => {
    if (hoveredIndex !== index) {
      playBeep();
      setHoveredIndex(index);
      setSelectedOption(index);
    }
  }, [hoveredIndex]);

  const containerRef = useRef<HTMLDivElement>(null);

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
          const randomDelay = Math.random() * 30 + 10;
          timers.push(setTimeout(typeLine, randomDelay));
        } else {
          completedLines++;
          if (completedLines === asciiArt.length) {
            setAnimationComplete(true);
          }
        }
      };
      const initialDelay = Math.random() * 1000;
      timers.push(setTimeout(typeLine, initialDelay));
    });

    return () => timers.forEach(clearTimeout);
  }, [skipAnimation]);

  useEffect(() => {
    const handleGlobalKeyDown = () => {
      if (!animationComplete) {
        setSkipAnimation(true);
      }
    };

    const handleGlobalClick = () => {
      if (!animationComplete) {
        setSkipAnimation(true);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [animationComplete]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 자동으로 포커스 설정
    containerRef.current?.focus();
  }, []);

  return (
      <div
          id="ascii-animation"
          ref={containerRef}
          className="font-mono text-[0.3rem] xs:text-[0.4rem] sm:text-xs md:text-sm lg:text-sm whitespace-pre bg-black text-green-500 p-1 xs:p-2 sm:p-4"
          tabIndex={0}
          onKeyDown={handleKeyDown}
      >
        <div className="overflow-x-auto">
          <pre className="inline-block text-center">{displayLines.join('\n')}</pre>
        </div>
        {animationComplete && (
            <div className="mt-4 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl">
              {options.map((option, index) => (
                  <div
                      key={option}
                      className={`cursor-pointer ${selectedOption === index ? 'bg-green-500 text-black' : ''}`}
                      onClick={() => handleOptionSelect(index)}
                      onMouseOver={() => handleMouseOver(index)}
                  >
                    {selectedOption === index ? '> ' : '  '}{option}
                  </div>
              ))}
              <div className="mt-2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-green-400">
                {optionDescriptions[options[selectedOption]]}
              </div>
            </div>
        )}
      </div>
  );
};

export default AsciiAnimation;