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

function updateText(inputElement, targetElement) {
  inputElement.addEventListener('input', () => {
    targetElement.innerText = inputElement.value;
  });
}

updateText(inputs.name, cert.name);
updateText(inputs.role, cert.role);
updateText(inputs.message, cert.message);
updateText(inputs.date, cert.date);
updateText(inputs.sender, cert.sender);

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
