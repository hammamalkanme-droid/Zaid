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
  name: document.getElementById('certName'),
  role: document.getElementById('certRole'),
  message: document.getElementById('certMessage'),
  date: document.getElementById('certDate'),
  sender: document.getElementById('certSender'),
  logo: document.getElementById('certLogo'),
  logoPlaceholder: document.getElementById('logoPlaceholder'),
  node: document.getElementById('certNode')
};


/* =========================================================
   أزرار الإجراءات
========================================================= */

const printBtn = document.getElementById('printBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');


/* =========================================================
   تحديث النصوص مباشرة
========================================================= */

function bindTextInput(inputElement, targetElement) {

  if (!inputElement || !targetElement) {
    return;
  }

  inputElement.addEventListener('input', function () {

    targetElement.textContent = inputElement.value;

  });
}


/* ربط الحقول */

bindTextInput(inputs.name, cert.name);
bindTextInput(inputs.role, cert.role);
bindTextInput(inputs.message, cert.message);
bindTextInput(inputs.date, cert.date);
bindTextInput(inputs.sender, cert.sender);


/* =========================================================
   مزامنة القيم عند فتح الصفحة
========================================================= */

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


/* تشغيل المزامنة */

syncInitialValues();


/* =========================================================
   رفع الشعار
========================================================= */

if (inputs.logo) {

  inputs.logo.addEventListener('change', function (event) {

    const file = event.target.files && event.target.files[0];


    /* -----------------------------------------------
       في حالة عدم اختيار ملف
    ------------------------------------------------ */

    if (!file) {

      resetLogo();

      return;
    }


    /* -----------------------------------------------
       التأكد من أن الملف صورة
    ------------------------------------------------ */

    if (!file.type.startsWith('image/')) {

      alert('يرجى اختيار ملف صورة صالح.');

      inputs.logo.value = '';

      resetLogo();

      return;
    }


    /* -----------------------------------------------
       قراءة الصورة
    ------------------------------------------------ */

    const reader = new FileReader();


    reader.onload = function (e) {

      if (!cert.logo) {
        return;
      }


      cert.logo.onload = function () {

        cert.logo.style.display = 'block';


        if (cert.logoPlaceholder) {
          cert.logoPlaceholder.style.display = 'none';
        }

      };


      cert.logo.onerror = function () {

        alert('تعذر قراءة الشعار. يرجى اختيار صورة أخرى.');

        resetLogo();

      };


      cert.logo.src = e.target.result;

    };


    reader.onerror = function () {

      alert('حدث خطأ أثناء قراءة الشعار.');

      resetLogo();

    };


    reader.readAsDataURL(file);

  });

}


/* =========================================================
   إعادة الشعار للحالة الافتراضية
========================================================= */

function resetLogo() {

  if (cert.logo) {

    cert.logo.onload = null;
    cert.logo.onerror = null;

    cert.logo.removeAttribute('src');

    cert.logo.style.display = 'none';

  }


  if (cert.logoPlaceholder) {

    cert.logoPlaceholder.style.display = 'flex';

  }

}


/* =========================================================
   الحالة الأولية للشعار
========================================================= */

function initializeLogo() {

  if (!cert.logo) {
    return;
  }


  const source = cert.logo.getAttribute('src');


  if (source && source.trim() !== '') {

    cert.logo.style.display = 'block';


    if (cert.logoPlaceholder) {
      cert.logoPlaceholder.style.display = 'none';
    }

  } else {

    resetLogo();

  }

}


/* تشغيل الحالة الأولية */

initializeLogo();


/* =========================================================
   زر الطباعة
========================================================= */

if (printBtn) {

  printBtn.addEventListener('click', function () {

    window.print();

  });

}


/* =========================================================
   انتظار تحميل الصور قبل إنشاء PNG
========================================================= */

function waitForImages(container) {

  const images = Array.from(
    container.querySelectorAll('img')
  );


  if (images.length === 0) {
    return Promise.resolve();
  }


  const promises = images.map(function (image) {

    if (image.complete) {

      if (image.naturalWidth > 0) {
        return Promise.resolve();
      }

    }


    return new Promise(function (resolve) {

      image.addEventListener(
        'load',
        resolve,
        { once: true }
      );

      image.addEventListener(
        'error',
        resolve,
        { once: true }
      );

    });

  });


  return Promise.all(promises);

}


/* =========================================================
   تحميل الشهادة كصورة PNG
========================================================= */

