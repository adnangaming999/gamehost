function showPopup(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

function setBoost(level) {
  showPopup(level + " Boost Enabled 🚀");
}

function maxFPS() {
  showPopup("119Hz Enabled ⚡");
  document.getElementById("fps").innerText = "119 FPS";
}

function applyAll() {
  document.getElementById("overlay").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
    showPopup("All Settings Applied 🔥");
  }, 3000);
}

// FPS animation
setInterval(() => {
  const fps = Math.floor(55 + Math.random() * 10);
  document.getElementById("fps").innerText = fps + " FPS";
}, 1000);

// RAM graph animation
setInterval(() => {
  const usage = Math.floor(30 + Math.random() * 50);
  document.getElementById("ramBar").style.width = usage + "%";
}, 1500);

// DEVICE DETECTION
const ua = navigator.userAgent;
let device = "Unknown";
if (/Android/i.test(ua)) device = "Android";
else if (/Windows/i.test(ua)) device = "Windows PC";
else if (/Mac/i.test(ua)) device = "MacOS";
else if (/iPhone|iPad/i.test(ua)) device = "iOS";
document.getElementById("device").innerText = device;

// RAM
document.getElementById("ram").innerText =
  navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unavailable";

// STORAGE
navigator.storage.estimate().then(s => {
  document.getElementById("storage").innerText =
    (s.quota / 1e9).toFixed(1) + " GB";
});
