# 배포 설정 가이드

## 📋 개요

이 디렉토리는 쿠버네티스 배포를 위한 설정 파일들을 포함합니다. Jenkins CI/CD 파이프라인에서 이 설정을 읽어 자동으로 배포를 수행합니다.

## 📁 파일 구조

```
.deploy/
├── deploy-config-dev.yaml    # 개발 환경 배포 설정
├── deploy-config-prod.yaml   # 운영 환경 배포 설정
└── README.md                 # 이 파일
```

## 🔧 설정 파일 구조

### 기본 정보
```yaml
project: "corpbreak"          # 프로젝트 이름 (네임스페이스 생성에 사용)
name: "exchange"              # 애플리케이션 이름
```

### 애플리케이션 설정
```yaml
app:
  type: "spring"              # 앱 타입: spring, nextjs, express, php, spring-multi-module
  module_name: ""             # 멀티모듈 프로젝트의 경우 빌드할 모듈명
```

### 레이블 설정
```yaml
labels:
  component: "backend"        # frontend, backend, service
  tier: "service"            # api, web, cache, database 등
```

### 도메인 및 배포 설정
```yaml
domains:                      # 사용할 도메인 목록
  - "exchange-dev.corpbreak.co.kr"
  - "exchange-dev.corpbreak.com"
replicas: 1                   # 파드 복제 수
container_port: 8080          # 애플리케이션 포트
```

### 시크릿 설정
```yaml
secrets:
  common: "app-common-credentials-dev"    # 공통 시크릿 (필수)
  
  # 추가 시크릿 레퍼런스 (선택사항)
  additional_secret_refs:
    - name: "mysql-credentials-dev"
    - name: "redis-credentials-dev"
  
  # 앱별 커스텀 시크릿 (선택사항)
  custom_secrets:
    JWT_SECRET: "dev_jwt_secret_key"
    APP_DEBUG: "true"
    LOG_LEVEL: "debug"
```

### 영구 볼륨 설정 (선택사항)
```yaml
persistence:
  enabled: true               # 볼륨 사용 여부
  size: "5Gi"                # 볼륨 크기
  path: "/app/uploads"       # 컨테이너 마운트 경로
  storage_class: "longhorn"  # 스토리지 클래스 (기본값)
  access_mode: "ReadWriteOnce" # 볼륨 접근 모드 (기본값)
```

## 🌐 TLD 매핑

현재 지원되는 TLD와 해당 Ingress 네임스페이스:

| TLD | Ingress 네임스페이스 | 와일드카드 인증서 | 루트 인증서 |
|-----|---------------------|-------------------|-------------|
| co.kr | corpbreak-co-kr-ingress | corpbreak-co-kr-wildcard-tls | corpbreak-co-kr-root-tls |
| com | corpbreak-com-ingress | corpbreak-com-wildcard-tls | corpbreak-com-root-tls |

## 📝 환경별 설정 예시

### 개발 환경 (deploy-config-dev.yaml)
```yaml
project: "corpbreak"
name: "exchange"

app:
  type: "spring"

labels:
  component: "backend"
  tier: "service"

domains:
  - "exchange-dev.corpbreak.co.kr"

replicas: 1
container_port: 8080

secrets:
  common: "app-common-credentials-dev"
  custom_secrets:
    APP_DEBUG: "true"
    LOG_LEVEL: "debug"
```

### 운영 환경 (deploy-config-prod.yaml)
```yaml
project: "corpbreak"
name: "exchange"

app:
  type: "spring"

labels:
  component: "backend"
  tier: "service"

domains:
  - "exchange.corpbreak.co.kr"
  - "exchange.corpbreak.com"

replicas: 3
container_port: 8080

secrets:
  common: "app-common-credentials-prod"
  additional_secret_refs:
    - name: "mysql-credentials-prod"
    - name: "monitoring-credentials-prod"
  custom_secrets:
    APP_DEBUG: "false"
    LOG_LEVEL: "info"

persistence:
  enabled: true
  size: "20Gi"
  path: "/app/uploads"
```

## 🚀 Jenkins 배포 파라미터

새로운 배포 시스템에서는 Jenkins 파라미터가 대폭 단순화됩니다:

| 파라미터 | 설명 | 필수 여부 |
|----------|------|-----------|
| ENV | 배포 환경 (dev, prod) | ✅ 필수 |
| APP_REPO | 애플리케이션 저장소 URL | ✅ 필수 |
| BRANCH | 배포할 브랜치명 | ✅ 필수 |
| IMAGE_TAG | 이미지 태그 (빈값시 새로 빌드) | ⭕ 선택 |
| SKIP_BUILD | 빌드 스킵 여부 | ⭕ 선택 |

## 🔍 앱 타입별 설정 가이드

### Spring Boot
```yaml
app:
  type: "spring"
container_port: 8080
```

### Next.js
```yaml
app:
  type: "nextjs"
container_port: 3000
```

### Express.js
```yaml
app:
  type: "express"
container_port: 3000
```

### PHP
```yaml
app:
  type: "php"
container_port: 80
```

### Spring Multi-Module
```yaml
app:
  type: "spring-multi-module"
  module_name: "user-service"    # 빌드할 모듈명 필수
container_port: 8080
```

## ⚠️ 주의사항

### 1. 도메인 설정
- 도메인은 반드시 `tld_mappings`에 정의된 TLD를 사용해야 합니다
- 개발환경: `*-dev.도메인` 형식 권장
- 운영환경: 실제 서비스 도메인 사용

### 2. 시크릿 관리
- `common` 시크릿은 모든 앱이 공통으로 사용하는 설정 포함
- `custom_secrets`에는 민감하지 않은 설정만 포함 (Git에 저장됨)
- 실제 민감한 정보는 쿠버네티스 시크릿으로 별도 관리

### 3. 리소스 설정
- 개발환경: `replicas: 1` 권장
- 운영환경: 최소 `replicas: 2` 이상 권장
- `container_port`는 앱 타입에 맞게 설정

## 🔧 트러블슈팅

### 배포 실패 시 체크사항
1. ✅ 도메인이 올바른 TLD를 사용하는지 확인
2. ✅ `container_port`가 앱 타입과 일치하는지 확인
3. ✅ 참조하는 시크릿이 실제로 존재하는지 확인
4. ✅ 볼륨 설정이 올바른지 확인 (persistence 사용시)

### 자주 발생하는 오류
- **TLD 매핑 오류**: 사용하지 않는 TLD의 도메인 사용
- **포트 불일치**: Spring 앱에 3000번 포트 설정 등
- **시크릿 미존재**: 참조하는 시크릿이 쿠버네티스에 없음