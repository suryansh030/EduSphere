from dotenv import load_dotenv, find_dotenv
import os

env_path = find_dotenv()
load_dotenv(env_path)

print("ENV FILE FOUND AT:", env_path)
print("GITHUB_TOKEN:", os.getenv("GITHUB_TOKEN"))
print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))
