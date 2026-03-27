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


function sortStudents(students, sortBy = "name", order = "asc") {
  // On utilise "throw new" au lieu de "return"
  if (!Array.isArray(students)) throw new TypeError("Students must be an array");
  
  if (students.length === 0) throw new TypeError("Students array cannot be empty");
  
  if (sortBy !== "name" && sortBy !== "age" && sortBy !== "grade") {
    throw new TypeError("sortBy must be either 'name', 'age' or 'grade'");
  }

  const sortedArray = [...students];

  sortedArray.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    let comparison = 0;
    if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB);
    } else {
      comparison = valA - valB;
    }

    return order === "desc" ? comparison * -1 : comparison;
  });

  return sortedArray;
}

module.exports = { isValidEmail, isValidPassword, isValidAge, sortStudents };