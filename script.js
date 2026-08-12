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
const BASE_WIDTH = 1050;
const BASE_HEIGHT = 742;


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
const downloadImageBtn = document.getElementById('downloadImageBtn');


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
  if (inputs.name && cert.name) cert.name.textContent = inputs.name.value;
  if (inputs.role && cert.role) cert.role.textContent = inputs.role.value;
  if (inputs.message && cert.message) cert.message.textContent = inputs.message.value;
  if (inputs.date && cert.date) cert.date.textContent = inputs.date.value;
  if (inputs.sender && cert.sender) cert.sender.textContent = inputs.sender.value;
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
    const file = event.target.files && event.target.files[0];

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
        alert('تعذر قراءة الشعار. يرجى اختيار صورة أخرى.');
        resetLogo();
      };

      cert.logo.src = readerEvent.target.result;
    };

    reader.onerror = function () {
      alert('حدث خطأ أثناء قراءة الشعار.');
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

  const src = cert.logo.getAttribute('src');

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
  if (!container) return Promise.resolve();

  const images = Array.from(container.querySelectorAll('img'));

  if (!images.length) return Promise.resolve();

  return Promise.all(
    images.map(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        let completed = false;

        function finish() {
          if (completed) return;
          completed = true;
          resolve();
        }

        img.addEventListener('load', finish, { once: true });
        img.addEventListener('error', finish, { once: true });
        setTimeout(finish, 15000);
      });
    })
  );
}


/* =========================================================
   انتظار الخطوط
========================================================= */

async function waitForFonts() {
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (error) {
    console.warn('تعذر انتظار الخطوط:', error);
  }
}


/* =========================================================
   اسم الملف
========================================================= */

function sanitizeFileName(name) {
  if (!name) return 'شهادة';

  return String(name)
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ');
}

function getCertificateFileName() {
  const name = inputs.name && inputs.name.value
    ? inputs.name.value.trim()
    : 'شهادة';

  return `شهادة-شكر-وتقدير-${sanitizeFileName(name)}.png`;
}


/* =========================================================
   تحميل الصورة
========================================================= */

async function downloadCertificateAsImage() {
  if (!cert.node) {
    alert('تعذر العثور على الشهادة.');
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
    downloadImageBtn.classList.add('is-loading');
  }

  const originalButtonHTML = downloadImageBtn ? downloadImageBtn.innerHTML : '';

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
    /* 1 — انتظار الخطوط والصور */
    await waitForFonts();
    await waitForImages(cert.node);

    /* 2 — إنشاء حاوية مؤقتة للتصدير */
    exportHost = document.createElement('div');
    exportHost.style.position = 'fixed';
    exportHost.style.left = '-100000px';
    exportHost.style.top = '0';
    exportHost.style.width = `${BASE_WIDTH}px`;
    exportHost.style.height = `${BASE_HEIGHT}px`;
    exportHost.style.overflow = 'hidden';
    exportHost.style.background = '#F8F9FA';
    exportHost.style.zIndex = '-999999';

    const clone = cert.node.cloneNode(true);

    /* 3 — ضبط أبعاد النسخة الأساسية بدون Transform تجنباً للتكبير المزدوج */
    clone.id = 'certNodeExport';
    clone.style.width = `${BASE_WIDTH}px`;
    clone.style.height = `${BASE_HEIGHT}px`;
    clone.style.minWidth = `${BASE_WIDTH}px`;
    clone.style.minHeight = `${BASE_HEIGHT}px`;
    clone.style.maxWidth = `${BASE_WIDTH}px`;
    clone.style.maxHeight = `${BASE_HEIGHT}px`;
    clone.style.margin = '0';
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.position = 'relative';
    clone.style.background = '#F8F9FA';

    exportHost.appendChild(clone);
    document.body.appendChild(exportHost);

    /* 4 — تصحيح تنسيقات الأسطر في النصوص */
    const clonedMessage = clone.querySelector('#certMessage');
    if (clonedMessage) {
      clonedMessage.style.maxHeight = 'none';
      clonedMessage.style.overflow = 'visible';
      clonedMessage.style.whiteSpace = 'pre-line'; // تصحيح: الإبقاء على فواصل الأسطر
      clonedMessage.style.height = 'auto';
    }

    const clonedRole = clone.querySelector('#certRole');
    if (clonedRole) {
      clonedRole.style.overflow = 'visible';
      clonedRole.style.textOverflow = 'clip';
      clonedRole.style.whiteSpace = 'normal';
    }

    const clonedName = clone.querySelector('#certName');
    if (clonedName) {
      clonedName.style.overflow = 'visible';
      clonedName.style.textOverflow = 'clip';
    }

    /* 5 — الشعار */
    const clonedLogo = clone.querySelector('#certLogo');
    if (clonedLogo && clonedLogo.src && clonedLogo.src.trim() !== '') {
      clonedLogo.style.display = 'block';
    }

    /* 6 — انتظار إعادة الرسم */
    await waitForImages(clone);
    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          setTimeout(resolve, 100);
        });
      });
    });

    /* 7 — حساب نسبة التكبير الدقيقة للتصدير 3508x2480 */
    const renderScale = EXPORT_WIDTH / BASE_WIDTH;

    const canvas = await html2canvas(clone, {
      scale: renderScale,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#F8F9FA',
      logging: false,
      imageTimeout: 20000,
      removeContainer: true,
      foreignObjectRendering: false,
      scrollX: 0,
      scrollY: 0
    });

    /* 8 — إنشاء Canvas بالمقاس المطلوب بالضبط */
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = EXPORT_WIDTH;
    finalCanvas.height = EXPORT_HEIGHT;

    const finalContext = finalCanvas.getContext('2d');
    if (!finalContext) {
      throw new Error('تعذر إنشاء Canvas النهائي.');
    }

    finalContext.imageSmoothingEnabled = true;
    finalContext.imageSmoothingQuality = 'high';

    finalContext.drawImage(
      canvas,
      0, 0, canvas.width, canvas.height,
      0, 0, EXPORT_WIDTH, EXPORT_HEIGHT
    );

    /* 9 — تحويل وإخراج ملف PNG */
    const blob = await new Promise(function (resolve, reject) {
      finalCanvas.toBlob(function (result) {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('تعذر إنشاء ملف PNG.'));
        }
      }, 'image/png');
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getCertificateFileName();
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 3000);

    console.log(`تم تصدير الشهادة بنجاح — ${EXPORT_WIDTH} × ${EXPORT_HEIGHT}px`);

  } catch (error) {
    console.error('Certificate export error:', error);
    alert('حدث خطأ أثناء إنشاء صورة الشهادة.\n\nتأكد من تحميل الصفحة بالكامل ثم حاول مرة أخرى.');
  } finally {
    if (exportHost) {
      exportHost.remove();
    }

    if (downloadImageBtn) {
      downloadImageBtn.disabled = false;
      downloadImageBtn.classList.remove('is-loading');
      downloadImageBtn.innerHTML = originalButtonHTML;
    }
  }
}


/* =========================================================
   ربط زر تحميل الصورة
========================================================= */

if (downloadImageBtn) {
  downloadImageBtn.addEventListener('click', downloadCertificateAsImage);
}


/* =========================================================
   معلومات النظام
========================================================= */

console.log('Zaid Certificate Designer');
console.log(`Export Size: ${EXPORT_WIDTH} × ${EXPORT_HEIGHT}px`);
