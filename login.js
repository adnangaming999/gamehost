function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === "1234") {
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    showPopup("Wrong Password ❌");
  }
}
