function setBoost(level) {
  alert(`✅ ${level} Boost Activated`);
}

function maxFPS() {
  if (confirm("⚠️ Enable 119Hz FPS?")) {
    document.getElementById("fps").innerText = "119 FPS";
  }
}

function applyAll() {
  document.getElementById("overlay").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("overlay").classList.add("hidden");
    alert("🔥 All Settings Applied!\nLaunching Free Fire...");
  }, 3000);
}

// Fake live FPS animation
setInterval(() => {
  document.getElementById("fps").innerText =
    Math.floor(55 + Math.random() * 10) + " FPS";
}, 1000);
