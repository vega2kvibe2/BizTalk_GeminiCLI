import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq, GroqError

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# .env 파일에서 환경 변수 로드
load_dotenv()

# Flask 앱 설정
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Groq 클라이언트 초기화
try:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    if not os.environ.get("GROQ_API_KEY"):
        logging.warning("GROQ_API_KEY 환경 변수가 설정되지 않았습니다. API 호출이 실패할 수 있습니다.")
except Exception as e:
    logging.error(f"Groq 클라이언트 초기화 실패: {e}")
    client = None

# 대상별 시스템 프롬프트 정의
PROMPT_TEMPLATES = {
    "Upward": """
        당신은 비즈니스 커뮤니케이션을 위한 AI 조수입니다. 
        신입사원이 상사에게 보고하기 위해 작성한 초안을 정중하고 격식 있으며, 명확한 보고 형식의 문장으로 변환합니다.
        
        규칙:
        1. 결론부터 먼저 제시하고, 그 다음에 이유나 배경을 설명하는 두괄식으로 구성합니다.
        2. 톤은 존중하는 태도를 유지하며 전문적이어야 합니다.
        3. 불필요한 미사여구나 사적인 감정 표현은 제거하고, 사실 위주로 간결하게 작성합니다.
        4. 최종 결과물만 한국어로 제공하고, 다른 설명은 덧붙이지 않습니다.
    """,
    "Lateral": """
        당신은 비즈니스 커뮤니케이션을 위한 AI 조수입니다. 
        사용자가 다른 팀의 동료에게 보낼 메시지의 초안을 협조를 요청하기에 적합한, 친절하고 상호 존중하는 어조의 메시지로 변환합니다.

        규칙:
        1. 요청 사항과 배경, 그리고 기대하는 마감 기한이 있다면 명확하게 전달합니다.
        2. 톤은 협조적이고 정중하며, 긍정적인 태도를 유지합니다.
        3. '부탁드립니다', '감사합니다'와 같은 협업을 위한 표현을 적절히 사용합니다.
        4. 최종 결과물만 한국어로 제공하고, 다른 설명은 덧붙이지 않습니다.
    """,
    "External": """
        당신은 고객 응대를 위한 최고의 전문가 AI입니다.
        사용자가 고객에게 보낼 메시지의 초안을 매우 전문적이고 신뢰감을 주는 정중한 메시지로 변환합니다.

        규칙:
        1. 극존칭을 일관되게 사용하고, 고객에 대한 존중을 표현합니다.
        2. 회사의 전문성과 서비스 마인드가 드러나는 톤을 유지합니다.
        3. 안내, 답변, 사과 등 메시지의 목적을 명확히 하고, 고객이 이해하기 쉽게 작성합니다.
        4. 최종 결과물만 한국어로 제공하고, 다른 설명은 덧붙이지 않습니다.
    """
}

@app.route('/')
def serve_index():
    """루트 URL 요청 시 frontend/index.html 파일을 제공합니다."""
    return app.send_static_file('index.html')

@app.route('/api/convert', methods=['POST'])
def convert_tone():
    """
    사용자로부터 텍스트와 변환 대상을 받아, Groq AI를 통해 변환된 텍스트를 반환합니다.
    """
    if not client:
        logging.error("Groq 클라이언트가 초기화되지 않았습니다.")
        return jsonify({"error": "AI 서비스가 준비되지 않았습니다. 관리자에게 문의하세요."}), 503

    if not request.json or 'text' not in request.json or 'target' not in request.json:
        return jsonify({"error": "잘못된 요청입니다. 'text'와 'target' 필드가 필요합니다."}), 400

    data = request.json
    user_text = data['text']
    target = data.get('target') # 'Upward', 'Lateral', 'External'

    if not target or target not in PROMPT_TEMPLATES:
        return jsonify({"error": f"알 수 없거나 지원되지 않는 대상입니다: {target}"}), 400

    system_prompt = PROMPT_TEMPLATES[target]

    logging.info(f"변환 요청: 대상={target}, 원문='{user_text[:30]}...'")

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_text,
                },
            ],
            model="moonshotai/kimi-k2-instruct-0905",
            temperature=0.5,
            max_tokens=1024,
            top_p=1,
        )

        converted_text = chat_completion.choices[0].message.content
        logging.info(f"변환 성공: 결과='{converted_text[:30]}...'")
        
        return jsonify({
            "original_text": user_text,
            "converted_text": converted_text,
            "target": target
        })

    except GroqError as e:
        logging.error(f"Groq API 오류: {e}")
        return jsonify({"error": f"AI 서비스에서 오류가 발생했습니다: {e.message}"}), 502
    except Exception as e:
        logging.error(f"알 수 없는 서버 오류: {e}")
        return jsonify({"error": "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
