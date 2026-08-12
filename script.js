// تحديث التغييرات فوراً أثناء الكتابة
const inputs = document.querySelectorAll('#cert-form input');

inputs.forEach(input => {
  input.addEventListener('input', () => {
    const nameVal = document.getElementById('nameInput').value;
    const courseVal = document.getElementById('courseInput').value;
    const dateVal = document.getElementById('dateInput').value;
    const issuerVal = document.getElementById('issuerInput').value;

    if (nameVal) document.getElementById('certName').innerText = nameVal;
    if (courseVal) document.getElementById('certCourse').innerText = courseVal;
    if (dateVal) document.getElementById('certDate').innerText = dateVal;
    if (issuerVal) document.getElementById('certIssuer').innerText = issuerVal;
  });
});
