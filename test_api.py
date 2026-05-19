import requests
import json

url = "http://localhost:8000/api/convert"
data = {
    "text": "내일까지 보고서 제출 어려울 것 같음",
    "target_audience": "boss"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
except Exception as e:
    print(f"Error: {e}")
