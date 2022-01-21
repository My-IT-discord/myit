import axios from "axios";
import fs from "fs";
import { config } from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bulletin = require("./data/bulletin.json");

config({ path: ".env.local" });
const Token = process.env.TOKEN;

const guild_id = 808945802100736050n;
const channel_id = 887690155027222598n;
const BASE_URL = "https://discord.com/api/v9";
const limit = 5;

(async () => {
  let { data: messages } = await axios.get(
    `${BASE_URL}/channels/${channel_id}/messages?limit=${limit}`,
    { headers: { Authorization: `Bot ${Token}` } }
  );
  let { data: roles } = await axios.get(
    `${BASE_URL}/guilds/${guild_id}/roles`,
    { headers: { Authorization: `Bot ${Token}` } }
  );
  let { data: channels } = await axios.get(
    `${BASE_URL}/guilds/${guild_id}/channels`,
    { headers: { Authorization: `Bot ${Token}` } }
  );
  roles = Object.fromEntries(roles.map((v) => [v.id, v]));
  channels = Object.fromEntries(channels.map((v) => [v.id, v]));
  let newData = messages.map((msg) => {
    let msg_roles = {};
    msg.mention_roles?.forEach(
      (role) => role in roles && (msg_roles[role] = roles[role])
    );
    msg.mention_channels ||= {};
    (msg.content.match(/<#[0-9]+>/gm) || [])
      .map((v) => v.match(/[0-9]+/)?.[0])
      .filter((v) => v)
      .forEach(
        (channelId) =>
          channelId in channels &&
          (msg.mention_channels[channelId] = channels[channelId])
      );
    msg.mention_roles = msg_roles;
    return msg;
  });
  if (
    bulletin[0].timestamp === newData[0].timestamp &&
    bulletin[0].edited_timestamp === newData[0].edited_timestamp
  )
    return;
  fs.writeFile("data/bulletin.json", JSON.stringify(newData), (e) =>
    console.log(e)
  );
})();
