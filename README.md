# 핀드 - 내 추억 속의 랜드마크
&lt;공모전 출품용> 지역 랜드마크와 관련된 내 추억을 공유하는 지도 기반 웹 SNS 서비스

## Developers  
1. 이준혁
2. 박종윤
3. 최수용
4. 허재원

# About App

## 1. Stack
* Framework: Django, Python.
* DB: PostgreSQL
* Cache DB: Redis
* Container: Docker

## 2. Directory Tree
```
├── .github (sources of github templates)
├── project_pinned
│   ├── project_pinned (sources)
│   │   └── source files ...
│   ├── manage.py
│   └── setup.cfg (linter or test env configurations)
├── .env (개발자 각자 반드시 개인적으로 받아야 하는 파일)
├── .gitignore
├── docker-compose.yml (for build containers like DB, Cache DB, etc..)
├── Dockerfile (for build main web application)
├── README.md
└── requirements.txt
```

## 3. API Docs
API endpoint에 대한 설명이 기재되어 있습니다(업로드 예정): [Link](https://github.com/bnbong/Project-Pinned/wiki/API-documentation)

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
3. python 가상 환경으로 접속: `source pinn-venv/bin/activate`
4. 의존성 설치: `pip install -r requirements.txt`
5. IDE가 venv 속 python과 linter로 pylint를 사용하도록 변경: `depends on your IDE environment.`
6. 공유받은 .env 파일을 프로젝트 디렉토리에 저장: `없다면 팀장에게 개인 연락 혹은 메일하기 (bbbong9@gmail.com)`
7. 정의된 컨테이너들을 빌드: `docker compose up`
8. 컨테이너들이 정상적으로 빌드가 되었는지 확인.

## Contribution Guide
코딩 컨벤션, 커밋 메시지 작성 방법, branch 전략, document contribution 방법이 기재되어 있습니다: [Link](https://github.com/bnbong/Project-Pinned/wiki/Contribution-Guide)
