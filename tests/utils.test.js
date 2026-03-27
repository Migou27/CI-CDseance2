const { capitalizeFirstLetter, calculateAverage, slugify, clamp } = require('../src/utils.js');

describe('Tests des fonctions utilitaires', () => {

  // --- Tests pour capitalizeFirstLetter ---
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter('bonjour')).toBe('Bonjour');
    });

    it('should return an empty string when the input is an empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should return an empty string when the input is null', () => {
      expect(capitalizeFirstLetter(null)).toBe('');
    });

    it('should return the original string when the first character is a number', () => {
      expect(capitalizeFirstLetter('123abc')).toBe('123abc');
    });

    it('should return the original string when the first character is a special character', () => {
      expect(capitalizeFirstLetter('@hello')).toBe('@hello');
    });

    it('should throw a TypeError when the input is not a string', () => {
      expect(() => capitalizeFirstLetter(123)).toThrow(TypeError);
    });
  });

  // --- Tests pour calculateAverage ---
  describe('calculateAverage', () => {
    it('should calculate the average correctly', () => {
      expect(calculateAverage([10, 20, 30])).toBe(20);
    });

    it('should calculate the average correctly for positive and negative numbers', () => {
      expect(calculateAverage([-1, -2, -3, 3, 2, 1])).toBe(0);
    });

    it('should return 0 when the array is empty', () => {
      expect(calculateAverage([])).toBe(0);
    });

    it('should return 0 when the array is null', () => {
      expect(calculateAverage(null)).toBe(0);
    });

    it('should throw a TypeError when the array contains non-numeric values', () => {
      expect(() => calculateAverage([1, 2, 'a'])).toThrow(TypeError);
    });

    it('should throw a TypeError when the input is not an array', () => {
      expect(() => calculateAverage("not an array")).toThrow(TypeError);
    });

  });

  // --- Tests pour slugify ---
  describe('slugify', () => {
    it('should transform a simple sentence into a slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters and handle multiple spaces', () => {
      expect(slugify('  Un Super Titre !@#  ')).toBe('un-super-titre');
    });

    it('should return a TypeError string when the input is null', () => {
      expect(() => slugify(null)).toThrow(TypeError);
    });

    it('should throw a TypeError when the input is not a string', () => {
      expect(() => slugify(123)).toThrow(TypeError);
      expect(() => slugify({})).toThrow(TypeError);
    });
  });

  // --- Tests pour clamp ---
  describe('clamp', () => {
    it('should return the value if it is between the min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return the minimum if the value is less than the minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return the maximum if the value is greater than the maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should throw a TypeError if any argument is not a number', () => {
      expect(() => clamp('5', 0, 10)).toThrow(TypeError);
    });
  });

});