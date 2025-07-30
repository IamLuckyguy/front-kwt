'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { playBeep, playSelectSound } from '@/utils/audio';

const Project: React.FC = () => {
  const router = useRouter();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttons = useMemo(() => ['explorer', 'kubernetes', 'callflow', 'back'] as const, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        playBeep();
        setSelectedButtonIndex((prev) => (prev > 0 ? prev - 1 : buttons.length - 1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        playBeep();
        setSelectedButtonIndex((prev) => (prev < buttons.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        window.scrollBy(0, -100);
        break;
      case 'ArrowDown':
        event.preventDefault();
        window.scrollBy(0, 100);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        playSelectSound();
        const selectedButton = buttons[selectedButtonIndex];
        if (selectedButton === 'back') {
          router.push('/');
        } else if (selectedButton === 'explorer') {
          router.push('/explorer');
        } else if (selectedButton === 'kubernetes') {
          router.push('/kubernetes');
        } else if (selectedButton === 'callflow') {
          router.push('/call-flow');
        }
        break;
      case 'Escape':
        event.preventDefault();
        playBeep();
        router.push('/');
        break;
    }
  }, [selectedButtonIndex, router, buttons]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      handleKeyDown(event);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="font-mono text-xs md:text-sm lg:text-base bg-black text-green-500 p-4 min-h-screen"
      tabIndex={0}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <pre className="text-sm md:text-base lg:text-lg inline-block">
{`┌────────────────────────────────────┐
│         PROJECT.TXT                │
└────────────────────────────────────┘`}
          </pre>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-2 sm:gap-4 justify-center">
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 0 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              router.push('/explorer');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(0);
            }}
          >
            둘러보기
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 1 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              router.push('/kubernetes');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(1);
            }}
          >
            쿠버네티스
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 2 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              router.push('/call-flow');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(2);
            }}
          >
            호출구조
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 3 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              router.push('/');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(3);
            }}
          >
            뒤로가기
          </button>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border border-green-500 p-4 cursor-pointer transition-all ${
              selectedButtonIndex === 0 ? 'bg-green-500 bg-opacity-20' : ''
            }`}
              onClick={() => {
                playSelectSound();
                router.push('/explorer');
              }}
              onMouseOver={() => {
                playBeep();
                setSelectedButtonIndex(0);
              }}
            >
              <h3 className="text-green-400 font-bold mb-2">마이크로서비스 아키텍처</h3>
              <p className="text-green-300 text-sm">
                API Gateway, BFF, 백엔드 서비스들의 구조와 연결 관계를 시각적으로 확인할 수 있습니다.
              </p>
            </div>

            <div className={`border border-green-500 p-4 cursor-pointer transition-all ${
              selectedButtonIndex === 1 ? 'bg-green-500 bg-opacity-20' : ''
            }`}
              onClick={() => {
                playSelectSound();
                router.push('/kubernetes');
              }}
              onMouseOver={() => {
                playBeep();
                setSelectedButtonIndex(1);
              }}
            >
              <h3 className="text-green-400 font-bold mb-2">쿠버네티스 인프라</h3>
              <p className="text-green-300 text-sm">
                클러스터 구성, 노드 정보, 서비스 배포 현황 등 인프라 전반을 살펴볼 수 있습니다.
              </p>
            </div>

            <div className={`border border-green-500 p-4 cursor-pointer transition-all ${
              selectedButtonIndex === 2 ? 'bg-green-500 bg-opacity-20' : ''
            }`}
              onClick={() => {
                playSelectSound();
                router.push('/call-flow');
              }}
              onMouseOver={() => {
                playBeep();
                setSelectedButtonIndex(2);
              }}
            >
              <h3 className="text-green-400 font-bold mb-2">시스템 호출 구조</h3>
              <p className="text-green-300 text-sm">
                클라이언트 요청이 클러스터까지 도달하는 전체 과정을 애니메이션으로 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:block mt-6 text-center text-xs text-green-300 opacity-70">
          <div className="inline-block border border-green-300 p-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">◄ ►</span>
                  <span>메뉴 선택</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">▲ ▼</span>
                  <span>스크롤</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono">[ENTER]</span>
                  <span>선택</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">[ESC]</span>
                  <span>뒤로</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;