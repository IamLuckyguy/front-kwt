'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const ContactForm: React.FC = () => {
  const router = useRouter();
  const fromRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const sendMailRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedField, setSelectedField] = useState<'from' | 'subject' | 'content' | 'sendMail' | 'back'>('from');
  const [submitted, setSubmitted] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fingerprint, setFingerprint] = useState('');
  const [animationStep, setAnimationStep] = useState(0);

  const handleBack = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSubmit = useCallback(async () => {
    // 이미 로딩 중이면 중복 제출 방지
    if (isLoading) return;
    
    setError('');
    
    // Validation
    if (!from.trim() || !subject.trim() || !content.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: from,
          subject,
          content,
          fingerprint,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '이메일 전송에 실패했습니다.');
      }
      
      setSubmitted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : '이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [from, subject, content, fingerprint, isLoading]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement> | globalThis.KeyboardEvent) => {
    if (event.key === 'Tab' && !isComposing) {
      // Tab 키는 브라우저 기본 동작을 사용하도록 preventDefault 제거
      // 대신 focus 이벤트로 selectedField를 업데이트
    } else if (event.key === 'Enter' && !isComposing) {
      if (selectedField === 'sendMail') {
        handleSubmit();
      } else if (selectedField === 'back') {
        handleBack();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleBack();
    }
  }, [isComposing, selectedField, handleSubmit, handleBack]);

  useEffect(() => {
    // 선택된 필드에 따라 포커스 설정
    if (selectedField === 'from') fromRef.current?.focus();
    else if (selectedField === 'subject') subjectRef.current?.focus();
    else if (selectedField === 'content') contentRef.current?.focus();
    else if (selectedField === 'sendMail') sendMailRef.current?.focus();
    else if (selectedField === 'back') backRef.current?.focus();
  }, [selectedField]);

  useEffect(() => {
    if (submitted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (submitted && countdown === 0) {
      router.push('/');
    }
  }, [submitted, countdown, router]);

  useEffect(() => {
    if (submitted && animationStep < 25) {
      const timer = setTimeout(() => {
        setAnimationStep(animationStep + 1);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [submitted, animationStep]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // Initialize fingerprint
    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (error) {
        console.error('Fingerprint initialization failed:', error);
        setFingerprint(Date.now().toString()); // Fallback
      }
    };
    
    initFingerprint();
  }, []);

  const handleFieldClick = (field: 'from' | 'subject' | 'content') => {
    setSelectedField(field);
  };

  const handleMouseOver = (field: 'sendMail' | 'back') => {
    setSelectedField(field);
  };

  if (submitted) {
    // 애니메이션 프레임 생성
    const generateFrame = (step: number) => {
      const totalLength = 20;
      const trail = '━'.repeat(Math.min(step, totalLength));
      const remaining = ' '.repeat(Math.max(0, totalLength - step));
      
      if (step > totalLength) {
        return '━━━━━━━━━━━━━━━━━━━━';
      }
      
      return trail + '📧' + remaining;
    };

    return (
      <div className="font-mono text-green-500 bg-black p-4 h-screen flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <pre className="text-xs sm:text-sm md:text-base mb-8">
{`┌─────────────────────────────────────────────┐
│         이메일 전송 완료                    │
└─────────────────────────────────────────────┘`}
          </pre>
          
          <div className="mb-8">
            {/* 데스크톱 버전 */}
            <div className="hidden sm:flex items-center justify-center mb-4">
              <div className="text-xs sm:text-sm">
                <div className="border border-green-500 p-2 min-w-[120px]">
                  <div className="truncate">{from}</div>
                </div>
                <div className="text-green-300 mt-1">보낸이</div>
              </div>
              
              <div className="mx-4 text-lg sm:text-xl font-mono" style={{ minWidth: '350px' }}>
                <span className="text-green-300">
                  {animationStep <= 20 ? generateFrame(animationStep) : '━━━━━━━━━━━━━━━━━━━━'}
                </span>
              </div>
              
              <div className="text-xs sm:text-sm">
                <div className="border border-green-500 p-2 min-w-[120px]">
                  kwt@kwt.co.kr {animationStep > 20 && '📬'}
                </div>
                <div className="text-green-300 mt-1">받는이</div>
              </div>
            </div>
            
            {/* 모바일 버전 - 세로 레이아웃 */}
            <div className="sm:hidden space-y-3">
              <div className="text-xs text-center">
                <div className="border border-green-500 p-2 mx-auto max-w-[200px]">
                  <div className="truncate">{from}</div>
                </div>
                <div className="text-green-300 mt-1">보낸이</div>
              </div>
              
              <div className="text-sm font-mono text-center px-4 my-4">
                <div className="flex flex-col items-center space-y-1">
                  {animationStep <= 20 ? (
                    <>
                      <span className="text-green-300">{animationStep > 0 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 2 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 4 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 6 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 8 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 10 ? '┃' : ' '}</span>
                      <span className={animationStep > 12 ? 'text-green-300' : ''}>
                        {animationStep > 14 ? '┃' : animationStep > 12 ? '📧' : ' '}
                      </span>
                      <span className="text-green-300">{animationStep > 16 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 18 ? '┃' : ' '}</span>
                      <span className="text-green-300">{animationStep > 20 ? '▼' : ' '}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">┃</span>
                      <span className="text-green-300">▼</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-center">
                <div className="border border-green-500 p-2 mx-auto max-w-[200px]">
                  kwt@kwt.co.kr {animationStep > 20 && '📬'}
                </div>
                <div className="text-green-300 mt-1">받는이</div>
              </div>
            </div>
            
            {animationStep > 20 && (
              <div className="animate-pulse text-green-400 text-sm sm:text-base">
                ✓ 메일이 성공적으로 전송되었습니다
              </div>
            )}
          </div>
          
          <div className="border border-green-500 p-4 bg-green-950 bg-opacity-20">
            <p className="text-sm sm:text-base mb-2">제목: {subject}</p>
            <p className="text-xs sm:text-sm text-green-300">
              {countdown}초 후 메인 페이지로 이동합니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono text-green-500 bg-black p-4 h-screen">
      <h1 className="text-2xl mb-4">연락하기</h1>
      <div className="mb-4">
        <p>받는사람: kwt@kwt.co.kr</p>
      </div>
      <div className="mb-4">
        <label htmlFor="from" className="block mb-2">보내는사람:</label>
        <input
          ref={fromRef}
          id="from"
          type="email"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          onClick={() => handleFieldClick('from')}
          onFocus={() => setSelectedField('from')}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          className={`bg-black border ${selectedField === 'from' ? 'border-green-500' : 'border-gray-700'} p-2 w-full`}
          style={{ outline: 'none' }}
          tabIndex={1}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subject" className="block mb-2">제목:</label>
        <input
          ref={subjectRef}
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onClick={() => handleFieldClick('subject')}
          onFocus={() => setSelectedField('subject')}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          className={`bg-black border ${selectedField === 'subject' ? 'border-green-500' : 'border-gray-700'} p-2 w-full`}
          style={{ outline: 'none' }}
          tabIndex={2}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block mb-2">내용:</label>
        <textarea
          ref={contentRef}
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={() => handleFieldClick('content')}
          onFocus={() => setSelectedField('content')}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          className={`bg-black border ${selectedField === 'content' ? 'border-green-500' : 'border-gray-700'} p-2 w-full h-40`}
          style={{ outline: 'none' }}
          tabIndex={3}
        />
      </div>
      <div className="flex space-x-4">
        <button
          ref={sendMailRef}
          onClick={handleSubmit}
          onKeyDown={handleKeyDown}
          onFocus={() => setSelectedField('sendMail')}
          onMouseOver={() => handleMouseOver('sendMail')}
          disabled={isLoading}
          className={`px-4 py-2 ${
            selectedField === 'sendMail'
              ? 'bg-green-500 text-black'
              : 'bg-black text-green-500 border border-green-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ outline: 'none' }}
          tabIndex={4}
        >
          {isLoading ? '전송 중...' : '메일 보내기'}
        </button>
        <button
          ref={backRef}
          onClick={handleBack}
          onKeyDown={handleKeyDown}
          onFocus={() => setSelectedField('back')}
          onMouseOver={() => handleMouseOver('back')}
          className={`px-4 py-2 ${
            selectedField === 'back'
              ? 'bg-green-500 text-black'
              : 'bg-black text-green-500 border border-green-500'
          }`}
          style={{ outline: 'none' }}
          tabIndex={5}
        >
          뒤로
        </button>
      </div>
      {error && (
        <div className="mt-4 p-3 border border-red-500 bg-red-900 bg-opacity-20 text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default ContactForm;
