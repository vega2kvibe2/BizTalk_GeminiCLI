import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routers import convert

app = FastAPI(title="Business Tone Converter API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실운영 환경에서는 허용할 도메인을 명시하는 것이 좋음
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 포함
app.include_router(convert.router, prefix="/api")

# 헬스 체크 엔드포인트
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# 프론트엔드 정적 파일 서빙
frontend_path = os.path.join(os.getcwd(), "frontend")
if os.path.exists(frontend_path):
    # 루트(/)에 정적 파일을 마운트하여 index.html 및 하위 파일(css, js)을 직접 서빙
    # html=True 옵션으로 / 접속 시 index.html을 자동으로 찾습니다.
    # 중요: API 라우터들이 이 마운트보다 먼저 등록되어야 API 요청이 올바르게 처리됩니다.
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
