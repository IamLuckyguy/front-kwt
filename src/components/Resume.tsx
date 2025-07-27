'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { playBeep, playSelectSound } from '@/utils/audio';

interface Project {
  title: string;
  description: string;
  period: string;
  tech: string;
  team: string;
  role: string;
  teamSize: string;
  tasks: string[];
  achievement?: string;
  growth?: string;
}

interface ProjectsData {
  [key: string]: Project[];
}

const resumeData = {
  personalInfo: {
    title: "Software Engineer",
    totalExperience: "14년 3개월"
  },
  career: [
    {
      id: "sk-rental",
      period: "2025.02 ~ 재직 중 (5개월)",
      company: "SK렌터카㈜",
      department: "서비스개발팀",
      position: "매니저",
      description: "AKS 기반 웹사이트 개편 및 인프라 구축"
    },
    {
      id: "wemakeprice",
      period: "2017.12 ~ 2025.01 (8년)",
      company: "㈜위메프/큐텐테크놀로지(유)",
      department: "플랫폼개발팀",
      position: "매니저",
      description: "MSA 전환, API Gateway 구축, 메시지 플랫폼 개발"
    },
    {
      id: "legaltech",
      period: "2017.04 ~ 2017.11 (8개월)",
      company: "㈜리걸테크",
      department: "서비스개발팀",
      position: "선임",
      description: "변호사 법률 자문 플랫폼 서비스 개발"
    },
    {
      id: "ifamilysc",
      period: "2011.07 ~ 2016.02 (4년 8개월)",
      company: "㈜아이패밀리SC",
      department: "기술연구소",
      position: "대리",
      description: "웨딩 서비스 웹사이트 개발 및 운영"
    },
    {
      id: "jeonneung",
      period: "2010.05 ~ 2011.07 (1년 3개월)",
      company: "㈜전능아이티",
      department: "고객서비스팀",
      position: "퍼블리셔",
      description: "웹 퍼블리싱 및 프론트엔드 개발"
    }
  ],
  projects: {
    "sk-rental": [
      {
        title: "SK렌터카 웹사이트 개편",
        description: "웹사이트 전면 개편",
        period: "2025.02 ~ 2025.07 (오픈 예정)",
        tech: "Kubernetes (AKS), Next.js, Java(SpringBoot), Oracle, Redis",
        team: "서비스개발팀",
        role: "백엔드 PL",
        teamSize: "내부: 프론트 1인, 백엔드 2인 / 외주: 프론트 35인, 백엔드 7인",
        tasks: [
          "외주 인력 대상 입사 지원, 개발 환경 구축 및 개선점 리뷰, 트러블 슈팅",
          "서비스 문제점 파악 및 개선점 도출, 내재화 계획 수립",
          "다중 도메인간 SSO 연동 문제 해결을 위한 프론트, 백엔드 분석 및 문서화",
          "라이브 서비스와 격리된 환경 구성을 위한 쿠버네티스 신규 클러스터, 배포 파이프라인 구축 지원",
          "신규 서버와 기존 서비스의 L4, L7 구간 통신 확인, 방화벽 정책 추가 지원",
          "신규 서브 도메인과 Azure APP Gateway(L7 라우터), APP Gateway와 서비스 라우팅 설정",
          "신규 도메인 추가로 인한 CORS 발생 구간 점검, 대응 수정"
        ]
      }
    ],
    "wemakeprice": [
      {
        title: "티몬 신규 광고 서비스 개발",
        description: "진행중인 광고 상품에 추가 금액 지불로 부스팅, 추가 전시영역에 광고 노출 서비스 신규개발",
        period: "2024.07 ~ 2024.08",
        tech: "HTML+CSS+Javascript+jQuery, Java(SpringBoot)",
        team: "A-Platform Dev. Team",
        role: "리딩 및 개발",
        teamSize: "3인",
        tasks: ["마크업, 클라이언트 스크립트, 렌더링/백엔드 서버간 API 연동"]
      },
      {
        title: "티몬 키워드 광고 경매 서비스 신규 개발",
        description: "특정 키워드에 대한 광고를 획득하기 위해 판매사 대상 경매 서비스 제공",
        period: "2024.05 ~ 2024.06 (1개월)",
        tech: "HTML+CSS+Javascript+jQuery, Java(SpringBoot)",
        team: "A-Platform Dev. Team",
        role: "리딩 및 개발",
        teamSize: "4인",
        tasks: ["마크업, 클라이언트 스크립트, 렌더링/백엔드 서버간 API 연동"]
      },
      {
        title: "위메프, 티몬 SMS/LMS 발송 통합",
        description: "큐텐, 위메프, 티몬 각 플랫폼에서 발생하는 SMS/LMS 모두 다른 벤더사를 통한 발송으로 사용량 할인을 적용 받기 위한 플랫폼간 통합 프로젝트",
        period: "2024.01 ~ 2024.02 (2개월)",
        tech: "Java(SpringBoot)",
        team: "Service Platform Dev. Division A-Platform Dev. Team",
        role: "리딩 및 개발",
        teamSize: "2인",
        tasks: [
          "위메프, 티몬, 큐텐 통합 시나리오 수립",
          "위메프 발송 로직 (DB insert)를 통합 발송 API 호출로 변경",
          "통합 발송 플랫폼에 저장된 발송 상태를 API로 제공받아 각 플랫폼의 발송 상태 업데이트 batch 개발"
        ],
        achievement: "갱신 계약시 위메프 티몬 발생 SMS/LMS 월 발송량 340만건에 대한 약 5% 비용절감 추정",
        growth: "다중 플랫폼간 통합 시나리오 수립"
      },
      {
        title: "챗봇/채팅 상담 서비스 기술 결함 추적 및 해결",
        description: "사용자 문의로 상담원 채팅 연결 시 고질적으로 발생하는 문제, 사용량 감소로 인해 서비스 종료 검토 요청 접수. 발생하는 문제를 종류/빈도 별 수집하여 기술적 결함 추적 및 해결",
        period: "2023.08 ~ 2023.09 (1개월)",
        tech: "Kotlin(Spring webflux), node.js(meteor.js), Redis, MongoDB, Jenkins",
        team: "W-Service Dev. Division W-Member Dev. Team",
        role: "개발",
        teamSize: "1인",
        tasks: [
          "대기 상담이 있을 경우 채팅 상담사에게 상담이 할당되는 과정에서 중복 할당, 할당 지연이 발생",
          "Redis 분산 락을 이용한 중복 할당 방지 로직이 있으나 정상 동작하지 않는 문제점 파악",
          "비동기 처리(webflux) 특성으로 인한 동일 thread ID를 부여 받을 경우 중복으로 Lock을 획득하는 문제점 확인",
          "Lock 획득/해제 시 thread ID가 다르기 때문에 지속적으로 오류가 발생하는 문제점 발견",
          "Lock 획득/해제 시 진입 시점에 저장한 thread ID를 통해 획득/해제 시도하도록 로직 개선",
          "동일 thread ID로 진입한 호출을 방어하기 위해 최초 Lock 획득 시도 전 획득된 Lock 의 존재 여부 파악 로직 추가"
        ],
        achievement: "서비스 런칭(2020년) 시점부터 발생하던 상담 중복 할당, 지연 문제 해결로 시스템 신뢰도 개선. 일일 중복 할당 발생 횟수 10건 이상 -> 0건. 챗봇/채팅 상담(위메프톡) 서비스 지속 이용으로 시스템 종료에 들어갈 인력, 신규 또는 기존 운영 중인 시스템의 개발 비용 절감",
        growth: "분산 락을 통한 동시성 제어 매커니즘 파악, webflux + 분산 락을 이용한 시스템의 트러블 슈팅 경험"
      },
      {
        title: "Push, Push 발송내역 조회 서비스 통합",
        description: "GCP를 통해 제공되는 (푸시 발송, 발송내역 조회, 고객센터 채팅 상담)서비스의 불필요한 모듈/기술 통합 및 제거",
        period: "2023.03 ~ 2023.08 (6개월)",
        tech: "GCP(pub/sub, GCS), Java(SpringBoot), Kotlin(Spring webflux), Python(flask), Angular, Node.js(meteor.js), Redis, MySQL, MongoDB, Hadoop, Spark, embulk, sqoop, Jenkins, Airflow, Cronicle",
        team: "서비스개발실 메시지플랫폼개발팀",
        role: "리딩 및 개발",
        teamSize: "4인",
        tasks: [
          "푸시 발송, 발송 내역 서비스 통합 (DB 통합, 시나리오 간소화)",
          "서비스의 연속성이 있으나 2개의 GCP 프로젝트와 팀으로 운영되던 서비스 통합 과정",
          "광고 푸시 발송 시나리오 재수립, 프로세스 단순화",
          "푸시 타겟 발송을 위한 관리자페이지 추가",
          "엑셀 파일 파일 업로드 (GCS), 예약 시간 도래 시 엑셀 파일에 기재된 회원번호로 토큰을 읽은 후 푸시 발송 API 호출 기능 개발"
        ],
        achievement: "불필요한 5개 모듈 정리(25개 -> 20개)로 10개 인스턴스 제거 및 스케일 다운 작업으로 월 평균 발생 비용 약 23% 감소 (1350만원 -> 1050만원 월 300만원 절감). 푸시 발송 수행 시간 감소 1회 스케쥴 약 180만건 발송 수행시간 40분 -> 15분 약 60% 개선",
        growth: "오버 엔지니어링의 위험성 경험, 과도한 모듈화와 업무 쪼개기의 비효율성 경험, 네트워크에 대한 이해도 증가 (IDC, 클라우드간 통신 및 GCP 프로젝트간 통신 이슈 해결 과정)"
      },
      {
        title: "신규 팀 빌딩 및 온보딩, 시스템 구조개선",
        description: "4개 부서에 의해 운영되던 서비스의 운영 부서 단일화, 온보딩. GCP를 통해 제공되는 서비스의 미사용/오버스펙 모듈 제거 및 스케일 다운",
        period: "2022.08 ~ 2023.01 (6개월)",
        tech: "GCP(pub/sub, GCS), Java(SpringBoot), Kotlin(Spring webflux), Python(flask), Angular, Node.js(meteor.js), Redis, MySQL, MongoDB, Hadoop, Spark, embulk, sqoop, Jenkins, Airflow, Cronicle",
        team: "서비스개발실 메시지플랫폼개발팀",
        role: "리딩",
        teamSize: "4인",
        tasks: [
          "장기간 담당 부서 부재 서비스의 문서화, 문서 현행화",
          "개선점 파악을 위한 푸시 발송, 발송 내역 조회 서비스 전체 시스템 아키텍처 구성도 작성",
          "오버 엔지니어링으로 인한 서비스 복잡도 개선 시나리오 수립",
          "빠른 장애 대응을 위한 APM툴 신규 구성(MongoDB Ops Manager) 및 통합 로깅(ELK stack), 모니터링 시스템(pinpoint) 연동"
        ],
        achievement: "파편화된 문서 정리, 문서 현행화로 업무 온보딩 난이도 감소. 불필요한 6개 모듈 정리(36개 -> 30개)로 24개 인스턴스 제거 및 스케일 다운 작업으로 월 평균 발생 비용 약 20% 감소 (1700만원 -> 1350만원 월 350만원 절감). 푸시 시스템 장애 감지 지연으로 3시간 이상 소요되던 장애 대응 시간 1시간 이내로 감소",
        growth: "신규 팀의 팀장으로 중장기 목표 설정 및 성과 관리 경험, 수치에 기반한 목표 설정, 성과 측정, 보고서 작성 능력 향상, 서비스의 올바른 시스템 설계, 문서화, 빠른 장애 극복을 위한 장애 감지 중요성 통감"
      },
      {
        title: "트래픽 증가시 병목 API 원인 파악 및 개선",
        description: "API Gateway를 통한 호출에 일시적 트래픽 증가시 병목지점 확인, 보고 후 개선 작업 참여",
        period: "2022.01 ~ 2022.03 (3개월)",
        tech: "Java(SpringBoot), Redis",
        team: "서비스개발실 메시지플랫폼개발팀",
        role: "리딩 및 개발",
        teamSize: "2인",
        tasks: [
          "트래픽 증가로 인한 병목 지점 특정(pinpoint를 통한 API endpoint 파악)",
          "기존 로직, 용도, 정책 파악 및 문서화",
          "Redis 내 저장된 계층적 자료구조를 반복하여 연결 맺고 가져오도록 설계된 문제점 확인",
          "계층 데이터를 get -> mget 변경, 실시간성 우선순위가 낮은 데이터로 1분 간격 로컬캐시 적용"
        ],
        achievement: "평시 인스턴스 54대, 트래픽 증가 예상 시점 인스턴스를 80~100대까지 운영하였으나 28대로 안정적 운영 확인 (피크타임 약 2400TPS)",
        growth: "자료구조에 대한 최소한의 고민, 문서화의 중요성 통감"
      },
      {
        title: "Spring Cloud Gateway를 이용한 API Gateway 구축 및 통계 대시보드 구성",
        description: "SpringBoot로 개발된 API Gateway 프로젝트 2개를 Spring webflux 기반 Spring Cloud Gateway를 이용한 1개의 API Gateway 프로젝트로 통합 후 대체",
        period: "2020.12 ~ 2021.09 (10개월)",
        tech: "API Gateway : Java(Spring webflux), Thymeleaf / Dashboard : Java(SpringBoot), MySQL, metabase(BI툴)",
        team: "신사업개발실 게이트웨이개발팀",
        role: "개발",
        teamSize: "4인",
        tasks: [
          "SpringBoot 기반 코드를 Spring webflux 기반 코드로 변경. Spring Cloud Gateway를 이용한 서비스 전체 API 호출을 제어하는 API Gateway 구축",
          "신규 API Gateway 서비스 투입 계획 수립",
          "End-Point 별 호출, 오류 발생, 오류 별 발생 횟수 등의 자료를 수집, 시각화, 대시보드로 제공"
        ],
        achievement: "2개로 분리됐던 API Gateway를 통합, webflux전환으로 인스턴스 196대 -> 120대로 약 39% 감소. 호출 증가에 따른 응답 지연 현상 개선 (피크타임 평균 응답시간 약 47% 감소 300ms -> 160ms). 호출 기록, 인증/인가 등의 공통 로직 관리로 유지보수 난이도 감소. 특정 API에서 발생하는 오류/지연 감지 속도 증가",
        growth: "Spring webflux, Reactive Programming에 대한 이해도 향상. 사내 단일 서비스 중 가장 많은 호출(일 평균 호출 3억건 이상, 일 피크 4000TPS 이상)을 처리 하는 서비스 운영/개발을 통해 트래픽 증가에 대한 대응, 모니터링 환경 구축 경험"
      },
      {
        title: "2차 전환 대상 서비스 운영 및 전환",
        description: "레거시 시스템(PHP) 운영/개발 및 Fade out",
        period: "2019.01 ~ 2019.12 (1년)",
        tech: "PHP(Codeigniter), MySQL, Couchbase, Memcached, Redis, Java(SpringBoot)",
        team: "플랫폼개발실 운영개발팀",
        role: "개발",
        teamSize: "10인 이상",
        tasks: [
          "2차 전환 대상 및 전환 기간 중 유지가 필요한 레거시 서비스의 서버 감축",
          "전환 시 누락 기능 API 개발 및 전환 작업",
          "담당팀 부재, 용도 불명 서버 소스레벨 파악 및 문서화, 필요 여부에 따라 종료"
        ],
        achievement: "파악된 잔여 레거시 서버 150대 -> 30대로 약 80% 서버 회수",
        growth: "인수인계의 중요성 통감, 대대적인 서비스 전환 비용에 대한 고찰"
      },
      {
        title: "Monolithic Architecture PHP 프로젝트를 MSA Java 프로젝트로 전환",
        description: "기존에 구축된 PHP monolithic architecture프로젝트를 Java micro service architecture프로젝트로 전환, 레거시 시스템(PHP) 운영/개발 업무",
        period: "2018.01 ~ 2018.12 (1년)",
        tech: "PHP(Codeigniter), MySQL, Couchbase, Memcached",
        team: "플랫폼개발실 융합3팀",
        role: "개발",
        teamSize: "60인 이상",
        tasks: [
          "PHP 프로젝트의 정책 포함한 주요 로직 분석, 사내 wiki(confluence)에 문서화",
          "분석한 내용을 Java개발자와 Fair programming을 통해 Java전환",
          "이관 중 PHP 신규 기능 개발 및 운영 업무"
        ],
        achievement: "데이터베이스 장애 발생 시 시간 당 약 5천만원(2018년 매출액 4300억 기준)의 매출액 피해를 최소화 할 수 있는 시스템 구축. 별도의 도메인인 백오피스(어드민, 판매자 어드민 등)의 데이터베이스 분리로 데이터베이스 장애에 따른 전사 서비스 장애 예방. 세분화된 R&R로 빠른 fail-over 가능, 도메인 별 부하에 따른 scale-out 대응 환경 구축으로 장애 발생에 의한 연장근무, 모니터링 인력 30% 이상 감소",
        growth: "대규모 시스템과 MSA에 대한 이해도 향상, 신규 언어 전환 시 효율적인 Fair programming 경험, 세분화된 R&R로 인해 발생하는 silo(부서 이기주의)현상, 시스템 복잡도 증가로 인해 발생하는 문제에 대한 커뮤니케이션 비용 상승 경험, 레거시 코드를 통한 코딩 컨벤션 통일 및 코드 리뷰의 필요성 통감"
      }
    ],
    "legaltech": [
      {
        title: "신규 서비스 개발, 런칭",
        description: "변호사 법률 자문 플랫폼 서비스 변호사님닷컴 관리자 페이지 포함 앱(웹뷰) 서비스 개발",
        period: "2017.05 ~ 2017.09 (5개월)",
        tech: "HTML+CSS+jQuery, Bootstrap, PHP(Codeigniter), MySQL",
        team: "서비스개발팀",
        role: "개발",
        teamSize: "1인",
        tasks: [
          "데이터베이스 스키마 설계, 관리자 페이지, PC/Mobile 웹 서비스 전체 개발",
          "서비스 기획 참여"
        ],
        achievement: "PC/모바일 웹 사이트, 관리자 페이지, 웹 뷰 기반의 iOS/AOS 앱 신규 런칭",
        growth: "신규 앱 런칭을 위한 A to Z 업무 경험, 서비스 기획 참여 경험 및 외부 교육 수강"
      }
    ],
    "ifamilysc": [
      {
        title: "웨딩 서비스 웹사이트 개발 및 운영",
        description: "IT기반 웨딩 서비스 제공을 위한 웹사이트 신규 기능 개발 및 운영",
        period: "2011.07 ~ 2016.02 (4년 8개월)",
        tech: "HTML+CSS+JavaScript, PHP, MySQL",
        team: "기술연구소",
        role: "개발",
        teamSize: "약 10명",
        tasks: [
          "웹사이트 신규 기능 개발",
          "기존 서비스 운영 및 유지보수",
          "데이터베이스 설계 및 관리"
        ]
      }
    ],
    "jeonneung": [
      {
        title: "웹 퍼블리싱",
        description: "웹사이트 퍼블리싱 업무",
        period: "2010.05 ~ 2011.07 (1년 3개월)",
        tech: "HTML+CSS+JavaScript",
        team: "고객서비스팀",
        role: "퍼블리셔",
        teamSize: "6",
        tasks: [
          "웹 퍼블리싱",
          "고객 서비스 지원"
        ]
      }
    ]
  },
  coreCompetencies: [
    {
      title: "실시간 시스템 및 메시지 브로커 운영 경험",
      details: [
        "RabbitMQ, Kafka, GCP Pub/Sub를 활용한 대규모 트래픽 처리 시스템 설계/운영",
        "WebSocket 기반의 챗봇 서비스 운영 경험",
        "시스템 간 안정적인 연동을 위한 API 설계 및 데이터 스트림 아키텍처 개선"
      ]
    },
    {
      title: "시스템 안전성 및 모니터링 시스템 구축",
      details: [
        "다양한 서비스(Web Application, Agent, Batch) 운영을 통한 장애 대응 및 트러블슈팅",
        "API Gateway 운영으로 실시간 모니터링 및 장애 감지 시스템 구축",
        "네트워크 환경(IDC-GCP) 통신 장애 해결 및 시스템 안정성 개선"
      ]
    },
    {
      title: "확장 가능한 아키텍처 설계 및 기술부채 해결",
      details: [
        "오버엔지니어링 해결 및 시스템 효율성 개선 프로젝트 리딩",
        "MSA 환경에서의 서비스 분리 및 Kubernetes 기반 인프라 구축/운영",
        "스쿼드 리더 경험을 통한 팀 협업 및 기술적 의사결정 주도"
      ]
    }
  ],
  skills: {
    "형상관리, 협업도구": { techs: "Git, Jira, Confluence, Bitbucket", level: "사용가능" },
    "개발 언어": { 
      techs: "주요 개발: Java, PHP / 운영 경험: Kotlin, Python, Node.js", 
      level: "개발가능" 
    },
    "데이터베이스": { techs: "MySQL, MongoDB, ElasticSearch, Redis, Couchbase", level: "운영/개발가능" },
    "데이터분산": { techs: "Kafka, GCP pub/sub (SaaS), RabbitMQ", level: "개발가능" },
    "클라우드 플랫폼": { techs: "GCP", level: "운영가능" },
    "APM툴": { techs: "Pinpoint, Zabbix, Ops Manager(mongoDB)", level: "사용가능" },
    "CI/CD, pipeline툴": { techs: "Jenkins, Airflow, Cronicle", level: "운영/사용가능" },
    "마크업": { techs: "HTML+CSS+jQuery/Bootstrap", level: "개발가능" },
    "프레임워크": { 
      techs: "Java, Kotlin: SpringBoot, Spring webflux / PHP: Codeigniter / Python: Flask / Node.js: Meteor.js, Express, Next.js", 
      level: "개발가능" 
    },
    "인프라 플랫폼": { techs: "Kubernetes, OpenStack", level: "사용가능" }
  }
};

