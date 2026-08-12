/* =========================================================
   Zaid Certificate Designer
   Final JavaScript
========================================================= */

'use strict';


/* =========================================================
   عناصر لوحة التحكم
========================================================= */

const inputs = {
  name: document.getElementById('nameInput'),
  role: document.getElementById('roleInput'),
  message: document.getElementById('messageInput'),
  date: document.getElementById('dateInput'),
  sender: document.getElementById('senderInput'),
  logo: document.getElementById('logoUpload')
};


/* =========================================================
   عناصر الشهادة
========================================================= */

const cert = {
  node: document.getElementById('certNode'),

  name: document.getElementById('certName'),
  role: document.getElementById('certRole'),
  message: document.getElementById('certMessage'),
  date: document.getElementById('certDate'),
  sender: document.getElementById('certSender'),

  logo: document.getElementById('certLogo'),
  logoPlaceholder: document.getElementById('logoPlaceholder')
};


/* =========================================================
   الأزرار
========================================================= */

const printBtn = document.getElementById('printBtn');
const downloadImageBtn =
  document.getElementById('downloadImageBtn');


/* =========================================================
   تحديث النصوص
========================================================= */

function bindText(input, output) {

  if (!input || !output) return;

  input.addEventListener('input', () => {

    output.textContent = input.value;

  });

}


bindText(inputs.name, cert.name);
bindText(inputs.role, cert.role);
bindText(inputs.message, cert.message);
bindText(inputs.date, cert.date);
bindText(inputs.sender, cert.sender);


/* =========================================================
   مزامنة البيانات عند فتح الصفحة
========================================================= */

function syncValues() {

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


syncValues();


/* =========================================================
   الشعار
========================================================= */

function resetLogo() {

  if (cert.logo) {

    cert.logo.removeAttribute('src');

    cert.logo.style.display = 'none';

  }

  if (cert.logoPlaceholder) {

    cert.logoPlaceholder.style.display = 'flex';

  }

}


function showLogo() {

  if (cert.logo) {
    cert.logo.style.display = 'block';
  }

  if (cert.logoPlaceholder) {
    cert.logoPlaceholder.style.display = 'none';
  }

}


if (inputs.logo) {

  inputs.logo.addEventListener('change', event => {

    const file =
      event.target.files &&
      event.target.files[0];


    if (!file) {

      resetLogo();

      return;

    }


    if (!file.type.startsWith('image/')) {

      alert('يرجى اختيار ملف صورة صالح.');

      inputs.logo.value = '';

      resetLogo();

      return;

    }


    const reader = new FileReader();


    reader.onload = event => {

      if (!cert.logo) return;


      cert.logo.onload = () => {

        showLogo();

      };


      cert.logo.onerror = () => {

        alert(
          'تعذر قراءة الشعار. يرجى اختيار صورة أخرى.'
        );

        resetLogo();

      };


      cert.logo.src = event.target.result;

    };


    reader.onerror = () => {

      alert(
        'حدث خطأ أثناء قراءة الشعار.'
      );

      resetLogo();

    };


    reader.readAsDataURL(file);

  });

}


/* =========================================================
   تهيئة الشعار
========================================================= */

function initializeLogo() {

  if (!cert.logo) return;


  const src =
    cert.logo.getAttribute('src');


  if (src && src.trim() !== '') {

    showLogo();

  } else {

    resetLogo();

  }

}


initializeLogo();


/
