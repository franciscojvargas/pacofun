$(document).ready(() => {
  $("#btnJugar").click(() => {
    console.log("ok");
    window.location.href = "juego/index.html";
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}