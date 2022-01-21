addEventListener("load", () => {
  let bulletinEl = document.getElementsByClassName("bulletin")[0];
  fetch("/data/bulletin.json")
    .then((data) => data.json())
    .then((json) => {
      json.forEach((v) => {
        if (v?.type !== 0) return;
        let div = document.createElement("div");
        div.classList.add("msg");
        let mention_roles = {},
          mention_channels = {};
        v.mention_roles?.forEach(
          (mention) => (mention_roles[mention.id] = mention)
        );
        v.mention_channels?.forEach(
          (mention) => (mention_channels[mention.id] = mention)
        );
        v.content = v.content
          ?.replaceAll(/\\?<(@|@!|@&)[0-9]+>/gm, (src, index) => {
            if (index !== 0 && src[0] === "\\") return src.substring(1);
            let role = mention_roles[/[0-9]+/.exec(src)];
            if (!role) return src;
            let color = role.color?.toString(16);
            return `<span class="mention" style="color: #${color};background-color: #${color}1a;--have-color: #${color}50">@${role.name}</span>`;
          })
          ?.replaceAll(
            /(https?:\/\/(www\.)?[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|discord\.gg\/[a-zA-Z0-9]*)/gm,
            (src) => `<a href="https://${src}">${src}</a>`
          )
          ?.replaceAll(/\\?<(#)[0-9]+>/gm, (src, index) => {
            if (index !== 0 && src[0] === "\\") return src.substring(1);
            let channel = mention_channels[/[0-9]+/.exec(src)];
            if (!channel) return src;
            return `<a href="https://discord.com/channels/${channel.guild_id}/${channel.id}" class="mention mention_channel">#${channel.name}</a>`;
          });
        div.innerHTML = `<div class="info"><div class="author"><img src="https://cdn.discordapp.com/avatars/${
          v.author.id
        }/${v.author.avatar}.png" alt="" class="radius"><p>${
          v.author.username
        }</p></div><div class="timestamp">${new Date().toLocaleString("zh-TW", {
          timeZone: "Asia/Taipei",
        })}</div></div><div class="content">${
          v.content
        }</div><div class="embeds"></div>`;
        bulletinEl.appendChild(div);
      });
    });
});
