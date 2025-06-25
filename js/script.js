/* =====================   منع النسخ وفتح أدوات المطوّر   ===================== */
document.addEventListener('contextmenu', e => e.preventDefault());

document.onkeydown = e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    return false;
  }
};

/* =====================   استرجاع موقع العميل (المدينة)   ===================== */
async function setClientCity() {
  try {
    const res   = await fetch('https://ipapi.co/json/');
    const data  = await res.json();
    const cityI = document.getElementById('inp_City');
    if (cityI) cityI.value = data.city;      // يكتب المدينة تلقائياً
  } catch (err) {
    console.error('Error fetching location:', err);
  }
}

/* =====================   التحقق من النموذج وإرساله   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  /* عناصر النموذج */
  const nameInput     = document.getElementById('text');      // الاسم
  const phoneInput    = document.getElementById('password');  // رقم الهاتف
  const form          = document.getElementById('form');
  const errorBox      = document.getElementById('error');
  const redirInput    = document.getElementById('redDir');

  /* (1) تخصيص رسائل خطأ حقل الاسم */
  nameInput.addEventListener('invalid', function () {
    if (this.validity.patternMismatch) {
      this.setCustomValidity('Please enter only characters.');
    } else if (this.validity.valueMissing) {
      this.setCustomValidity('من فضلك أدخل الأسم');
    } else {
      this.setCustomValidity('');
    }
  });
  nameInput.addEventListener('input', function () {
    if (this.validity.valid) this.setCustomValidity('');
  });
  phoneInput.addEventListener('input', function () {
    if (this.validity.valid) this.setCustomValidity('');
  });

  /* (2) توليد رابط صفحة الشكر وإدخاله في hidden input */
  const pathArr = window.location.pathname.split('/');
  pathArr.pop();                                         // يحذف اسم الصفحة الحالية
  const hostPath = window.location.origin + pathArr.join('/');
  redirInput.value = `${hostPath}/thanksPage.html`;

  /* (3) التحقُّق من رقم الهاتف عند الإرسال */
  form.addEventListener('submit', e => {
    e.preventDefault();

    const val        = phoneInput.value;
    const prefix     = val.substring(0, 3);
    const validPref  = ['010', '011', '012', '015', '٠١٠', '٠١١', '٠١٢', '٠١٥'];
    const errors     = [];

    if (val.length !== 11 || !validPref.includes(prefix)) {
      errors.push('رقم الهاتف غير صحيح !');
    }

    if (errors.length) {
      errorBox.innerText = errors.join(', ');
      errorBox.classList.add('active');
      return;
    }

    form.submit()  // الخطوة التالية
  });

  /* (5) أخيراً: اجلب المدينة بعد توافر الـ DOM */
  setClientCity();
});
