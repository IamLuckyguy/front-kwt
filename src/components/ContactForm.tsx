'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleBack = () => {
    router.push('/');
  };

  const handleSubmit = () => {
    // 여기에 실제 이메일 전송 로직을 구현합니다.
    setSubmitted(true);
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Tab' && !isComposing) {
      event.preventDefault();
      if (event.shiftKey) {
        // Shift+Tab 키 처리
        setSelectedField(prev => {
          if (prev === 'back') return 'sendMail';
          if (prev === 'sendMail') return 'content';
          if (prev === 'content') return 'subject';
          if (prev === 'subject') return 'from';
          return 'back';
        });
      } else {
        // Tab 키 처리
        setSelectedField(prev => {
          if (prev === 'from') return 'subject';
          if (prev === 'subject') return 'content';
          if (prev === 'content') return 'sendMail';
          if (prev === 'sendMail') return 'back';
          return 'from';
        });
      }
    } else if (event.key === 'Enter' && !isComposing) {
      if (selectedField === 'sendMail') {
        handleSubmit();
      } else if (selectedField === 'back') {
        handleBack();
      }
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

  const handleFieldClick = (field: 'from' | 'subject' | 'content') => {
    setSelectedField(field);
  };

  const handleMouseOver = (field: 'sendMail' | 'back') => {
    setSelectedField(field);
  };

  if (submitted) {
    return (
      <div className="font-mono text-green-500 bg-black p-4 h-screen">
        <h1 className="text-2xl mb-4">Your email has been sent successfully.</h1>
        <p>Your message has been sent to kwt@kwt.co.kr</p>
        <p className="mt-4">Redirecting to main page in {countdown} seconds...</p>
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
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          className={`bg-black border ${selectedField === 'from' ? 'border-green-500' : 'border-gray-700'} p-2 w-full`}
          style={{ outline: 'none' }}
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
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          className={`bg-black border ${selectedField === 'subject' ? 'border-green-500' : 'border-gray-700'} p-2 w-full`}
          style={{ outline: 'none' }}
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
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          className={`bg-black border ${selectedField === 'content' ? 'border-green-500' : 'border-gray-700'} p-2 w-full h-40`}
          style={{ outline: 'none' }}
        />
      </div>
      <div className="flex space-x-4">
        <button
          ref={sendMailRef}
          onClick={handleSubmit}
          onKeyDown={handleKeyDown}
          onMouseOver={() => handleMouseOver('sendMail')}
          className={`px-4 py-2 ${
            selectedField === 'sendMail'
              ? 'bg-green-500 text-black'
              : 'bg-black text-green-500 border border-green-500'
          }`}
          style={{ outline: 'none' }}
        >
          메일 보내기
        </button>
        <button
          ref={backRef}
          onClick={handleBack}
          onKeyDown={handleKeyDown}
          onMouseOver={() => handleMouseOver('back')}
          className={`px-4 py-2 ${
            selectedField === 'back'
              ? 'bg-green-500 text-black'
              : 'bg-black text-green-500 border border-green-500'
          }`}
          style={{ outline: 'none' }}
        >
          뒤로
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
