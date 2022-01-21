const random = (min, max) => Math.floor(Math.random() * max) + min;

addEventListener("load", () => {
  /* header */
  let oldScroll = -1;
  addEventListener("scroll", () => {
    let scrollTop = window.scrollY || 0,
      header = document.getElementsByTagName("header")[0];
    let topClass = "up",
      downClass = "down";

    if (scrollTop === 0) {
      header.classList.remove(downClass);
      header.classList.add(topClass);
    } else {
      if (this._ScrollTop > scrollTop) {
        header.classList.add(topClass);
        header.classList.remove(downClass);
      } else if (
        !document.getElementsByTagName("html")[0].classList.contains("is-menu")
      ) {
        header.classList.add(downClass);
        header.classList.remove(topClass);
      }
    }
    oldScroll = scrollTop;
  });
  /* menu */
  document
    .querySelector(".menu .menuButton")
    .addEventListener("click", (el) => {
      el.target.closest(".menu").classList.toggle("open");
      document.body.classList.toggle("block");
    });
  /* TODO */
  addEventListener("resize", () => {});
});
