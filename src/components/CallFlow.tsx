'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playBeep, playSelectSound } from '@/utils/audio';

interface FlowStep {
  id: string;
  name: string;
  description: string;
  ascii: string[];
}

const flowSteps: FlowStep[] = [
  {
    id: 'client',
    name: '클라이언트',
    description: 'kwt.co.kr 접속 요청',
    ascii: [
      '┌─────────────┐',
      '│   Client    │',
      '│ [Browser]   │',
      '└─────────────┘',
    ]
  },
  {
    id: 'dns',
    name: 'DNS',
    description: 'L3 Router IP 해석',
    ascii: [
      '┌─────────────┐',
      '│     DNS     │',
      '│ kwt.co.kr → │',
      '│L3 Router IP │',
      '└─────────────┘',
    ]
  },
  {
    id: 'router',
    name: 'L3 Router',
    description: 'Port Forward (80, 443)',
    ascii: [
      '┌─────────────┐',
      '│  L3 Router  │',
      '│ PortForward │',
      '│   80,443    │',
      '└─────────────┘',
    ]
  },
  {
    id: 'metallb',
    name: 'MetalLB',
    description: 'LoadBalancer',
    ascii: [
      '┌─────────────┐',
      '│   MetalLB   │',
      '│   Virtual   │',
      '│LoadBalancer │',
      '└─────────────┘',
    ]
  },
  {
    id: 'ingress',
    name: 'Ingress Nginx',
    description: '서브도메인별 라우팅',
    ascii: [
      '┌─────────────┐',
      '│   Ingress   │',
      '│    Nginx    │',
      '│  Routing    │',
      '└─────────────┘',
    ]
  },
  {
    id: 'service',
    name: '서비스',
    description: '최종 목적지 도달',
    ascii: [
      '┌─────────────┐',
      '│   Service   │',
      '│  [Target]   │',
      '│   Ready!    │',
      '└─────────────┘',
    ]
  }
];

const CallFlow: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [animationFrame, setAnimationFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedControl, setSelectedControl] = useState<'play' | 'reset' | 'back'>('play');
  const containerRef = useRef<HTMLDivElement>(null);

  // 세로 방향 애니메이션 패턴
  const verticalFlowAnimation = [
    ['│', '│', '│'],
    ['●', '│', '│'],
    ['│', '●', '│'],
    ['│', '│', '●'],
    ['│', '│', '│'],
    ['▼', '│', '│'],
    ['│', '▼', '│'],
    ['│', '│', '▼'],
  ];

  useEffect(() => {
    if (isPlaying && currentStep < flowSteps.length - 1) {
      const timer = setInterval(() => {
        setAnimationFrame((prev) => (prev + 1) % verticalFlowAnimation.length);
        
        if (animationFrame === verticalFlowAnimation.length - 1) {
          setCurrentStep((prev) => prev + 1);
          playBeep();
        }
      }, 150);

      return () => clearInterval(timer);
    } else if (currentStep >= flowSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, animationFrame, verticalFlowAnimation.length]);

  const handlePlay = useCallback(() => {
    if (currentStep === flowSteps.length - 1) {
      setCurrentStep(-1);
      setAnimationFrame(0);
    }
    setIsPlaying(true);
    playSelectSound();
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setCurrentStep(-1);
    setAnimationFrame(0);
    setIsPlaying(false);
    playBeep();
  }, []);

  const handleBack = useCallback(() => {
    router.push('/project');
  }, [router]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        playBeep();
        setSelectedControl((prev) => {
          if (prev === 'play') return 'back';
          if (prev === 'reset') return 'play';
          return 'reset';
        });
        break;
      case 'ArrowRight':
        event.preventDefault();
        playBeep();
        setSelectedControl((prev) => {
          if (prev === 'play') return 'reset';
          if (prev === 'reset') return 'back';
          return 'play';
        });
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
        if (selectedControl === 'play') handlePlay();
        else if (selectedControl === 'reset') handleReset();
        else if (selectedControl === 'back') handleBack();
        break;
      case 'Escape':
        event.preventDefault();
        handleBack();
        break;
    }
  }, [selectedControl, handlePlay, handleReset, handleBack]);

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

  const renderFlow = () => {
    return (
      <div className="flex flex-col items-center space-y-2">
        {flowSteps.map((step, index) => (
          <div key={step.id} className="w-full">
            {/* Step Row */}
            <div className="relative">
              {/* Step Box - 항상 중앙 고정 */}
              <div className="flex justify-center">
                <div className={`text-green-${currentStep >= index ? '400' : '700'} transition-colors duration-300`}>
                  <pre className="text-xs sm:text-sm">
                    {step.ascii.join('\n')}
                  </pre>
                </div>
              </div>
              
              {/* Step Info - 박스 오른쪽에 절대 위치 */}
              {currentStep >= index && (
                <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2 ml-20 text-left">
                  <div className="text-green-300 font-bold text-sm">{step.name}</div>
                  <div className="text-green-400 text-xs">{step.description}</div>
                </div>
              )}
            </div>
            
            {/* Connection Animation */}
            {index < flowSteps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center">
                  {verticalFlowAnimation[0].map((_, lineIndex) => (
                    <div key={lineIndex} className="h-2">
                      <span className={`text-green-${currentStep > index ? '400' : currentStep === index && isPlaying ? '300' : '700'} font-mono text-lg`}>
                        {currentStep === index && isPlaying 
                          ? verticalFlowAnimation[animationFrame][lineIndex]
                          : currentStep > index ? '│' : '│'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="font-mono text-xs md:text-sm lg:text-base bg-black text-green-500 p-4 min-h-screen"
      tabIndex={0}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <pre className="text-sm md:text-base lg:text-lg inline-block">
{`┌────────────────────────────────────┐
│         CALL_FLOW.TXT              │
└────────────────────────────────────┘`}
          </pre>
        </div>

        {/* Controls */}
        <div className="mb-8 flex gap-4 justify-center">
          <button
            className={`px-6 py-2 border border-green-500 ${
              selectedControl === 'play' ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={handlePlay}
            onMouseOver={() => setSelectedControl('play')}
          >
            {isPlaying ? '재생 중...' : currentStep === flowSteps.length - 1 ? '다시 재생' : '재생'}
          </button>
          <button
            className={`px-6 py-2 border border-green-500 ${
              selectedControl === 'reset' ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={handleReset}
            onMouseOver={() => setSelectedControl('reset')}
          >
            초기화
          </button>
          <button
            className={`px-6 py-2 border border-green-500 ${
              selectedControl === 'back' ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={handleBack}
            onMouseOver={() => setSelectedControl('back')}
          >
            뒤로가기
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg md:text-xl text-green-400 mb-4 text-center">
            클라이언트 → 클러스터 호출 흐름
          </h2>
          
          <div className="overflow-x-auto">
            {renderFlow()}
          </div>
        </div>

        <div className="hidden sm:block mt-6 text-center text-xs text-green-300 opacity-70">
          <div className="inline-block border border-green-300 p-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">◄ ►</span>
                  <span>버튼 선택</span>
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

export default CallFlow;