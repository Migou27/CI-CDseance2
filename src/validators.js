function isValidEmail(email) {
  if (typeof email !== 'string') {
    throw new TypeError('Email must be a string');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  if (typeof password !== "string") {
    throw new TypeError("Password must be a string");
  }
  let errorList = [];

  if (password.length < 8) errorList.push("longueur");
  if (!/[A-Z]/.test(password)) errorList.push("majuscule");
  if (!/[a-z]/.test(password)) errorList.push("minuscule");
  if (!/[0-9]/.test(password)) errorList.push("chiffre");
  if (!/[!@#$%^&*]/.test(password)) errorList.push("spécial");

  return {
    valid: errorList.length === 0,
    errors: errorList.join(", ")
  };
}

function isValidAge(age) {
  let bool = true;

  if (typeof age !== "number" || !Number.isInteger(age)) {
    throw new TypeError("Age must be an integer");
  }
  if (age < 0 || age > 150) {
    bool = false;
  }

  return bool;
} 

module.exports = { isValidEmail, isValidPassword, isValidAge };