const Resume: React.FC = () => {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<'career' | 'competencies' | 'skills'>('career');
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number>(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number>(0);
  const [lastNavigationAction, setLastNavigationAction] = useState<'career' | 'menu'>('career');
  const containerRef = useRef<HTMLDivElement>(null);

  const buttons = useMemo(() => ['career', 'competencies', 'skills', 'back'] as const, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement> | globalThis.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
      return;
    }

    // 프로젝트 세부 정보를 보고 있을 때
    if (selectedCompanyId && currentSection === 'career') {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          // 스크롤 업
          window.scrollBy(0, -100);
          break;
        case 'ArrowDown':
          event.preventDefault();
          // 스크롤 다운
          window.scrollBy(0, 100);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          playBeep();
          setLastNavigationAction('menu');
          setSelectedButtonIndex((prev) => (prev > 0 ? prev - 1 : buttons.length - 1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          playBeep();
          setLastNavigationAction('menu');
          setSelectedButtonIndex((prev) => (prev < buttons.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          playSelectSound();
          const selectedButton = buttons[selectedButtonIndex];
          if (selectedButton === 'back') {
            router.push('/');
          } else if (selectedButton !== 'career') {
            setSelectedCompanyId(null);
            setCurrentSection(selectedButton as 'career' | 'competencies' | 'skills');
          }
          break;
        case 'Escape':
          event.preventDefault();
          playBeep();
          setSelectedCompanyId(null);
          break;
      }
      return;
    }

    // 경력사항에서 회사 선택 모드
    if (currentSection === 'career') {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (selectedCareerIndex > 0) {
            playBeep();
            setLastNavigationAction('career');
            setSelectedCareerIndex(prev => prev - 1);
          } else {
            // 스크롤 업
            window.scrollBy(0, -100);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (selectedCareerIndex < resumeData.career.length - 1) {
            playBeep();
            setLastNavigationAction('career');
            setSelectedCareerIndex(prev => prev + 1);
          } else {
            // 스크롤 다운
            window.scrollBy(0, 100);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          playBeep();
          setLastNavigationAction('menu');
          setSelectedButtonIndex((prev) => (prev > 0 ? prev - 1 : buttons.length - 1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          playBeep();
          setLastNavigationAction('menu');
          setSelectedButtonIndex((prev) => (prev < buttons.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          playSelectSound();
          if (lastNavigationAction === 'career') {
            // 마지막에 경력사항 네비게이션을 사용했으면 회사 선택
            const companyId = resumeData.career[selectedCareerIndex].id;
            setSelectedCompanyId(companyId);
          } else {
            // 마지막에 메뉴 네비게이션을 사용했으면 메뉴 선택
            const selectedButton = buttons[selectedButtonIndex];
            if (selectedButton === 'back') {
              router.push('/');
            } else {
              setCurrentSection(selectedButton as 'career' | 'competencies' | 'skills');
              if (selectedButton === 'career') {
                setSelectedCareerIndex(0);
                setSelectedCompanyId(null);
                setLastNavigationAction('career'); // 경력사항으로 돌아갈 때 기본값 설정
              } else {
                setLastNavigationAction('menu'); // 다른 섹션으로 갈 때는 메뉴 액션
              }
            }
          }
          break;
        case 'Escape':
          event.preventDefault();
          playBeep();
          router.push('/');
          break;
      }
      return;
    }

    // 다른 섹션 (competencies, skills)에서의 네비게이션
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        // 스크롤 업
        window.scrollBy(0, -100);
        break;
      case 'ArrowDown':
        event.preventDefault();
        // 스크롤 다운
        window.scrollBy(0, 100);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        playBeep();
        setLastNavigationAction('menu');
        setSelectedButtonIndex((prev) => (prev > 0 ? prev - 1 : buttons.length - 1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        playBeep();
        setLastNavigationAction('menu');
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
          setCurrentSection(selectedButton as 'career' | 'competencies' | 'skills');
          if (selectedButton === 'career') {
            setSelectedCareerIndex(0);
            setSelectedCompanyId(null);
            setLastNavigationAction('career'); // 경력사항으로 돌아갈 때 기본값 설정
          } else {
            setLastNavigationAction('menu'); // 다른 섹션으로 갈 때는 메뉴 액션
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        playBeep();
        router.push('/');
        break;
    }
  }, [selectedButtonIndex, selectedCompanyId, selectedCareerIndex, currentSection, lastNavigationAction, router, buttons]);

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

  const getSectionTitle = () => {
    switch(currentSection) {
      case 'career': return '경력사항';
      case 'competencies': return '핵심역량';
      case 'skills': return '보유기술';
    }
  };

  const renderSection = () => {
    switch(currentSection) {
      case 'career':
        if (selectedCompanyId) {
          const projects: Project[] = (resumeData.projects as ProjectsData)[selectedCompanyId] || [];
          const company = resumeData.career.find(c => c.id === selectedCompanyId);
          
          return (
            <div className="space-y-4">
              <div className="border border-green-500 p-3 bg-green-950 bg-opacity-20">
                <div className="text-green-400 font-bold text-lg mb-2">{company?.company}</div>
                <div className="text-green-300 text-sm">{company?.period}</div>
                <div className="text-green-200 text-sm">{company?.department} / {company?.position}</div>
                <div className="text-green-300 text-sm mt-2">{company?.description}</div>
              </div>
              
              {projects.map((project, index) => (
                <div key={index} className="border border-green-500 p-4 space-y-3">
                  <div className="text-green-400 font-bold text-base">{project.title}</div>
                  <div className="text-green-300 text-sm">{project.description}</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-green-400 font-bold">기간: </span>
                      <span className="text-green-200">{project.period}</span>
                    </div>
                    <div>
                      <span className="text-green-400 font-bold">역할: </span>
                      <span className="text-green-200">{project.role}</span>
                    </div>
                    <div>
                      <span className="text-green-400 font-bold">팀: </span>
                      <span className="text-green-200">{project.team}</span>
                    </div>
                    <div>
                      <span className="text-green-400 font-bold">인원: </span>
                      <span className="text-green-200">{project.teamSize}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-green-400 font-bold text-sm mb-1">사용기술:</div>
                    <div className="text-green-200 text-xs">{project.tech}</div>
                  </div>
                  
                  <div>
                    <div className="text-green-400 font-bold text-sm mb-1">주요 업무:</div>
                    <div className="space-y-1">
                      {project.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="text-green-200 text-xs">- {task}</div>
                      ))}
                    </div>
                  </div>
                  
                  {project.achievement && (
                    <div>
                      <div className="text-green-400 font-bold text-sm mb-1">프로젝트 성과:</div>
                      <div className="text-green-200 text-xs">{project.achievement}</div>
                    </div>
                  )}
                  
                  {project.growth && (
                    <div>
                      <div className="text-green-400 font-bold text-sm mb-1">경험 및 성장:</div>
                      <div className="text-green-200 text-xs">{project.growth}</div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-center text-green-300 text-xs mt-4 opacity-70">
                [ESC] 키를 눌러 경력사항으로 돌아가기
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-4">
            <div className="border border-green-500 p-3">
              <div className="text-lg font-bold text-green-400 mb-2">총 경력: {resumeData.personalInfo.totalExperience}</div>
              <div className="text-sm text-green-300 mb-2">* 병역특례 복무기간 (2010.05 ~ 2012.08) 포함</div>
              <div className="text-sm text-green-300 mt-2">💡 회사를 클릭하거나 선택 후 엔터를 눌러 프로젝트 상세 정보를 확인하세요</div>
            </div>
            {resumeData.career.map((item, index) => (
              <div 
                key={index} 
                className={`border border-green-500 p-3 cursor-pointer transition-all ${
                  selectedCareerIndex === index ? 'bg-green-500 bg-opacity-20 border-green-400' : 'hover:bg-green-950 hover:bg-opacity-20'
                }`}
                onClick={() => {
                  playSelectSound();
                  setSelectedCompanyId(item.id);
                }}
                onMouseOver={() => {
                  if (selectedCareerIndex !== index) {
                    playBeep();
                    setSelectedCareerIndex(index);
                  }
                }}
              >
                <div className="text-green-400 font-mono text-sm">{item.period}</div>
                <div className="text-green-300 text-base mt-1 font-bold">{item.company}</div>
                <div className="text-green-200 text-sm">{item.department} / {item.position}</div>
                <div className="text-green-300 text-sm mt-1">{item.description}</div>
              </div>
            ))}
          </div>
        );
      
      case 'competencies':
        return (
          <div className="space-y-4">
            {resumeData.coreCompetencies.map((comp, index) => (
              <div key={index} className="border border-green-500 p-3">
                <div className="text-green-400 font-bold text-base mb-2">▸ {comp.title}</div>
                <div className="space-y-1 pl-4">
                  {comp.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-green-300 text-sm">
                      - {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'skills':
        return (
          <div className="space-y-3">
            {Object.entries(resumeData.skills).map(([category, skill], index) => (
              <div key={index} className="border border-green-500 p-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  <div className="text-green-400 font-bold text-sm">{category}</div>
                  <div className="text-green-300 text-sm lg:col-span-1">{skill.techs}</div>
                  <div className="text-green-200 text-sm text-right">{skill.level}</div>
                </div>
              </div>
            ))}
          </div>
        );
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
{`┌────────────────────────────────┐
│         RESUME.TXT             │
└────────────────────────────────┘`}
          </pre>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-2 sm:gap-4 justify-center">
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 0 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              setCurrentSection('career');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(0);
            }}
          >
            경력사항
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 1 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              setCurrentSection('competencies');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(1);
            }}
          >
            핵심역량
          </button>
          <button
            className={`px-4 py-2 border border-green-500 text-xs sm:text-sm ${
              selectedButtonIndex === 2 ? 'bg-green-500 text-black' : 'text-green-500'
            }`}
            onClick={() => {
              playSelectSound();
              setCurrentSection('skills');
            }}
            onMouseOver={() => {
              playBeep();
              setSelectedButtonIndex(2);
            }}
          >
            보유기술
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">◄ ►</span>
                  <span>메뉴 선택</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">▲ ▼</span>
                  <span>스크롤/항목 이동</span>
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

export default Resume;