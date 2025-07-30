'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playBeep, playSelectSound } from '@/utils/audio';

interface TreeNode {
  id: string;
  name: string;
  type: 'namespace' | 'service' | 'deployment' | 'statefulset' | 'ingress' | 'folder';
  children?: TreeNode[];
  details?: string;
  replicas?: string;
  status?: string;
}

const kubernetesTree: TreeNode = {
  id: 'cluster',
  name: 'KWT Kubernetes Cluster',
  type: 'folder',
  children: [
    {
      id: 'ingress',
      name: 'Ingress Layer',
      type: 'folder',
      children: [
        {
          id: 'kwt-co-kr-ingress-ns',
          name: 'kwt-co-kr-ingress',
          type: 'namespace',
          children: [
            { id: 'kwt-co-kr', name: 'kwt.co.kr', type: 'ingress', details: '→ kwt-prod/front' },
            { id: 'kwt-co-kr-sub', name: '*.kwt.co.kr', type: 'ingress', details: '→ service' },
          ]
        },
        {
          id: 'corpbreak-ingress-ns',
          name: 'corpbreak-* ingress',
          type: 'namespace',
          children: [
            { id: 'corpbreak-com', name: 'corpbreak.com', type: 'ingress' },
            { id: 'corpbreak-com-sub', name: '*.corpbreak.com', type: 'ingress' },
            { id: 'corpbreak-co-kr', name: 'corpbreak.co.kr', type: 'ingress' },
            { id: 'corpbreak-co-kr-sub', name: '*.corpbreak.co.kr', type: 'ingress' },
          ]
        },
        {
          id: 'yumyum-ingress-ns',
          name: 'yumyum-im-ingress',
          type: 'namespace',
          children: [
            { id: 'yumyum-im', name: 'yumyum.im', type: 'ingress' },
            { id: 'yumyum-im-sub', name: '*.yumyum.im', type: 'ingress' },
          ]
        }
      ]
    },
    {
      id: 'applications',
      name: 'Applications',
      type: 'folder',
      children: [
        {
          id: 'kwt-dev-ns',
          name: 'kwt-dev',
          type: 'namespace',
          children: [
            {
              id: 'kwt-dev-frontend',
              name: 'Frontend',
              type: 'folder',
              children: [
                { id: 'front-green-dev', name: 'front', type: 'deployment', status: 'Running', replicas: '1/1', details: 'Next.js 프론트엔드' },
              ]
            },
            {
              id: 'kwt-dev-backend',
              name: 'Backend Services',
              type: 'folder',
              children: [
                { id: 'api-gateway', name: 'api-gateway', type: 'deployment', status: 'Running', replicas: '1/1', details: 'API Gateway' },
                { id: 'member-api', name: 'member-api', type: 'deployment', status: 'Running', replicas: '1/1', details: '회원 서비스' },
                { id: 'board-api', name: 'board-api', type: 'deployment', status: 'Running', replicas: '1/1', details: '게시판 서비스' },
                { id: 'message-api', name: 'message-api', type: 'deployment', status: 'Running', replicas: '1/1', details: '메시지 서비스' },
                { id: 'message-agent', name: 'message-agent', type: 'deployment', status: 'Running', replicas: '1/1', details: '메시지 에이전트' },
              ]
            },
            {
              id: 'kwt-dev-apps',
              name: 'Applications',
              type: 'folder',
              children: [
                { id: 'exchange-dev', name: 'exchange', type: 'deployment', status: 'Running', replicas: '1/1', details: '환율 계산기' },
                { id: 'givemesalary-dev', name: 'givemesalary', type: 'deployment', status: 'Running', replicas: '1/1', details: '연봉 계산기' },
                { id: 'dev-portal-dev', name: 'dev-portal', type: 'deployment', status: 'Running', replicas: '1/1', details: '개발 도구 포털' },
              ]
            },
          ]
        },
        {
          id: 'kwt-prod-ns',
          name: 'kwt-prod',
          type: 'namespace',
          children: [
            {
              id: 'kwt-prod-frontend',
              name: 'Frontend',
              type: 'folder',
              children: [
                { id: 'front-green-prod', name: 'front', type: 'deployment', status: 'Running', replicas: '2/2', details: 'Next.js 프론트엔드' },
              ]
            },
            {
              id: 'kwt-prod-apps',
              name: 'Applications',
              type: 'folder',
              children: [
                { id: 'exchange-prod', name: 'exchange', type: 'deployment', status: 'Running', replicas: '2/2', details: '환율 계산기' },
                { id: 'givemesalary-prod', name: 'givemesalary', type: 'deployment', status: 'Running', replicas: '2/2', details: '연봉 계산기' },
              ]
            }
          ]
        },
        {
          id: 'corpbreak-ns',
          name: 'corpbreak-dev/prod',
          type: 'namespace',
          children: [
            { id: 'corpbreak-note', name: '(Corpbreak Services)', type: 'service', details: 'Corpbreak 프로젝트' }
          ]
        },
        {
          id: 'yumyum-ns',
          name: 'yumyum-dev/prod',
          type: 'namespace',
          children: [
            { id: 'yumyum-note', name: '(Yumyum Services)', type: 'service', details: '냠냠 픽업 프로젝트' }
          ]
        }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      type: 'folder',
      children: [
        {
          id: 'data-layer',
          name: 'Data Layer',
          type: 'folder',
          children: [
            {
              id: 'kwt-dev-db',
              name: 'mysql',
              type: 'folder',
              children: [
                {
                  id: 'mysql-db-dev',
                  name: 'dev',
                  type: 'folder',
                  children: [
                    { id: 'mysql-cluster-dev', name: 'mysql-cluster', type: 'statefulset', status: 'Running', replicas: '2/2', details: 'MySQL InnoDB Cluster' },
                    { id: 'mysql-router-dev', name: 'mysql-cluster-router', type: 'deployment', status: 'Running', replicas: '2/2', details: 'MySQL Router' },
                  ]
                },
                {
                  id: 'mysql-db-prod',
                  name: 'prod',
                  type: 'folder',
                  children: [
                    { id: 'mysql-cluster-prod', name: 'mysql-cluster', type: 'statefulset', status: 'Running', replicas: '3/3', details: 'MySQL InnoDB Cluster' },
                    { id: 'mysql-router-prod', name: 'mysql-cluster-router', type: 'deployment', status: 'Running', replicas: '2/2', details: 'MySQL Router' },
                  ]
                },
              ]
            },
            {
              id: 'redis-ns',
              name: 'redis',
              type: 'namespace',
              children: [
                { id: 'redis-dev', name: 'redis-dev', type: 'statefulset', status: 'Running', replicas: '1/1', details: 'Redis Dev Standalone' },
                { id: 'redis-prod', name: 'redis-node', type: 'statefulset', status: 'Running', replicas: '3/3', details: 'Redis Sentinel Cluster' },
              ]
            },
            {
              id: 'kafka-ns',
              name: 'kafka',
              type: 'namespace',
              children: [
                { id: 'kafka-controller', name: 'kafka-controller', type: 'statefulset', status: 'Running', replicas: '3/3', details: 'Kafka Cluster' },
              ]
            },
            {
              id: 'mongo-ns',
              name: 'mongo',
              type: 'namespace',
              children: [
                { id: 'mongodb-dev', name: 'mongodb-dev', type: 'statefulset', status: 'Running', replicas: '1/1', details: 'MongoDB Dev' },
                { id: 'mongodb-prod', name: 'mongodb-prod', type: 'statefulset', status: 'Running', replicas: '1/1', details: 'MongoDB Prod' },
              ]
            }
          ]
        },
        {
          id: 'cicd-layer',
          name: 'CI/CD',
          type: 'folder',
          children: [
            {
              id: 'jenkins-ns',
              name: 'jenkins',
              type: 'namespace',
              children: [
                { id: 'deploy-jenkins', name: 'deploy-jenkins', type: 'statefulset', status: 'Running', replicas: '1/1', details: '배포 젠킨스' },
                { id: 'batch-jenkins', name: 'batch-jenkins', type: 'statefulset', status: 'Running', replicas: '1/1', details: '배치 젠킨스' },
              ]
            },
            {
              id: 'nexus-ns',
              name: 'nexus',
              type: 'namespace',
              children: [
                { id: 'nexus', name: 'nexus', type: 'deployment', details: 'Docker Registry & Artifact' },
              ]
            }
          ]
        },
        {
          id: 'monitoring-layer',
          name: 'Monitoring',
          type: 'folder',
          children: [
            { id: 'grafana', name: 'grafana', type: 'deployment', details: '모니터링 대시보드' },
            { id: 'prometheus', name: 'prometheus', type: 'deployment', details: '메트릭 수집' },
            { id: 'loki', name: 'loki', type: 'deployment', details: '로그 수집' },
          ]
        },
        {
          id: 'system-layer',
          name: 'System',
          type: 'folder',
          children: [
            { id: 'metallb', name: 'metallb-system', type: 'namespace', details: 'LoadBalancer' },
            { id: 'ingress-nginx', name: 'ingress-nginx', type: 'namespace', details: 'Ingress Controller' },
            { id: 'longhorn', name: 'longhorn-system', type: 'namespace', details: 'Storage' },
            { id: 'cert-manager', name: 'cert-manager', type: 'namespace', details: 'TLS 인증서' },
          ]
        }
      ]
    }
  ]
};

const Explorer: React.FC = () => {
  const router = useRouter();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['cluster', 'applications', 'infrastructure']));
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cluster');
  const [flatNodes, setFlatNodes] = useState<TreeNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedNodeRef = useRef<HTMLDivElement>(null);

  // 트리를 평탄화하여 키보드 네비게이션용 배열 생성
  const flattenTree = useCallback((node: TreeNode, level: number = 0, result: TreeNode[] = []): TreeNode[] => {
    result.push({ ...node, level } as TreeNode & { level: number });
    if (node.children && expandedNodes.has(node.id)) {
      node.children.forEach(child => flattenTree(child, level + 1, result));
    }
    return result;
  }, [expandedNodes]);

  useEffect(() => {
    setFlatNodes(flattenTree(kubernetesTree));
  }, [flattenTree]);

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
      return;
    }

    const currentIndex = flatNodes.findIndex(node => node.id === selectedNodeId);
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          playBeep();
          setSelectedNodeId(flatNodes[currentIndex - 1].id);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < flatNodes.length - 1) {
          playBeep();
          setSelectedNodeId(flatNodes[currentIndex + 1].id);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        const currentNode = flatNodes[currentIndex];
        if (currentNode.children && currentNode.children.length > 0) {
          if (!expandedNodes.has(currentNode.id)) {
            playBeep();
            toggleNode(currentNode.id);
          }
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const node = flatNodes[currentIndex];
        if (expandedNodes.has(node.id)) {
          playBeep();
          toggleNode(node.id);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        const selectedNode = flatNodes[currentIndex];
        if (selectedNode.children && selectedNode.children.length > 0) {
          playSelectSound();
          toggleNode(selectedNode.id);
        }
        break;
      case 'Escape':
        event.preventDefault();
        playBeep();
        router.push('/project');
        break;
    }
  }, [flatNodes, selectedNodeId, expandedNodes, toggleNode, router]);

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

  useEffect(() => {
    // 선택된 노드가 보이도록 스크롤
    if (selectedNodeRef.current) {
      selectedNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedNodeId]);

  const renderNode = (node: TreeNode, level: number = 0, isLast: boolean = false, parentPath: string[] = []): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;
    
    // 트리 라인 그리기
    const getTreeLine = (level: number, isLast: boolean, parentPath: string[]) => {
      if (level === 0) return '';
      let line = '';
      
      // 부모 레벨들의 선 그리기
      for (let i = 0; i < level - 1; i++) {
        if (parentPath[i] === 'hasMore') {
          line += '│   ';
        } else {
          line += '    ';
        }
      }
      
      // 현재 레벨의 선 그리기
      line += isLast ? '└── ' : '├── ';
      return line;
    };
    
    let icon = '';
    if (node.type === 'folder' || node.type === 'namespace') {
      icon = isExpanded ? '📂 ' : '📁 ';
    } else if (node.type === 'deployment') {
      icon = '📦 ';
    } else if (node.type === 'statefulset') {
      icon = '🗄️ ';
    } else if (node.type === 'service') {
      icon = '🔧 ';
    } else if (node.type === 'ingress') {
      icon = '🌐 ';
    }

    const getStatusColor = (status?: string) => {
      if (status === 'Running') return 'text-green-400';
      if (status === 'Pending') return 'text-yellow-400';
      return 'text-green-300';
    };

    return (
      <div key={node.id}>
        <div
          ref={isSelected ? selectedNodeRef : null}
          className={`cursor-pointer py-0.5 ${isSelected ? 'bg-green-500 text-black' : ''} hover:bg-green-900`}
          onClick={() => {
            setSelectedNodeId(node.id);
            if (hasChildren) {
              playSelectSound();
              toggleNode(node.id);
            }
          }}
          onMouseOver={() => {
            if (selectedNodeId !== node.id) {
              playBeep();
              setSelectedNodeId(node.id);
            }
          }}
        >
          <span className="font-mono text-xs sm:text-sm whitespace-pre">
            <span className="text-gray-600">{getTreeLine(level, isLast, parentPath)}</span>
            <span className={level > 0 ? 'text-green-300' : 'text-green-400 font-bold'}>{icon}{node.name}</span>
            {node.replicas && <span className={`ml-2 ${getStatusColor(node.status)}`}>({node.replicas})</span>}
            {node.details && <span className="ml-2 text-gray-500 text-xs">{node.details}</span>}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child, index) => {
              const isChildLast = index === node.children!.length - 1;
              const newParentPath = [...parentPath, isLast ? 'noMore' : 'hasMore'];
              return renderNode(child, level + 1, isChildLast, newParentPath);
            })}
          </div>
        )}
      </div>
    );
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
{`┌────────────────────────────────────────┐
│      KUBERNETES_ARCHITECTURE.TXT       │
└────────────────────────────────────────┘`}
          </pre>
        </div>

        <div className="mb-4 flex gap-4 justify-center">
          <button
            className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
            onClick={() => {
              playSelectSound();
              router.push('/project');
            }}
          >
            뒤로가기
          </button>
        </div>

        <div className="border border-green-500 p-4 bg-green-950 bg-opacity-10 overflow-x-auto">
          <div className="min-w-0">
            {renderNode(kubernetesTree, 0, true, [])}
          </div>
        </div>

        <div className="mt-4 border border-green-500 p-3 bg-green-950 bg-opacity-20">
          <div className="text-green-400 font-bold mb-2 text-xs sm:text-sm">범례</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div>📁/📂 폴더/네임스페이스</div>
            <div>📦 Deployment</div>
            <div>🗄️ StatefulSet</div>
            <div>🔧 Service</div>
            <div>🌐 Ingress</div>
            <div className="text-gray-600">├── └── 트리 라인</div>
          </div>
        </div>

        <div className="hidden sm:block mt-6 text-center text-xs text-green-300 opacity-70">
          <div className="inline-block border border-green-300 p-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base">▲ ▼</span>
                <span>이동</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">◄ ►</span>
                <span>접기/펼치기</span>
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

export default Explorer;