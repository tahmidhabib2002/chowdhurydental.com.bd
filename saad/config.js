// config.js
const API_CONFIG = {
    baseUrl: "https://bulksmsdhaka.net/api/sendtext",
    apikey: "e7b0da5a67ded72bd064e59bc2c382fc9b946900",
    callerID: "1234"
};
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/saad/sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Registration Failed!', err));
  });
}
