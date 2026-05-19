from pydantic import BaseModel, Field

class ConvertRequest(BaseModel):
    text: str = Field(..., min_length=1, description="변환할 원문 텍스트")
    target_audience: str = Field(..., description="수신 대상 (boss, colleague, client, team)")

class ConvertResponse(BaseModel):
    converted_text: str
    target_audience: str
    original_text: str
