/* =========================================================
   Zaid Certificate Designer
   FINAL JavaScript
   Export: 3508 × 2480 px
========================================================= */

'use strict';


/* =========================================================
   المقاس النهائي للصورة
========================================================= */

const EXPORT_WIDTH = 3508;
const EXPORT_HEIGHT = 2480;


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
   تحديث النصوص
========================================================= */

function bindText(input, output) {

  if (!input || !output) return;

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
   مزامنة القيم عند فتح الصفحة
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

  inputs.logo.addEventListener('change', function (event) {

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


    reader.onload = function (readerEvent) {

      if (!cert.logo) return;


      cert.logo.onload = function () {

        showLogo();

      };


      cert.logo.onerror = function () {

        alert(
          'تعذر قراءة الشعار. يرجى اختيار صورة أخرى.'
        );

        resetLogo();

      };


      cert.logo.src =
        readerEvent.target.result;

    };


    reader.onerror = function () {

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


/* =========================================================
   منع سحب الشعار
========================================================= */

if (cert.logo) {

  cert.logo.addEventListener('dragstart', function (event) {

    event.preventDefault();

  });

}


/* =========================================================
   الطباعة
========================================================= */

if (printBtn) {

  printBtn.addEventListener('click', function () {

    window.print();

  });

}


/* =========================================================
   انتظار تحميل الصور
========================================================= */

function waitForImages(container) {

  if (!container) {
    return Promise.resolve();
  }


  const images =
    Array.from(
      container.querySelectorAll('img')
    );


  if (!images.length) {
    return Promise.resolve();
  }


  return Promise.all(
    images.map(function (img) {

      if (
        img.complete &&
        img.naturalWidth > 0
      ) {

        return Promise.resolve();

      }


      return new Promise(function (resolve) {

        let completed = false;


        function finish() {

          if (completed) return;

          completed = true;

          resolve();

        }


        img.addEventListener(
          'load',
          finish,
          { once: true }
        );


        img.addEventListener(
          'error',
          finish,
          { once: true }
        );


        setTimeout(
          finish,
          15000
        );

      });

    })
  );

}


/* =========================================================
   انتظار الخطوط
========================================================= */

async function waitForFonts() {

  try {

    if (
      document.fonts &&
      document.fonts.ready
    ) {

      await document.fonts.ready;

    }

  } catch (error) {

    console.warn(
      'تعذر انتظار الخطوط:',
      error
    );

  }

}


/* =========================================================
   اسم الملف
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


function getCertificateFileName() {

  const name =
    inputs.name &&
    inputs.name.value
      ? inputs.name.value.trim()
      : 'شهادة';


  return (
    `شهادة-شكر-وتقدير-${sanitizeFileName(name)}.png`
  );

}


/* =========================================================
   تحميل الصورة
========================================================= */

async function downloadCertificateAsImage() {

  if (!cert.node) {

    alert(
      'تعذر العثور على الشهادة.'
    );

    return;

  }


  if (typeof html2canvas === 'undefined') {

    alert(
      'تعذر تشغيل أداة تصدير الصورة.\n\n' +
      'تأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.'
    );

    return;

  }


  if (downloadImageBtn) {

    downloadImageBtn.disabled = true;

    downloadImageBtn.classList.add(
      'is-loading'
    );

  }


  const originalButtonHTML =
    downloadImageBtn
      ? downloadImageBtn.innerHTML
      : '';


  if (downloadImageBtn) {

    downloadImageBtn.innerHTML = `
      <span class="button-icon">…</span>
      <span>
        <strong>جاري تجهيز الشهادة</strong>
        <small>يتم إنشاء الصورة بجودة عالية...</small>
      </span>
    `;

  }


  let exportHost = null;


  try {

    /* =====================================================
       1 — انتظار الخطوط والصور
    ===================================================== */

    await waitForFonts();

    await waitForImages(cert.node);


    /* =====================================================
       2 — إنشاء نسخة مستقلة من الشهادة
       
       لا نغير الشهادة الأصلية الموجودة أمام المستخدم.
    ===================================================== */

    exportHost =
      document.createElement('div');


    exportHost.style.position = 'fixed';
    exportHost.style.left = '-100000px';
    exportHost.style.top = '0';

    exportHost.style.width =
      `${EXPORT_WIDTH}px`;

    exportHost.style.height =
      `${EXPORT_HEIGHT}px`;

    exportHost.style.overflow =
      'hidden';

    exportHost.style.background =
      '#F8F9FA';

    exportHost.style.zIndex =
      '-999999';


    const clone =
      cert.node.cloneNode(true);


    /* =====================================================
       3 — المقاس الحقيقي للنسخة
    ===================================================== */

    clone.id = 'certNodeExport';

    clone.style.width =
      `${EXPORT_WIDTH}px`;

    clone.style.height =
      `${EXPORT_HEIGHT}px`;

    clone.style.minWidth =
      `${EXPORT_WIDTH}px`;

    clone.style.minHeight =
      `${EXPORT_HEIGHT}px`;

    clone.style.maxWidth =
      'none';

    clone.style.maxHeight =
      'none';

    clone.style.margin =
      '0';

    clone.style.transform =
      'none';

    clone.style.boxShadow =
      'none';

    clone.style.position =
      'relative';


    /* =====================================================
       4 — إضافة النسخة إلى الصفحة
    ===================================================== */

    exportHost.appendChild(clone);

    document.body.appendChild(exportHost);


    /* =====================================================
       5 — ضبط عناصر الشهادة لتتناسب مع المقاس الجديد
       
       التصميم الأصلي مبني على:
       1050 × 742

       المقاس النهائي:
       3508 × 2480
       
       لذلك نكبر التصميم بنسبة موحدة.
    ===================================================== */

    const scaleX =
      EXPORT_WIDTH / 1050;

    const scaleY =
      EXPORT_HEIGHT / 742;


    const scale =
      Math.min(scaleX, scaleY);


    /*
     * العناصر التي تعتمد على المقاس القديم
     * يتم تكبيرها بنسبة واحدة.
     */

    const scalableSelectors = [

      '.certificate-background',

      '.cert-frame',

      '.cert-inner-border',

      '.cert-content',

      '.cert-header',

      '.logo-area',

      '.logo-halo',

      '.header-kicker',

      '.cert-header h1',

      '.title-decoration',

      '.cert-header .subtitle',

      '.cert-body',

      '.recipient',

      '.recipient-line',

      '.cert-body h2',

      '.cert-body .role',

      '.message-container',

      '.cert-footer',

      '.sign-box',

      '.seal-container',

      '.seal-outer',

      '.seal-inner',

      '.certificate-branding'

    ];


    /*
     * نستخدم transform على الشهادة كاملة.
     *
     * ولأننا نريد الناتج النهائي بالضبط
     * 3508 × 2480، يتم ضبط النسخة
     * داخل مساحة التصدير.
     */

    clone.style.width = '1050px';
    clone.style.height = '742px';

    clone.style.minWidth = '1050px';
    clone.style.minHeight = '742px';

    clone.style.maxWidth = '1050px';
    clone.style.maxHeight = '742px';

    clone.style.transform =
      `scale(${scale})`;

    clone.style.transformOrigin =
      'top left';


    /*
     * خلفية إضافية حتى لا تظهر شفافية.
     */

    clone.style.background =
      '#F8F9FA';


    /* =====================================================
       6 — تعديل بعض العناصر النصية
       
       مهم لمنع قص النص.
    ===================================================== */

    const clonedMessage =
      clone.querySelector('#certMessage');

    if (clonedMessage) {

      clonedMessage.style.maxHeight =
        'none';

      clonedMessage.style.overflow =
        'visible';

      clonedMessage.style.whiteSpace =
        'normal';

      clonedMessage.style.height =
        'auto';

    }


    const clonedRole =
      clone.querySelector('#certRole');

    if (clonedRole) {

      clonedRole.style.overflow =
        'visible';

      clonedRole.style.textOverflow =
        'clip';

      clonedRole.style.whiteSpace =
        'normal';

    }


    const clonedName =
      clone.querySelector('#certName');

    if (clonedName) {

      clonedName.style.overflow =
        'visible';

      clonedName.style.textOverflow =
        'clip';

    }


    /* =====================================================
       7 — الشعار
    ===================================================== */

    const clonedLogo =
      clone.querySelector('#certLogo');


    if (clonedLogo) {

      if (
        clonedLogo.src &&
        clonedLogo.src.trim() !== ''
      ) {

        clonedLogo.style.display =
          'block';

      }

    }


    /* =====================================================
       8 — انتظار إعادة الرسم
    ===================================================== */

    await waitForImages(clone);

    await new Promise(function (resolve) {

      requestAnimationFrame(function () {

        requestAnimationFrame(function () {

          setTimeout(
            resolve,
            100
          );

        });

      });

    });


    /* =====================================================
       9 — إنشاء Canvas
       
       scale يتم حسابه بدقة حتى تكون الصورة:
       
       3508 × 2480
    ===================================================== */

    const canvas =
      await html2canvas(
        clone,
        {

          scale: scale,

          width: 1050,

          height: 742,

          useCORS: true,

          allowTaint: false,

          backgroundColor:
            '#F8F9FA',

          logging: false,

          imageTimeout: 20000,

          removeContainer: true,

          foreignObjectRendering: false,

          scrollX: 0,

          scrollY: 0

        }
      );


    /* =====================================================
       10 — إنشاء Canvas نهائي بالمقاس المطلوب بالضبط
    ===================================================== */

    const finalCanvas =
      document.createElement('canvas');


    finalCanvas.width =
      EXPORT_WIDTH;

    finalCanvas.height =
      EXPORT_HEIGHT;


    const finalContext =
      finalCanvas.getContext('2d');


    if (!finalContext) {

      throw new Error(
        'تعذر إنشاء Canvas النهائي.'
      );

    }


    /*
     * تحسين جودة إعادة التحجيم.
     */

    finalContext.imageSmoothingEnabled =
      true;

    finalContext.imageSmoothingQuality =
      'high';


    /*
     * رسم الصورة داخل المقاس النهائي.
     */

    finalContext.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      EXPORT_WIDTH,
      EXPORT_HEIGHT
    );


    /* =====================================================
       11 — التحقق من المقاس النهائي
    ===================================================== */

    if (
      finalCanvas.width !== EXPORT_WIDTH ||
      finalCanvas.height !== EXPORT_HEIGHT
    ) {

      throw new Error(
        `المقاس الناتج غير صحيح: ` +
        `${finalCanvas.width} × ${finalCanvas.height}`
      );

    }


    /* =====================================================
       12 — تحويل إلى PNG
    ===================================================== */

    const blob =
      await new Promise(
        function (resolve, reject) {

          finalCanvas.toBlob(
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


    /* =====================================================
       13 — تحميل الصورة
    ===================================================== */

    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement('a');


    link.href =
      url;

    link.download =
      getCertificateFileName();

    link.style.display =
      'none';


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    /* =====================================================
       14 — تنظيف
    ===================================================== */

    setTimeout(function () {

      URL.revokeObjectURL(url);

    }, 3000);


    console.log(
      `تم تصدير الشهادة بنجاح — ` +
      `${EXPORT_WIDTH} × ${EXPORT_HEIGHT}px`
    );


  } catch (error) {

    console.error(
      'Certificate export error:',
      error
    );


    alert(
      'حدث خطأ أثناء إنشاء صورة الشهادة.\n\n' +
      'تأكد من تحميل الصفحة بالكامل ثم حاول مرة أخرى.'
    );


  } finally {

    /*
     * حذف النسخة المؤقتة.
     */

    if (exportHost) {

      exportHost.remove();

    }


    /*
     * إعادة الزر.
     */

    if (downloadImageBtn) {

      downloadImageBtn.disabled =
        false;

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
   معلومات النظام
========================================================= */

console.log(
  'Zaid Certificate Designer'
);

console.log(
  `Export Size: ${EXPORT_WIDTH} × ${EXPORT_HEIGHT}px`
);
