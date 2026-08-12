/* =========================================================
   Zaid Certificate Designer
   FINAL JavaScript
   Certificate Export: 3508 × 2480 px
========================================================= */

'use strict';


/* =========================================================
   المقاس النهائي للشهادة
========================================================= */

const CERTIFICATE_WIDTH = 3508;
const CERTIFICATE_HEIGHT = 2480;


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

const printBtn =
  document.getElementById('printBtn');

const downloadImageBtn =
  document.getElementById('downloadImageBtn');


/* =========================================================
   تحديث النصوص مباشرة
========================================================= */

function bindText(input, output) {

  if (!input || !output) {
    return;
  }

  input.addEventListener('input', function () {

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

    cert.logo.onload = null;
    cert.logo.onerror = null;

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

  inputs.logo.addEventListener(
    'change',
    function (event) {

      const file =
        event.target.files &&
        event.target.files[0];


      /* -----------------------------------------------
         لم يتم اختيار ملف
      ------------------------------------------------ */

      if (!file) {

        resetLogo();

        return;

      }


      /* -----------------------------------------------
         التأكد من أن الملف صورة
      ------------------------------------------------ */

      if (!file.type.startsWith('image/')) {

        alert(
          'يرجى اختيار ملف صورة صالح.'
        );

        inputs.logo.value = '';

        resetLogo();

        return;

      }


      /* -----------------------------------------------
         قراءة الصورة
      ------------------------------------------------ */

      const reader =
        new FileReader();


      reader.onload =
        function (readerEvent) {

          if (!cert.logo) {
            return;
          }


          cert.logo.onload =
            function () {

              showLogo();

            };


          cert.logo.onerror =
            function () {

              alert(
                'تعذر قراءة الشعار. يرجى اختيار صورة أخرى.'
              );

              resetLogo();

            };


          cert.logo.src =
            readerEvent.target.result;

        };


      reader.onerror =
        function () {

          alert(
            'حدث خطأ أثناء قراءة الشعار.'
          );

          resetLogo();

        };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================================================
   تهيئة الشعار
========================================================= */

function initializeLogo() {

  if (!cert.logo) {
    return;
  }


  const src =
    cert.logo.getAttribute('src');


  if (
    src &&
    src.trim() !== ''
  ) {

    showLogo();

  } else {

    resetLogo();

  }

}


initializeLogo();


/* =========================================================
   منع سحب الشعار
========================================================= */

if (cert.logo) {

  cert.logo.addEventListener(
    'dragstart',
    function (event) {

      event.preventDefault();

    }
  );


  cert.logo.addEventListener(
    'click',
    function (event) {

      event.preventDefault();

    }
  );

}


/* =========================================================
   زر الطباعة
========================================================= */

if (printBtn) {

  printBtn.addEventListener(
    'click',
    function () {

      window.print();

    }
  );

}


/* =========================================================
   انتظار تحميل جميع الصور
========================================================= */

function waitForImages(container) {

  if (!container) {
    return Promise.resolve();
  }


  const images =
    Array.from(
      container.querySelectorAll('img')
    );


  if (images.length === 0) {
    return Promise.resolve();
  }


  const promises =
    images.map(
      function (image) {

        /*
         * الصورة محملة بالفعل
         */

        if (
          image.complete &&
          image.naturalWidth > 0
        ) {

          return Promise.resolve();

        }


        /*
         * انتظار تحميل الصورة
         */

        return new Promise(
          function (resolve) {

            let finished = false;


            function done() {

              if (finished) {
                return;
              }

              finished = true;

              resolve();

            }


            image.addEventListener(
              'load',
              done,
              { once: true }
            );


            image.addEventListener(
              'error',
              done,
              { once: true }
            );


            /*
             * حماية من بقاء العملية معلقة
             */

            setTimeout(
              done,
              20000
            );

          }
        );

      }
    );


  return Promise.all(promises);

}


/* =========================================================
   تنظيف اسم الملف
========================================================= */

function sanitizeFileName(name) {

  if (!name) {
    return 'شهادة';
  }


  return String(name)
    .trim()
    .replace(
      /[\\/:*?"<>|]/g,
      '-'
    )
    .replace(
      /\s+/g,
      ' '
    );

}


/* =========================================================
   إنشاء اسم ملف الشهادة
========================================================= */

function getCertificateFileName() {

  const name =
    inputs.name &&
    inputs.name.value
      ? inputs.name.value.trim()
      : 'شهادة';


  const safeName =
    sanitizeFileName(name);


  return (
    `شهادة-شكر-وتقدير-${safeName}.png`
  );

}


/* =========================================================
   تحميل الشهادة كصورة PNG
========================================================= */

async function downloadCertificateAsImage() {

  /* -----------------------------------------------
     التأكد من وجود الشهادة
  ------------------------------------------------ */

  if (!cert.node) {

    alert(
      'تعذر العثور على الشهادة.'
    );

    return;

  }


  /* -----------------------------------------------
     التأكد من وجود html2canvas
  ------------------------------------------------ */

  if (
    typeof html2canvas ===
    'undefined'
  ) {

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

    downloadImageBtn.classList.add(
      'is-loading'
    );

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
       التأكد من ظهور الشهادة بالمقاس الحقيقي
    ---------------------------------------------- */

    const originalWidth =
      cert.node.style.width;

    const originalHeight =
      cert.node.style.height;

    const originalMinWidth =
      cert.node.style.minWidth;

    const originalMinHeight =
      cert.node.style.minHeight;


    /*
     * نفرض المقاس الحقيقي مؤقتًا أثناء التصدير.
     *
     * الناتج النهائي:
     *
     * 3508 × 2480 px
     */

    cert.node.style.width =
      `${CERTIFICATE_WIDTH}px`;

    cert.node.style.height =
      `${CERTIFICATE_HEIGHT}px`;

    cert.node.style.minWidth =
      `${CERTIFICATE_WIDTH}px`;

    cert.node.style.minHeight =
      `${CERTIFICATE_HEIGHT}px`;


    /* ---------------------------------------------
       انتظار تحميل الشعار
    ---------------------------------------------- */

    await waitForImages(
      cert.node
    );


    /* ---------------------------------------------
       إعطاء المتصفح فرصة لإعادة الرسم
    ---------------------------------------------- */

    await new Promise(
      function (resolve) {

        requestAnimationFrame(
          function () {

            requestAnimationFrame(
              resolve
            );

          }
        );

      }
    );


    /* ---------------------------------------------
       إنشاء Canvas
       
       مهم جدًا:
       
       scale = 1

       لأن الشهادة نفسها:
       3508 × 2480

       وبالتالي الناتج:
       3508 × 2480
    ---------------------------------------------- */

    const canvas =
      await html2canvas(
        cert.node,
        {

          scale: 1,

          width:
            CERTIFICATE_WIDTH,

          height:
            CERTIFICATE_HEIGHT,

          useCORS: true,

          allowTaint: false,

          backgroundColor:
            '#F8F9FA',

          logging: false,

          imageTimeout: 20000,

          scrollX: 0,

          scrollY: 0,

          windowWidth:
            CERTIFICATE_WIDTH,

          windowHeight:
            CERTIFICATE_HEIGHT,

          onclone:
            function (clonedDocument) {

              const clonedCertificate =
                clonedDocument.getElementById(
                  'certNode'
                );


              if (!clonedCertificate) {
                return;
              }


              /*
               * تثبيت المقاس داخل النسخة
               * التي سيأخذ منها html2canvas الصورة.
               */

              clonedCertificate.style.width =
                `${CERTIFICATE_WIDTH}px`;

              clonedCertificate.style.height =
                `${CERTIFICATE_HEIGHT}px`;

              clonedCertificate.style.minWidth =
                `${CERTIFICATE_WIDTH}px`;

              clonedCertificate.style.minHeight =
                `${CERTIFICATE_HEIGHT}px`;

              clonedCertificate.style.maxWidth =
                'none';

              clonedCertificate.style.maxHeight =
                'none';

              clonedCertificate.style.transform =
                'none';

            }

        }
      );


    /* ---------------------------------------------
       التأكد من المقاس
    ---------------------------------------------- */

    if (
      canvas.width !==
        CERTIFICATE_WIDTH ||
      canvas.height !==
        CERTIFICATE_HEIGHT
    ) {

      throw new Error(
        `حجم الصورة الناتجة غير صحيح: ` +
        `${canvas.width}×${canvas.height}`
      );

    }


    /* ---------------------------------------------
       تحويل Canvas إلى PNG
    ---------------------------------------------- */

    const blob =
      await new Promise(
        function (resolve, reject) {

          canvas.toBlob(
            function (result) {

              if (result) {

                resolve(result);

              } else {

                reject(
                  new Error(
                    'تعذر إنشاء ملف PNG.'
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

    link.download =
      getCertificateFileName();


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    /* ---------------------------------------------
       تنظيف الرابط المؤقت
    ---------------------------------------------- */

    setTimeout(
      function () {

        URL.revokeObjectURL(url);

      },
      2000
    );


    /* ---------------------------------------------
       إشعار نجاح بسيط
    ---------------------------------------------- */

    console.log(
      `تم تصدير الشهادة بنجاح: ` +
      `${CERTIFICATE_WIDTH} × ${CERTIFICATE_HEIGHT}px`
    );


    /* ---------------------------------------------
       إعادة المقاسات الأصلية
    ---------------------------------------------- */

    cert.node.style.width =
      originalWidth;

    cert.node.style.height =
      originalHeight;

    cert.node.style.minWidth =
      originalMinWidth;

    cert.node.style.minHeight =
      originalMinHeight;


  } catch (error) {

    console.error(
      'Certificate image export error:',
      error
    );


    alert(
      'حدث خطأ أثناء إنشاء صورة الشهادة.\n\n' +
      'يرجى المحاولة مرة أخرى.'
    );


  } finally {

    /* ---------------------------------------------
       إعادة زر التحميل لحالته الطبيعية
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
   معالجة تغيير حجم النافذة
========================================================= */

window.addEventListener(
  'resize',
  function () {

    /*
     * لا نغير المقاس الحقيقي للشهادة.
     *
     * CSS مسؤول فقط عن عرضها بصريًا
     * داخل الشاشة.
     */

  }
);


/* =========================================================
   معلومات النظام
========================================================= */

console.log(
  `Zaid Certificate Designer | ` +
  `Final Size: ${CERTIFICATE_WIDTH} × ${CERTIFICATE_HEIGHT}px`
);
