// ربط المدخلات
const inputs = {
  name: document.getElementById('nameInput'),
  role: document.getElementById('roleInput'),
  message: document.getElementById('messageInput'),
  date: document.getElementById('dateInput'),
  sender: document.getElementById('senderInput'),
  logo: document.getElementById('logoUpload')
};

const cert = {
  name: document.getElementById('certName'),
  role: document.getElementById('certRole'),
  message: document.getElementById('certMessage'),
  date: document.getElementById('certDate'),
  sender: document.getElementById('certSender'),
  logo: document.getElementById('certLogo')
};

// دالة لتحديث النصوص فوراً
function updateText(inputElement, targetElement) {
  inputElement.addEventListener('input', () => {
    targetElement.innerText = inputElement.value;
  });
}

// تطبيق الدالة
updateText(inputs.name, cert.name);
updateText(inputs.role, cert.role);
updateText(inputs.message, cert.message);
updateText(inputs.date, cert.date);
updateText(inputs.sender, cert.sender);

// معالجة رفع الشعار باحترافية
inputs.logo.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      cert.logo.src = e.target.result;
      cert.logo.style.display = 'inline-block';
    }
    reader.readAsDataURL(file);
  } else {
      cert.logo.style.display = 'none';
  }
});

// دالة تحميل الشهادة كصورة عالية الدقة (PNG)
function downloadAsImage() {
  const certificateElement = document.getElementById('certNode');
  
  // استخدام مكتبة html2canvas لالتقاط صورة للشهادة
  html2canvas(certificateElement, {
    scale: 2, // رفع دقة الصورة لتكون ممتازة
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    // تحويل الكانفاس إلى رابط صورة
    const link = document.createElement('a');
    link.download = `شهادة_${inputs.name.value}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}
