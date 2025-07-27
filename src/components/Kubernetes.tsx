'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import { playBeep, playSelectSound } from '@/utils/audio';

const kubernetesData = {
  cluster: {
    name: "KWT 쿠버네티스 클러스터",
    totalNodes: 7,
    masterNodes: 3,
    workerNodes: 4
  },
  masterNodes: [
    { name: "control-plane0", arch: "amd64", cpu: "4core", ram: "16Gi", volume: "500Gi" },
    { name: "control-plane1", arch: "amd64", cpu: "4core", ram: "16Gi", volume: "500Gi" },
    { name: "control-plane2", arch: "amd64", cpu: "4core", ram: "16Gi", volume: "500Gi" }
  ],
  workerNodes: [
    { name: "worker0", arch: "amd64", cpu: "4core", ram: "16Gi", volume: "500Gi" },
    { name: "worker1", arch: "amd64", cpu: "4core", ram: "16Gi", volume: "500Gi" },
    { name: "worker2", arch: "amd64", cpu: "4core", ram: "16Gi", volume: "500Gi" },
    { name: "worker3", arch: "amd64", cpu: "8core", ram: "32Gi", volume: "1000Gi" }
  ],
  infrastructure: {
    external: {
      title: "외부 연결",
      components: [
        { name: "L3 라우터", description: "외부 인터넷 연결 및 도메인 관리" },
        { name: "Port Forward", description: "외부 트래픽을 L7 로드밸런서(MetalLB)로 라우팅" }
      ]
    },
    services: {
      title: "클러스터 서비스",
      components: [
        { name: "Ingress Nginx Controller", description: "외부 트래픽 라우팅" },
        { name: "Jenkins", description: "CI/CD 파이프라인 관리" },
        { name: "Nexus", description: "아티팩트 및 컨테이너 레지스트리" },
        { name: "API Gateway", description: "마이크로서비스 API 통합 관리" }
      ]
    },
    infrastructure: {
      title: "데이터 인프라",
      components: [
        { name: "MySQL InnoDB Cluster & MySQL Router", description: "고가용성 관계형 데이터베이스" },
        { name: "MongoDB Replica Set", description: "분산 문서 데이터베이스" },
        { name: "Kafka", description: "분산 이벤트 스트리밍 플랫폼" },
        { name: "Redis Sentinel", description: "고가용성 인메모리 캐시 및 세션 스토어" }
      ]
    },
    plugins: {
      title: "플러그인",
      components: [
        { name: "Calico", description: "컨테이너 네트워킹 및 보안 정책" },
        { name: "MetalLB", description: "베어메탈 환경 로드밸런서" },
        { name: "Longhorn", description: "분산 블록 스토리지" }
      ]
    },
    monitoring: {
      title: "모니터링",
      components: [
        { name: "Grafana", description: "데이터 시각화 및 대시보드" },
        { name: "Loki+Promtail", description: "로그 관리" },
        { name: "Prometheus", description: "메트릭 모니터링" }
      ]
    },
    applications: {
      title: "어플리케이션",
      components: [
        { name: "Exchange", description: "환율 계산, 변화 추이 확인" },
        { name: "Salary", description: "연봉 실수령액 조회" }
      ]
    }
  }
};