async function downloadCertificateAsImage() {

  if (!cert.node) {

    alert('تعذر العثور على الشهادة.');

    return;

  }


  /* -----------------------------------------------
     التأكد من وجود html2canvas
  ------------------------------------------------ */

  if (typeof html2canvas === 'undefined') {

    alert(
      'تعذر تشغيل أداة تحميل الصورة.\n' +
      'تأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.'
    );

    return;

  }


  /* -----------------------------------------------
     منع الضغط المتكرر
  ------------------------------------------------ */

  if (downloadImageBtn) {

    downloadImageBtn.disabled = true;

    downloadImageBtn.classList.add('is-loading');

  }


  let originalButtonHTML = '';


  if (downloadImageBtn) {

    originalButtonHTML =
      downloadImageBtn.innerHTML;


    downloadImageBtn.innerHTML = `
      <span class="button-icon">…</span>
      <span>
        <strong>جاري تجهيز الصورة</strong>
        <small>يرجى الانتظار...</small>
      </span>
    `;

  }


  try {


    /* ---------------------------------------------
       انتظار الشعار حتى يكتمل تحميله
    ---------------------------------------------- */

    await waitForImages(cert.node);


    /*
     * المقاس الأصلي للشهادة:
     *
     * 1050 × 742
     *
     * نستخدم scale = 3
     *
     * الناتج:
     *
     * 3150 × 2226
     *
     * جودة ممتازة للطباعة والحفظ.
     */

    const canvas = await html2canvas(
      cert.node,
      {

        scale: 3,

        useCORS: true,

        allowTaint: false,

        backgroundColor: '#FCFBF8',

        logging: false,

        imageTimeout: 20000,

        width: cert.node.offsetWidth,

        height: cert.node.offsetHeight,

        scrollX: 0,

        scrollY: 0,

        windowWidth:
          document.documentElement.clientWidth,

        windowHeight:
          document.documentElement.clientHeight

      }
    );


    /* ---------------------------------------------
       تحويل Canvas إلى PNG
    ---------------------------------------------- */

    const blob = await new Promise(
      function (resolve, reject) {

        canvas.toBlob(
          function (result) {

            if (result) {
              resolve(result);
            } else {
              reject(
                new Error(
                  'تعذر إنشاء ملف PNG'
                )
              );
            }

          },
          'image/png'
        );

      }
    );


    /* ---------------------------------------------
       إنشاء رابط التحميل
    ---------------------------------------------- */

    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement('a');


    link.href = url;


    /*
     * اسم الملف
     */

    const name =
      inputs.name && inputs.name.value
        ? inputs.name.value.trim()
        : 'شهادة';


    link.download =
      `شهادة-شكر-وتقدير-${name || 'زيد'}.png`;


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    /* ---------------------------------------------
       تنظيف الرابط المؤقت
    ---------------------------------------------- */

    setTimeout(function () {

      URL.revokeObjectURL(url);

    }, 1500);


  } catch (error) {

    console.error(
      'Certificate image export error:',
      error
    );


    alert(
      'حدث خطأ أثناء إنشاء صورة الشهادة.\n' +
      'يرجى المحاولة مرة أخرى.'
    );


  } finally {


    /* ---------------------------------------------
       إعادة الزر لحالته الطبيعية
    ---------------------------------------------- */

    if (downloadImageBtn) {

      downloadImageBtn.disabled = false;

      downloadImageBtn.classList.remove(
        'is-loading'
      );


      downloadImageBtn.innerHTML =
        originalButtonHTML;

    }

  }

}


/* =========================================================
   ربط زر تحميل الصورة
========================================================= */

if (downloadImageBtn) {

  downloadImageBtn.addEventListener(
    'click',
    downloadCertificateAsImage
  );

}


/* =========================================================
   منع سحب الشعار من الشهادة
========================================================= */

if (cert.logo) {

  cert.logo.addEventListener(
    'dragstart',
    function (event) {

      event.preventDefault();

    }
  );

}


/* =========================================================
   منع النقر على الصورة من فتحها
========================================================= */

if (cert.logo) {

  cert.logo.addEventListener(
    'click',
    function (event) {

      event.preventDefault();

    }
  );

}


/* =========================================================
   معالجة تغيير حجم النافذة
========================================================= */

window.addEventListener(
  'resize',
  function () {

    /*
     * لا نحتاج لإعادة رسم الشهادة.
     * التصميم نفسه ثابت بمقاس A4 أفقي.
     */

  }
);
