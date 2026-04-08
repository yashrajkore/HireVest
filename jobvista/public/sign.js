const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});

const registerForm = document.querySelector('.sign-up form');
const loginForm = document.querySelector('.sign-in form');

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = registerForm.querySelector('input[placeholder="Name"]').value;
    const email = registerForm.querySelector('input[placeholder="Email"]').value;
    const password = registerForm.querySelector('input[placeholder="Password"]').value;
    const userType = registerForm.querySelector('#user-type').value;

    const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userType })
    });

    const data = await res.json();
    if (data.success) {
        if (userType === 'job_seeker') {
            window.location.href = 'home.html';
        } else if (userType === 'recruiter') {
            window.location.href = 'recruiter_home.html';
        }
    } else {
        showError(data.message);
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[placeholder="Email"]').value;
  const password = loginForm.querySelector('input[placeholder="Password"]').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  
  if (data.success) {
    if (data.userType === 'recruiter') {
        window.location.href = 'recruiter_home.html';
    } else {
        window.location.href = 'home.html';
    }
  } else {
    showError(data.message);
  }
});

// Error function
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.textContent = message;
  errorDiv.style.color = 'red';
  errorDiv.style.marginTop = '10px';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.fontWeight = '600';

  const form = container.classList.contains('active') ? registerForm : loginForm;
  form.appendChild(errorDiv);

  setTimeout(() => errorDiv.remove(), 4000);
}
