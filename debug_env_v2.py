import os
from dotenv import load_dotenv

load_dotenv(override=True)
api_key = os.getenv("UPSTAGE_API_KEY")
print(f"API Key Value: '{api_key}'")
