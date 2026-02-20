# 백엔드 컨텍스트: BizTone Converter API 서버

## 1. 개요 및 아키텍처

이 디렉터리는 **BizTone Converter** 프로젝트의 백엔드 서버를 포함하고 있습니다. **Python Flask** 프레임워크를 기반으로 구축되었으며, 주된 역할은 다음과 같습니다.

1.  **정적 파일 제공**: 프론트엔드(`../frontend`) 빌드 결과물을 웹 브라우저에 제공합니다.
2.  **AI 말투 변환 API 제공**: `Groq AI` 클라우드 서비스를 활용하여 텍스트 말투를 변환하는 핵심 비즈니스 로직을 수행합니다.

핵심 로직은 모두 `app.py` 단일 파일에 구현되어 있어 구조가 매우 간결합니다.

## 2. 주요 파일

-   **`app.py`**: Flask 애플리케이션의 메인 엔트리 포인트입니다. 서버 실행, API 엔드포인트 정의, Groq AI 연동 및 프롬프트 관리 등 모든 백엔드 로직이 이 파일에 포함되어 있습니다.
-   **`requirements.txt`**: 백엔드 서버 실행에 필요한 Python 패키지 의존성 목록입니다.
    -   `Flask`: 웹 프레임워크
    -   `python-dotenv`: `.env` 파일로부터 환경 변수를 로드
    -   `Flask-CORS`: CORS(Cross-Origin Resource Sharing) 처리
    -   `groq`: Groq AI API 사용을 위한 공식 SDK

## 3. 핵심 로직: 말투 변환 API

### `POST /api/convert`

-   **요청 (Request Body)**:
    -   `text` (string): 변환할 원본 텍스트
    -   `target` (string): 변환 대상 (`Upward`, `Lateral`, `External` 중 하나)
    ```json
    {
        "text": "이거 오늘까지 되나요?",
        "target": "Upward"
    }
    ```

-   **핵심 처리 과정**:
    1.  요청에서 `target` 값을 받아 `PROMPT_TEMPLATES` 딕셔너리에서 해당 대상에 맞는 **시스템 프롬프트**를 조회합니다.
    2.  이 시스템 프롬프트와 사용자가 입력한 `text`를 조합하여 Groq AI 모델(`moonshotai/kimi-k2-instruct-0905`)에 전달할 메시지를 구성합니다.
    3.  Groq API를 호출하여 변환된 텍스트를 응답받습니다.
    4.  API 호출 성공 또는 실패 시, 관련 정보를 로깅합니다.

-   **응답 (Response Body)**:
    -   성공 시 (200 OK):
        ```json
        {
            "original_text": "이거 오늘까지 되나요?",
            "converted_text": "팀장님, 혹시 해당 업무를 오늘까지 완료하는 것이 가능할지 문의드립니다.",
            "target": "Upward"
        }
        ```
    -   실패 시 (4xx or 5xx):
        ```json
        {
            "error": "에러 메시지"
        }
        ```

## 4. 실행 및 개발 가이드

### 4.1. 서버 실행

1.  **의존성 설치**: `backend` 디렉터리 또는 프로젝트 루트에서 아래 명령어를 실행합니다.
    ```bash
    pip install -r requirements.txt
    ```
2.  **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 Groq API 키를 추가합니다.
    ```
    GROQ_API_KEY=YOUR_GROQ_API_KEY
    ```
3.  **개발 서버 실행**:
    ```bash
    python app.py
    ```
    서버는 기본적으로 `http://127.0.0.1:5000`에서 디버그 모드로 실행됩니다.

### 4.2. 주요 수정 영역

-   **AI 변환 로직 수정**: 말투 변환 결과물의 퀄리티를 개선하려면 `app.py`의 `PROMPT_TEMPLATES` 딕셔너리에 있는 시스템 프롬프트의 내용을 수정해야 합니다. 각 대상(`Upward`, `Lateral`, `External`)별 규칙을 조정하여 AI의 행동을 제어할 수 있습니다.
-   **AI 모델 변경**: 다른 AI 모델을 사용하려면 `client.chat.completions.create` 함수의 `model` 파라미터를 변경하면 됩니다.
-   **API 파라미터 튜닝**: `temperature`, `max_tokens` 등 AI 모델의 파라미터를 조정하여 응답의 창의성이나 길이를 제어할 수 있습니다.
