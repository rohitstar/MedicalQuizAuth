const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  const value = email.trim();
  if (!value) {
    return 'Email is required.';
  }
  if (!EMAIL_PATTERN.test(value)) {
    return 'Enter a valid email address.';
  }
  return '';
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must contain at least six characters.';
  }
  return '';
}

export function validateLoginForm(email, password) {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
}
