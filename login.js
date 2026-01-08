const PASSWORD = "1234"; // CHANGE PASSWORD HERE

function checkPassword() {
  const pass = document.getElementById("password").value;
  if (pass === PASSWORD) {
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    showPopup("Wrong Password ❌");
  }
}

function showPopup(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}
