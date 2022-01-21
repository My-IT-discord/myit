addEventListener("load", () => {
  let bulletinEl = document.getElementsByClassName("bulletin")[0];
  fetch("/data/bulletin.json")
    .then((data) => data.json())
    .then((json) => {
      json.forEach((v) => {
        if (v?.type !== 0) return;
        let div = document.createElement("div");
        div.classList.add("msg");
        /* TODO */
        v.content;
        div.innerHTML = `<div class="info">
        <div class="author">
          <img src="https://cdn.discordapp.com/avatars/${v.author.id}/${
          v.author.avatar
        }.png" alt="" class="radius">
          <p>${v.author.username}</p>
        </div>
          <div class="timestamp">
            ${new Date().toLocaleString("zh-TW", {
              timeZone: "Asia/Taipei",
            })}
          </div>
        </div>
        <div class="content">${v.content}</div>
        <div class="embeds">
        </div>`;
        bulletinEl.appendChild(div);
      });
    });
});
