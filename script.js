const dataInput = document.getElementById('dataInput');
const qrcodeContainer = document.getElementById('qrcode');
const downloadBtn = document.getElementById('downloadBtn');
const generateBtn = document.getElementById('generateBtn');
const historyContainer = document.getElementById('history');

let qrCodeInstance = null;
let currentData = '';
const historyKey = 'qr_history';

// --- Draw QR Code ---
const drawQRCode = (data) => {
  if (!data) {
    qrcodeContainer.innerHTML = `<p style="color:#888; font-size:14px;">Start typing to generate a code...</p>`;
    downloadBtn.classList.add('hidden');
    return;
  }

  qrcodeContainer.innerHTML = ''; // clear previous

  qrCodeInstance = new QRCode(qrcodeContainer, {
    text: data,
    width: 180,
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  downloadBtn.classList.remove('hidden');
  currentData = data;
};

// --- History ---
const getHistory = () => {
  try {
    const historyString = localStorage.getItem(historyKey);
    return historyString ? JSON.parse(historyString) : [];
  } catch {
    return [];
  }
};

const saveToHistory = (data) => {
  if (!data) return;
  let history = getHistory();
  if (history.length > 0 && history[0].data === data) return;

  const newItem = {
    id: Date.now(),
    data,
    timestamp: new Date().toLocaleString()
  };

  history.unshift(newItem);
  history = history.slice(0, 10);

  localStorage.setItem(historyKey, JSON.stringify(history));
  renderHistory();
};

const renderHistory = () => {
  const history = getHistory();
  historyContainer.innerHTML = '';

  if (history.length === 0) {
    historyContainer.innerHTML = '<p style="color:#888; font-size:13px; font-style:italic;">No recent codes yet.</p>';
    return;
  }

  history.forEach(item => {
    const el = document.createElement('div');
    el.className = 'history-item';
    el.innerHTML = `
      <p>${item.data.length > 50 ? item.data.substring(0, 47) + '...' : item.data}</p>
      <span>${item.timestamp}</span>
    `;
    el.onclick = () => {
      dataInput.value = item.data;
      drawQRCode(item.data);
    };
    historyContainer.appendChild(el);
  });
};

// --- Download ---
const downloadQR = () => {
  const canvas = qrcodeContainer.querySelector('canvas');
  const img = qrcodeContainer.querySelector('img');

  let url;
  if (canvas) url = canvas.toDataURL("image/png");
  else if (img) url = img.src;

  if (!url) return;

  const a = document.createElement('a');
  a.href = url;
  a.download = `qrcode_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// --- Event Listeners ---
dataInput.addEventListener('input', () => {
  const data = dataInput.value.trim();
  if (data !== currentData) drawQRCode(data);
});

generateBtn.addEventListener('click', () => {
  const data = dataInput.value.trim();
  if (data) {
    drawQRCode(data);
    saveToHistory(data);
  }
});

downloadBtn.addEventListener('click', downloadQR);

// --- Initialize ---
window.onload = () => {
  renderHistory();
  dataInput.value = 'https://gouteach.com';
  drawQRCode(dataInput.value);
};
