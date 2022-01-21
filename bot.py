import requests
from dotenv import load_dotenv
import os
import json
import re


load_dotenv(".env.local")
guild_id = 808945802100736050
channel_id = 887690155027222598

data = requests.get(f"https://discord.com/api/v9/channels/{channel_id}/messages?limit=5",  headers={
    "Authorization": f"Bot {os.getenv('token')}"
})
if data.status_code == 200:
    data = data.json()
    roles = {}
    channels = {}
    for i in requests.get(f"https://discord.com/api/v9//guilds/{guild_id}/roles", headers={
        "Authorization": f"Bot {os.getenv('token')}"
    }).json():
        roles[i["id"]] = i
    for i in requests.get(f"https://discord.com/api/v9//guilds/{guild_id}/channels", headers={
        "Authorization": f"Bot {os.getenv('token')}"
    }).json():
        channels[i["id"]] = i
    for i in data:
        i["mention_roles"] = [roles[role] for role in i["mention_roles"]]
        i["mention_channels"] = []
        for ch_id in re.findall(r"<#([0-9]+)>", i["content"]):
            if ch_id in channels:
                i["mention_channels"].append(channels[ch_id])
    with open("msgs.json", "w", encoding="utf-8") as file:
        json.dump(data, file)
