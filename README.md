# 핀드 - 내 추억 속의 랜드마크
&lt;공모전 출품용> 지역 랜드마크와 관련된 내 추억을 공유하는 지도 기반 웹 SNS 서비스

SNS Link(Disabled): [Link](https://mypinnedlandmark.bnbong.tk/)

## Developers  
1. 이준혁 (팀장, 백엔드, 프로젝트 설계 및 디자인, 스프린트 매니징, 아키텍처 설계)
2. 박종윤 (백엔드, API 테스트)
3. 최수용 (프론트엔드, UI/UX 디자인 및 구현)
4. 허재원 (프론트엔드, UI/UX 디자인 및 구현)

# About App

## 1. Stack
* Framework: Backend - Django, Python / Frontend - Next.js, tailwind.css
* DB: PostgreSQL
* Cache DB: Redis
* Proxy: Nginx
* Container: Docker

## 2. Directory Tree
```
├── .github (sources of github templates)
├── project_pinned (backend sources)
│   ├── project_pinned (sources)
│   │   └── source files ...
│   ├── Dockerfile (백엔드 앱 컨테이너 빌드 파일)
│   ├── manage.py
│   ├── setup.cfg (linter or test env configurations)
│   ├── setup.py (configurations)
│   ├── serviceAccountKey.json (개발자 각자 반드시 개인적으로 받아야 하는 파일)
│   ├── requirements.txt (백엔드 프로젝트 의존성 파일)
│   └── .env (개발자 각자 반드시 개인적으로 받아야 하는 파일)
│
├── nginx (proxy service)
│
├── front (frontend sources)
│   ├── components
│   │   └── source files ...
│   ├── contexts
│   │   └── source files ...
│   ├── HOC
│   │   └── source files ...
│   ├── hook
│   │   └── source files ...
│   ├── pages
│   │   └── source files ...
│   ├── public
│   │   └── source files ...
│   ├── styles
│   │   └── source files ...
│   ├── utils
│   │   └── source files ...
│   ├── .babelrc
│   ├── .dockerignore
│   ├── .env (개발자 각자 반드시 개인적으로 받아야 하는 파일)
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── Dockerfile (프론트 앱 컨테이너 빌드 파일)
│   ├── jsonconfig.json
│   ├── next,config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js (framework config file)
│   ├── tailwind.config.js (framework config file)
│   └── README.md
├── .env (개발자 각자 반드시 개인적으로 받아야 하는 파일)
├── .gitignore
├── docker-compose.yml (build containers for development)
├── docker-compose.test.yml (build containers for before deployment, check availability)
├── docker-compose.prod.yml (build containers for production)
├── scripts
│   ├── apitest.sh (API test script - backend)
│   ├── build_dev.sh (build script for development)
│   ├── build_test.sh (build script for before deployment, check availability)
│   └── build_prod.sh (build script for production)
└── README.md
```

## 3. API Docs
API endpoint에 대한 설명이 기재되어 있습니다: 
 - [Swagger Link](https://mypinnedlandmark.bnbong.tk/api/swagger)
 - [Github wiki Link](https://github.com/bnbong/Project-Pinned/wiki/API-documentation)

## 4. DB Schemas
PostgreSQL Database에 구현된 Table에 대한 schema가 정의되어 있습니다: [Link](https://github.com/bnbong/Project-Pinned/wiki/DB-Schemas)

## 5. UI/UX Diagrams
프론트 뷰에 구현된 UI/UX 다이어그램이 정의되어 있습니다(업로드 예정): [Link](https://github.com/bnbong/Project-Pinned/wiki/UI-UX-Diagram)

# Contribution Guide

## 필수 환경
 - Python 3.10.10 버전 이상 혹은 해당 버전의 Python
 - Git
 - Docker

## 개발 환경 구성

1. 현재 github repository를 작업할 Local 디렉토리에 clone: `git clone git@github.com:bnbong/Project-Pinned.git`
2. 디렉토리에 python 가상 환경을 구성: `python -m venv pinn-venv`
3. python 가상 환경으로 접속: 
   - Mac / Linux: `source pinn-venv/bin/activate`
   - Window: `.pinn-venv/Scripts/activate`
4. 의존성 설치: `pip install -r requirements.txt`
5. IDE가 venv 속 python과 linter로 pylint를 사용하도록 변경: `depends on your IDE environment.`
6. 공유받은 .env 파일을 프로젝트 디렉토리에 저장: `없다면 팀장에게 개인 연락 혹은 메일하기 (bbbong9@gmail.com)`
7. 정의된 컨테이너들을 빌드: `bash scripts/build_dev.sh`
8. 프론트 앱을 빌드: `cd front & npm install & npm run build & npm run dev`
9. 컨테이너들이 정상적으로 빌드가 되었는지 확인.
10. localhost 환경에서 개발하기, 이때 프론트 앱은 `localhost:3000`에서 확인 가능(**브라우저의 CORS 기능을 꺼준 상태에서 개발하기**).
11. 개발이 완료되면 컨테이너들을 종료: `bash scripts/stop_dev.sh`
12. 파이썬 가상환경을 종료: `deactivate`

## Contribution Guide
코딩 컨벤션, 커밋 메시지 작성 방법, branch 전략, document contribution 방법이 기재되어 있습니다: [Link](https://github.com/bnbong/Project-Pinned/wiki/Contribution-Guide)
