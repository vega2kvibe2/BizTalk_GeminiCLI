import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage

load_dotenv()
api_key = os.getenv("UPSTAGE_API_KEY")
print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")

chat = ChatUpstage(model="solar-10.7b-instruct", upstage_api_key=api_key)
try:
    response = chat.invoke("Hello")
    print("Success!")
    print(response.content)
except Exception as e:
    print(f"Error: {e}")
