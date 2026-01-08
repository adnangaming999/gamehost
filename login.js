const PASSWORD = "1234"; // CHANGE PASSWORD HERE

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    window.location.href = "index.html";
  } else {
    alert("❌ Wrong Password");
  }
}
