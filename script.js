const input = document.getElementById("dataInput");
const generateBtn = document.getElementById("generateBtn");
const qrContainer = document.getElementById("qrcode");
const downloadBtn = document.getElementById("downloadBtn");
const historyContainer = document.getElementById("history");

let qr;

generateBtn.addEventListener("click", () => {
  const data = input.value.trim();
  if (!data) return alert("Please enter some text or data first!");

  qrContainer.innerHTML = ""; // clear old QR

  qr = new QRCode(qrContainer, {
    text: data,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
  });


  setTimeout(() => {
    downloadBtn.classList.remove("hidden");
    saveToHistory();
  }, 300);
});

downloadBtn.addEventListener("click", () => {
  const img = qrContainer.querySelector("img") || qrContainer.querySelector("canvas");
  if (!img) return;

  let qrURL;
  if (img.tagName === "CANVAS") {
    qrURL = img.toDataURL("image/png");
  } else {
    qrURL = img.src;
  }

  const link = document.createElement("a");
  link.href = qrURL;
  link.download = "qr-code.png";
  link.click();
});

function saveToHistory() {
  const img = qrContainer.querySelector("img");
  if (!img) return;

  const qrData = img.src;
  const stored = JSON.parse(localStorage.getItem("qrHistory")) || [];

  if (!stored.includes(qrData)) {
    stored.push(qrData);
    localStorage.setItem("qrHistory", JSON.stringify(stored));
    renderHistory();
  }
}

function renderHistory() {
  historyContainer.innerHTML = "";
  const stored = JSON.parse(localStorage.getItem("qrHistory")) || [];

  stored.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    historyContainer.appendChild(img);
  });
}

window.addEventListener("DOMContentLoaded", renderHistory);