const Kubernetes: React.FC = () => {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<'overview' | 'nodes' | 'services'>('overview');
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttons = ['overview', 'nodes', 'services', 'back'] as const;

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        playBeep();
        setSelectedButtonIndex((prev) => (prev > 0 ? prev - 1 : buttons.length - 1));
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        playBeep();
        setSelectedButtonIndex((prev) => (prev < buttons.length - 1 ? prev + 1 : 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        playSelectSound();
        const selectedButton = buttons[selectedButtonIndex];
        if (selectedButton === 'back') {
          router.push('/');
        } else {
          setCurrentSection(selectedButton as 'overview' | 'nodes' | 'services');
        }
        break;
      case 'Escape':
        event.preventDefault();
        playBeep();
        router.push('/project');
        break;
    }
  }, [selectedButtonIndex, router]);

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
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const getSectionTitle = () => {
    switch(currentSection) {
      case 'overview': return '클러스터 개요';
      case 'nodes': return '노드 구성';
      case 'services': return '서비스 구조';
    }
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* 데스크톱 버전 */}
      <div className="hidden md:block border border-green-500 p-4">
        <pre className="text-green-400 text-sm">
{`
┌─────────────────────────────────────────────────────────────┐
│                    KWT Kubernetes Cluster                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           [L3 Router] ──── Port Forward                     │
│               │                                             │
│               └─────[Kubernetes Cluster]                    │
│                           │                                 │
│                      [Ingress Nginx]                        │
│                           │                                 │
│    ┌──────────┬────────────┬─────────────┐                  │
│    │          │            │             │                  │
│ [Services] [Applications] [Monitoring] [Infrastructure]     │
│    │          │            │             │                  │
│ • Jenkins  • Exchange   • Grafana     • MySQL               │
│ • Nexus    • Salary     • Loki        • MongoDB             │
│ • API GW                • Prometheus  • Kafka               │
│                                       • Redis               │
│                                                             │
└─────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>
      
      {/* 모바일 버전 */}
      <div className="md:hidden border border-green-500 p-2">
        <pre className="text-green-400 text-[0.6rem] overflow-x-auto">
{`┌──────────────────────────┐
│   KWT K8s Cluster        │
├──────────────────────────┤
│    [L3 Router/DDNS]      │
│            │             │
│       [K8s Cluster]      │
│            │             │
│      [Ingress Nginx]     │
│    ┌───┬───┬───┬───┐     │
│    │   │   │   │   │     │
│ [Svc][App][Mon][Infra]   │
│                          │
│ Services:                │
│ • Jenkins                │
│ • Nexus                  │
│ • API Gateway            │
│                          │
│ Apps:                    │
│ • Exchange               │
│ • Salary                 │
│                          │
│ Monitoring:              │
│ • Grafana                │
│ • Loki+Promtail          │
│ • Prometheus             │
│                          │
│ Infrastructure:          │
│ • MySQL                  │
│ • MongoDB                │
│ • Kafka                  │
│ • Redis                  │
└──────────────────────────┘`}
        </pre>
      </div>
      
      <div className="border border-green-500 p-3">
        <div className="text-green-400 font-bold mb-2">클러스터 요약</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="text-green-300">총 노드 수: {kubernetesData.cluster.totalNodes}개</div>
          <div className="text-green-300">마스터 노드: {kubernetesData.cluster.masterNodes}개</div>
          <div className="text-green-300">워커 노드: {kubernetesData.cluster.workerNodes}개</div>
          <div className="text-green-300">아키텍처: AMD64</div>
        </div>
      </div>
    </div>
  );

  const renderNodes = () => (
    <div className="space-y-4">
      <div className="border border-green-500 p-3">
        <div className="text-green-400 font-bold mb-3">▸ 마스터 노드 ({kubernetesData.cluster.masterNodes}개)</div>
        <div className="space-y-2 pl-4">
          {kubernetesData.masterNodes.map((node, index) => (
            <div key={index} className="border border-green-400 p-2 bg-green-950 bg-opacity-20">
              <div className="text-green-300 font-mono text-sm">{node.name}</div>
              <div className="text-green-200 text-xs mt-1">
                {node.arch} | CPU: {node.cpu} | RAM: {node.ram} | Volume: {node.volume}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-green-500 p-3">
        <div className="text-green-400 font-bold mb-3">▸ 워커 노드 ({kubernetesData.cluster.workerNodes}개)</div>
        <div className="space-y-2 pl-4">
          {kubernetesData.workerNodes.map((node, index) => (
            <div key={index} className="border border-green-400 p-2 bg-green-950 bg-opacity-20">
              <div className="text-green-300 font-mono text-sm">{node.name}</div>
              <div className="text-green-200 text-xs mt-1">
                {node.arch} | CPU: {node.cpu} | RAM: {node.ram} | Volume: {node.volume}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-4">
      {Object.entries(kubernetesData.infrastructure).map(([key, section], index) => (
        <div key={index} className="border border-green-500 p-3">
          <div className="text-green-400 font-bold mb-3">▸ {section.title}</div>
          <div className="space-y-2 pl-4">
            {section.components.map((component, compIndex) => (
              <div key={compIndex} className="border border-green-400 p-2 bg-green-950 bg-opacity-10">
                <div className="text-green-300 font-bold text-sm">{component.name}</div>
                <div className="text-green-200 text-xs mt-1">{component.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSection = () => {
    switch(currentSection) {
      case 'overview': return renderOverview();
      case 'nodes': return renderNodes();
      case 'services': return renderServices();
    }
  };

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
│        KUBERNETES_CLUSTER.TXT      │
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
              setCurrentSection('overview');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(0);
            }}
          >
            클러스터 개요
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 1 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              setCurrentSection('nodes');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(1);
            }}
          >
            노드 구성
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 2 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              setCurrentSection('services');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(2);
            }}
          >
            서비스 구조
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 3 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              router.push('/project');
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
          <div className="mb-4 text-green-400">
            <pre className="text-base md:text-lg lg:text-xl inline-block">
{`┌─ ${getSectionTitle()} ─┐`}
            </pre>
          </div>
          {renderSection()}
        </div>

        <div className="hidden sm:block mt-6 text-center text-xs text-green-300 opacity-70">
          <div className="inline-block border border-green-300 p-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base">◄ ► ▲ ▼</span>
                <span>이동</span>
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

export default Kubernetes;