from dotenv import load_dotenv
import os

load_dotenv()

print("GITHUB_TOKEN:", os.getenv("GITHUB_TOKEN"))
print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))