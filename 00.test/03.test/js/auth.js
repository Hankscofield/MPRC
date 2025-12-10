const AUTH_STORAGE_KEY = 'parkReports_users';
const SESSION_KEY = 'parkReports_currentUser';

function getUsers() {
  const users = localStorage.getItem(AUTH_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const user = localStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

function registerUser(username, email, password, accountType) {
  const users = getUsers();
  
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  
  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    password: password,
    type: accountType,
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Account created successfully!' };
}

function loginUser(email, password) {
  const users = getUsers();
  
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  );
  
  if (user) {
    const sessionUser = {
      id: user.id,
      name: user.username,
      email: user.email,
      type: user.type,
      memberSince: user.memberSince
    };
    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  }
  
  return { success: false, message: 'Invalid email or password.' };
}

function logoutUser() {
  clearCurrentUser();
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (loginForm) {
    if (isLoggedIn()) {
      window.location.href = 'dashboard.html';
      return;
    }
    
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (signupForm) {
    if (isLoggedIn()) {
      window.location.href = 'dashboard.html';
      return;
    }
    
    signupForm.addEventListener('submit', handleSignup);
  }
});

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  
  errorDiv.style.display = 'none';
  
  if (!email || !password) {
    errorDiv.textContent = 'Please fill in all fields.';
    errorDiv.style.display = 'block';
    return;
  }
  
  const result = loginUser(email, password);
  
  if (result.success) {
    window.location.href = 'dashboard.html';
  } else {
    errorDiv.textContent = result.message;
    errorDiv.style.display = 'block';
  }
}

function handleSignup(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const accountType = document.querySelector('input[name="accountType"]:checked')?.value || 'user';
  const errorDiv = document.getElementById('signupError');
  const successDiv = document.getElementById('signupSuccess');
  
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  
  if (!username || !email || !password) {
    errorDiv.textContent = 'Please fill in all fields.';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (username.length < 2) {
    errorDiv.textContent = 'Name must be at least 2 characters.';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    errorDiv.textContent = 'Please enter a valid email address.';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (password.length < 4) {
    errorDiv.textContent = 'Password must be at least 4 characters.';
    errorDiv.style.display = 'block';
    return;
  }
  
  const result = registerUser(username, email, password, accountType);
  
  if (result.success) {
    successDiv.textContent = result.message + ' Redirecting to login...';
    successDiv.style.display = 'block';
    
    document.getElementById('signupForm').reset();
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } else {
    errorDiv.textContent = result.message;
    errorDiv.style.display = 'block';
  }
}
