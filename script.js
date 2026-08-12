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
  logo: document.getElementById('certLogo'),
  logoPlaceholder: document.getElementById('logoPlaceholder')
};


// ======================================================
// تحديث النصوص مباشرة أثناء الكتابة
// ======================================================

function updateText(inputElement, targetElement) {
  if (!inputElement || !targetElement) return;

  inputElement.addEventListener('input', () => {
    targetElement.textContent = inputElement.value;
  });
}


// ربط البيانات
updateText(inputs.name, cert.name);
updateText(inputs.role, cert.role);
updateText(inputs.message, cert.message);
updateText(inputs.date, cert.date);
updateText(inputs.sender, cert.sender);


// ======================================================
// رفع الشعار
// ======================================================

inputs.logo.addEventListener('change', function (event) {

  const file = event.target.files[0];

  // في حالة عدم اختيار صورة
  if (!file) {
    cert.logo.removeAttribute('src');
    cert.logo.style.display = 'none';

    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'flex';
    }

    return;
  }


  // التأكد أن الملف صورة
  if (!file.type.startsWith('image/')) {
    alert('يرجى اختيار ملف صورة صالح.');

    inputs.logo.value = '';

    cert.logo.removeAttribute('src');
    cert.logo.style.display = 'none';

    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'flex';
    }

    return;
  }


  // قراءة الصورة
  const reader = new FileReader();

  reader.onload = function (e) {

    cert.logo.src = e.target.result;

    // إظهار الشعار
    cert.logo.style.display = 'block';

    // إخفاء العنصر البديل
    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'none';
    }
  };

  reader.onerror = function () {

    alert('حدث خطأ أثناء قراءة الشعار.');

    cert.logo.removeAttribute('src');
    cert.logo.style.display = 'none';

    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'flex';
    }
  };

  reader.readAsDataURL(file);
});


// ======================================================
// الحالة الابتدائية للشعار
// ======================================================

function initializeLogo() {

  if (!cert.logo) return;

  if (cert.logo.getAttribute('src')) {

    cert.logo.style.display = 'block';

    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'none';
    }

  } else {

    cert.logo.style.display = 'none';

    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'flex';
    }
  }
}

initializeLogo();


// ======================================================
// منع الصور من سحبها بالماوس داخل الشهادة
// ======================================================

if (cert.logo) {
  cert.logo.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });
}


// ======================================================
// تحديث البيانات عند تحميل الصفحة
// ======================================================

function syncInitialValues() {

  if (inputs.name && cert.name) {
    cert.name.textContent = inputs.name.value;
  }

  if (inputs.role && cert.role) {
    cert.role.textContent = inputs.role.value;
  }

  if (inputs.message && cert.message) {
    cert.message.textContent = inputs.message.value;
  }

  if (inputs.date && cert.date) {
    cert.date.textContent = inputs.date.value;
  }

  if (inputs.sender && cert.sender) {
    cert.sender.textContent = inputs.sender.value;
  }
}

syncInitialValues();
