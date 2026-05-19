import os
from dotenv import load_dotenv

print(f"Current Working Directory: {os.getcwd()}")
print(f".env exists: {os.path.exists('.env')}")

load_dotenv()
api_key = os.getenv("UPSTAGE_API_KEY")
print(f"API Key Value: '{api_key}'")
