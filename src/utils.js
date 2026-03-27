function capitalizeFirstLetter(string) {
  if (string === null) return "";
  if (string.length === 0) return "";
  if (typeof string !== "string") {
    throw new TypeError("Input must be a string");
  }
  if (!/[a-z]/.test(string.charAt(0))) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function calculateAverage(arr) {
  if (arr === null) return 0;
  if (!Array.isArray(arr)) {
    throw new TypeError("Input must be an array");
  }
  if (arr.length === 0) return 0;
  const allNumbers = arr.every(val => typeof val === 'number' && !isNaN(val));
  if (!allNumbers) {
    throw new TypeError("All elements in the array must be numbers");
  }
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}

function slugify(string) {
  if (typeof string !== "string") {
    throw new TypeError("Input must be a string");
  }

  return string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clamp(value, min, max) {
  if (typeof value !== "number" || typeof min !== "number" || typeof max !== "number") {
    throw new TypeError("All arguments must be numbers");
  }
  return Math.min(Math.max(value, min), max);
}

module.exports = { capitalizeFirstLetter, calculateAverage, slugify, clamp };