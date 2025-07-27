'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const options = ['프로젝트', '이력서', '연락하기'] as const;
type Option = typeof options[number];
const optionDescriptions: Record<Option, string> = {
  '프로젝트': '마이크로서비스 아키텍처, 쿠버네티스 인프라, 시스템 호출 구조를 확인합니다.',
  '이력서': '개발자의 경력사항과 핵심역량, 보유기술을 확인할 수 있습니다.',
  '연락하기': '궁금한 점이 있다면 문의를 남겨주세요. 메일로 답변 드리겠습니다.',
};

const mobileDescriptions: Record<Option, string> = {
  '프로젝트': '시스템 구조 확인',
  '이력서': '경력 및 기술 스택',
  '연락하기': '문의 및 연락',
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
      case '프로젝트':
        router.push('/project');
        break;
      case '이력서':
        router.push('/resume');
        break;
      case '연락하기':
        router.push('/contact');
        break;
    }
  }, [router]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
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
      case 'Escape':
        // ESC 키 처리 - 메인 페이지에서는 동작하지 않음
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

  const handleGlobalKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    if (!animationComplete) {
      setSkipAnimation(true);
    } else {
      // 애니메이션 완료 후에는 전역 키보드 이벤트 처리
      handleKeyDown(event);
    }
  }, [animationComplete, handleKeyDown]);

  const handleGlobalClick = useCallback(() => {
    if (!animationComplete) {
      setSkipAnimation(true);
    }
  }, [animationComplete]);

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [handleGlobalClick, handleGlobalKeyDown]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 자동으로 포커스 설정
    containerRef.current?.focus();
  }, []);

  return (
      <div
          id="ascii-animation"
          ref={containerRef}
          className="font-mono text-[0.3rem] xs:text-[0.4rem] sm:text-xs md:text-sm lg:text-sm whitespace-pre bg-black text-green-500 p-1 xs:p-2 sm:p-4 min-h-screen flex flex-col justify-center"
          tabIndex={0}
      >
        <div className="overflow-x-auto">
          <pre className="inline-block text-center">{displayLines.join('\n')}</pre>
        </div>
        {animationComplete && (
            <div className="mt-4 max-w-full">
              {/* 데스크톱 버전 - 기존 방식 */}
              <div className="hidden sm:block text-lg md:text-xl lg:text-2xl">
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
                <div className="mt-2 text-sm md:text-base lg:text-lg text-green-400">
                  {optionDescriptions[options[selectedOption]]}
                </div>
              </div>
              
              {/* 모바일 버전 - 메뉴와 설명 함께 표시 */}
              <div className="sm:hidden text-sm xs:text-base space-y-2">
                {options.map((option, index) => (
                    <div
                        key={option}
                        className={`cursor-pointer p-2 border-l-2 ${
                          selectedOption === index 
                            ? 'bg-green-500 text-black border-green-300' 
                            : 'border-green-700'
                        }`}
                        onClick={() => handleOptionSelect(index)}
                        onTouchStart={() => setSelectedOption(index)}
                    >
                      <div className="font-bold">
                        {selectedOption === index ? '> ' : '  '}{option}
                      </div>
                      <div className={`text-xs mt-1 ${
                        selectedOption === index ? 'text-gray-800' : 'text-green-400'
                      }`}>
                        {mobileDescriptions[option]}
                      </div>
                    </div>
                ))}
              </div>
              {/* PC/태블릿에서만 키보드 컨트롤 UI 표시 */}
              <div className="hidden sm:block mt-6 text-xs sm:text-xs md:text-sm text-green-300 opacity-70">
                <div className="inline-block border border-green-300 p-2 sm:p-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">◄ ▲ ▼ ►</span>
                      <span>이동</span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">[ENTER]</span>
                        <span>선택</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">[ESC]</span>
                        <span className="ml-2">뒤로</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AsciiAnimation;