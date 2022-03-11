const { hash } = window.location;
const decryptedMessage = atob(hash.replace("#", ""));
if (decryptedMessage) {
  document.querySelector(".write-msg").classList.add("hide");
  document.querySelector(".show-msg").classList.remove("hide");

  document.querySelector("p").innerHTML = decryptedMessage;
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const getMessage = document.querySelector("#message");
  const encryptedMessage = btoa(getMessage.value);

  document.querySelector(".sharedLink").classList.add("show");
  const linkText = document.querySelector("#copy-text");
  linkText.value = `${window.location}#${encryptedMessage}`;
  linkText.select();
  document.execCommand("copy");
});
