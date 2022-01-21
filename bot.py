import requests
from dotenv import load_dotenv
import os
import json

load_dotenv(".env.local")


data = requests.get("https://discord.com/api/v9/channels/887690155027222598/messages?limit=5",  headers={
    "Authorization": f"Bot {os.getenv('token')}"
})
if data.status_code == 200:
    with open("msgs.json", "w", encoding="utf-8") as file:
        json.dump(data.json(), file)
    print()
