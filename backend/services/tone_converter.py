import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from backend.prompts.templates import PROMPTS

# .env 파일 로드
load_dotenv(override=True)

class ToneConverter:
    def __init__(self):
        api_key = os.getenv("UPSTAGE_API_KEY")
        if not api_key:
            raise ValueError("UPSTAGE_API_KEY가 설정되지 않았습니다.")
        
        # 모델 설정 (PRD에 명시된 solar-pro 사용)
        self.llm = ChatUpstage(
            model="solar-pro",
            upstage_api_key=api_key
        )

    async def convert(self, text: str, target_audience: str) -> str:
        if target_audience not in PROMPTS:
            raise ValueError(f"지원하지 않는 수신 대상입니다: {target_audience}")

        system_prompt = PROMPTS[target_audience]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}")
        ])

        chain = prompt | self.llm
        
        response = await chain.ainvoke({"text": text})
        return response.content.strip()
