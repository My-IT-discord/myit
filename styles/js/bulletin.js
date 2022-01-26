addEventListener("load", () => {
  let bulletinEl = document.getElementsByClassName("bulletin")[0];
  fetch("data/bulletin.json")
    .then((data) => data.json())
    .then((json) => {
      json.forEach((v) => {
        if (v?.type !== 0) return;
        let div = document.createElement("div");
        div.classList.add("msg");
        let mention_roles = v.mention_roles,
          mention_channels = v.mention_channels;
        v.content = v.content
          ?.replaceAll(
            /(https?:\/\/(www\.)?[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|discord\.gg\/[a-zA-Z0-9]*)/gm,
            (src) => `<a href="${src}">${src}</a>`
          )
          ?.replaceAll(
            /(?<!\\)<(@&|@!|@)(?<roleId>[0-9]+)>/gmu,
            (src, _, roleId) => {
              let role = mention_roles[roleId];
              if (!role) return src;
              let color = role.color?.toString(16);
              return `<span class="mention" style="color: #${color};background-color: #${color}1a;--have-color: #${color}50">@${role.name}</span>`;
            }
          )
          ?.replaceAll(
            /(?<!\\)<[^ ]*:[^ ]+:(?<emojiId>[0-9]+)>/gmu,
            (src, emojiId) => {
              console.log(src);
              return `<img emoji class="emoji" src="https://cdn.discordapp.com/emojis/${emojiId}.png"/>`;
            }
          )
          ?.replaceAll(/(?<!\\)<(#)[0-9]+>/gm, (src) => {
            let channel = mention_channels[/[0-9]+/.exec(src)];
            if (!channel) return src;
            return `<a href="https://discord.com/channels/${channel.guild_id}/${channel.id}" class="mention mention_channel">#${channel.name}</a>`;
          })
          ?.replaceAll(
            /(?<!\\)\|(?<!\\)\|.*(?<!\\)\|(?<!\\)\|/gmu,
            (src) => `<span class="spoilerText">${src.slice(2, -2)}</span>`
          )
          ?.replaceAll(
            /^> .+/gm,
            (src, index, _src) =>
              `${
                /^> .+/.test(_src.slice(0, index).split(/^/).slice(-1))
                  ? ""
                  : "<blockquote>"
              }${src.substring(1)}${
                /^> .+/.test(_src.slice(index).split("\n").slice(1)[0])
                  ? ""
                  : "</blockquote>"
              }`
          )
          ?.replaceAll(
            /(?<!\\)\*(?<!\\)\*.+(?<!\\)\*(?<!\\)\*/gmu,
            (src) => `<strong>${src.slice(2, -2)}</strong>`
          )
          ?.replaceAll(/\\(<|>|\|)/gm, (src) => src.slice(-1))
          ?.replaceAll("\n", "<br />");
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
        for (let el of document.getElementsByClassName("spoilerText"))
          el.addEventListener("click", (el) =>
            el.target.classList.toggle("show")
          );
      });
    });
});
