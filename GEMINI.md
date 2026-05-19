# GEMINI.md — 업무 말투 변환기 프로젝트 지침

이 파일은 **업무 말투 변환기** 프로젝트의 구조, 기술 스택, 개발 원칙 및 실행 방법을 정의합니다. 향후 모든 작업은 이 문서의 지침을 따릅니다.

---

## 1. 프로젝트 개요 (Project Overview)

**업무 말투 변환기**는 사용자가 입력한 일상적인 말투를 수신 대상(상사, 동료, 고객 등)에 적합한 비즈니스 언어로 변환해주는 AI 서비스입니다. 

- **핵심 목표**: 비즈니스 커뮤니케이션의 심리적 문턱을 낮추고 메시지 작성 시간을 단축합니다.
- **주요 기능**: 
  - 4가지 수신 대상별(상사, 타팀 동료, 고객, 팀 내 동료) 맞춤형 말투 변환.
  - Upstage Solar-Pro2 모델을 활용한 고품질 한국어 비즈니스 문장 생성.

---

## 2. 기술 스택 (Tech Stack)

| 영역 | 기술 |
|------|------|
| **프론트엔드** | HTML5, CSS3, JavaScript (Vanilla JS) |
| **백엔드** | Python 3.11+, FastAPI, Uvicorn |
| **AI/LLM** | Upstage Solar-Pro2, LangChain, langchain-upstage |
| **배포** | Vercel (프론트엔드), GitHub |

---

## 3. 개발 원칙: 바이브 코딩(Vibe Coding) 3원칙

이 프로젝트는 신속하고 효율적인 개발을 위해 다음 3원칙을 엄격히 준수합니다.

1. **완료 기준을 먼저 정의하라**: 작업을 시작하기 전 "무엇을 만들면 끝인지" 체크리스트를 명확히 합니다.
2. **조사 먼저, 구현 나중**: 새로운 API나 라이브러리를 사용하기 전, 공식 문서나 연동 방법을 먼저 파악한 후 코드를 작성합니다.
3. **버그는 분석 먼저, 수정 나중**: 에러 발생 시 원인을 먼저 분석하고 설명한 뒤 수정을 진행합니다. 임의의 코드 수정을 지양합니다.

---

## 4. 디렉토리 구조 (Directory Structure)

프로젝트는 다음과 같은 구조로 구성될 예정입니다.

```text
biztone-converter/
├── backend/                # FastAPI 서버 및 AI 로직
│   ├── main.py             # 앱 진입점 및 CORS 설정
│   ├── routers/            # API 엔드포인트 (/api/convert)
│   ├── services/           # LangChain + Solar-Pro2 연동 로직
│   ├── prompts/            # 수신 대상별 프롬프트 템플릿
│   ├── models/             # Pydantic 데이터 모델
│   └── requirements.txt    # 백엔드 의존성 파일
├── frontend/               # 정적 웹 페이지
│   ├── index.html          # 메인 화면
│   ├── css/style.css       # 스타일시트
│   └── js/app.js           # 프론트엔드 로직
├── .env                    # API 키 관리 (UPSTAGE_API_KEY)
└── .gitignore              # .env 및 캐시 파일 제외
```

---

## 5. 실행 및 빌드 (Running & Building)

### 백엔드 실행
1. 필요한 패키지 설치:
   ```bash
   pip install fastapi uvicorn langchain langchain-upstage python-dotenv
   ```
2. 서버 실행:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

### 프론트엔드 실행
- `frontend/index.html` 파일을 브라우저에서 직접 열거나 VS Code Live Server 등을 사용합니다.

---

## 6. 개발 컨벤션 (Conventions)

- **환경 변수**: `UPSTAGE_API_KEY`는 반드시 `.env` 파일에 보관하며, 절대 버전 관리 시스템에 포함시키지 않습니다.
- **코드 스타일**: 명확하고 직관적인 변수 및 함수 이름을 사용하며, 비즈니스 로직과 API 라우팅을 분리합니다.
- **프롬프트 관리**: `backend/prompts/templates.py`에서 수신 대상별 프롬프트를 중앙 집중식으로 관리합니다.

---

> **참고 문서**: 
> - 상세 기능 명세: [PRD_업무말투변환기.md](./PRD_업무말투변환기.md)
> - 프로그램 개요: [개요서_업무말투변환기.md](./개요서_업무말투변환기.md)

---
### Source Code가 변경되거나 라이브러리 버전이 변경되면 반드시 @PRD_업무말투변환기.md 문서도 반드시 같이 업데이트 합니다.
* 구현이 완료된 사항들은 완료 체크리스트에 모두 체크표시를 해서 완료되었음을 표시하세요.