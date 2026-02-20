# 프로젝트 컨텍스트: BizTone Converter

## 1. 프로젝트 개요

**BizTone Converter**는 사용자의 일상적인 표현을 전문적인 비즈니스 언어로 변환해주는 AI 기반 웹 애플리케이션입니다. `PRD.md` 문서에 따르면, 이 프로젝트는 신입사원이나 비즈니스 커뮤니케이션에 익숙하지 않은 사용자가 대상(상사, 동료, 고객)과 상황에 맞는 적절한 톤앤매너의 문장을 생성할 수 있도록 돕는 것을 목표로 합니다.

**주요 기능:**
-   **대상별 말투 변환**: '상사(Upward)', '타팀 동료(Lateral)', '고객(External)' 세 가지 대상에 맞춰 텍스트를 변환합니다.
-   **실시간 UI**: 입력한 텍스트와 변환된 결과를 나란히 비교하며, 글자 수 카운팅, 복사하기 등의 편의 기능을 제공합니다.

## 2. 기술 아키텍처

이 프로젝트는 서버와 클라이언트가 명확하게 분리된 구조를 가집니다.

-   **프론트엔드 (`frontend/`)**:
    -   순수 HTML, CSS, JavaScript로 구성된 정적 웹 페이지입니다.
    -   **Tailwind CSS (Play CDN)** 를 사용하여 현대적이고 반응성이 뛰어난 UI를 구현했습니다.
    -   사용자 인터페이스와 관련된 모든 로직은 `frontend/js/script.js`에 포함되어 있으며, 백엔드 API를 비동기적으로 호출합니다.

-   **백엔드 (`backend/`)**:
    -   **Python Flask** 프레임워크를 사용하여 RESTful API 서버를 구축했습니다.
    -   `backend/app.py`는 단일 파일로 API 엔드포인트와 정적 파일 제공을 모두 처리합니다.
    -   **Groq AI API**를 연동하여 실제 텍스트 변환 로직을 수행합니다.
        -   AI 모델: `moonshotai/kimi-k2-instruct-0905`
    -   `.env` 파일을 통해 API 키와 같은 민감한 정보를 관리합니다.

-   **API 엔드포인트**:
    -   `POST /api/convert`: 텍스트와 변환 대상(`target`)을 받아 AI 모델을 통해 변환된 결과를 JSON 형태로 반환합니다.

## 3. 빌드 및 실행 방법

이 프로젝트는 별도의 빌드 과정 없이 바로 실행할 수 있습니다.

### 3.1. 사전 준비

1.  **Python 가상 환경 설정**:
    ```bash
    # 프로젝트 루트에서 실행
    python -m venv .venv
    source .venv/Scripts/activate  # Windows
    # source .venv/bin/activate    # macOS/Linux
    ```

2.  **백엔드 의존성 설치**:
    ```bash
    pip install -r backend/requirements.txt
    ```

3.  **환경 변수 설정**:
    -   프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 추가합니다. `YOUR_GROQ_API_KEY` 부분은 실제 발급받은 키로 대체해야 합니다.
    ```
    GROQ_API_KEY=YOUR_GROQ_API_KEY
    ```

### 3.2. 애플리케이션 실행

-   **백엔드 서버 실행**:
    -   아래 명령어를 실행하여 Flask 개발 서버를 시작합니다. 서버는 기본적으로 `http://127.0.0.1:5000`에서 실행됩니다.
    ```bash
    python backend/app.py
    ```
-   **프론트엔드 접속**:
    -   웹 브라우저를 열고 `http://127.0.0.1:5000` 주소로 접속하면 애플리케이션을 사용할 수 있습니다. Flask 서버가 프론트엔드 파일을 자동으로 제공합니다.

## 4. 개발 컨벤션

-   **프롬프트 엔지니어링**: AI의 역할과 규칙을 정의하는 시스템 프롬프트는 `backend/app.py` 내의 `PROMPT_TEMPLATES` 딕셔너리에서 관리됩니다. 말투 변환의 핵심 로직이므로, 결과물 퀄리티 개선 시 이 부분을 수정해야 합니다.
-   **데이터 형식**: 프론트엔드와 백엔드는 `target` 필드를 통해 변환 대상을 주고받습니다. 이 값은 `Upward`, `Lateral`, `External` 중 하나여야 합니다.
-   **스타일링**: 프론트엔드의 모든 스타일은 Tailwind CSS 유틸리티 클래스를 사용하는 것을 원칙으로 합니다. 커스텀 CSS는 최소화하며, 필요한 경우 `frontend/index.html` 내의 `<style type="text/tailwindcss">` 블록에 `@layer` 규칙을 사용하여 추가합니다.
-   **브랜치 전략**: `PRD.md`에 따르면 `feature -> develop -> main` 브랜치 전략을 사용하는 것으로 계획되어 있습니다.
