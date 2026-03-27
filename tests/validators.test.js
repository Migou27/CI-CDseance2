const { isValidEmail, isValidPassword, isValidAge } = require('../src/validators');

describe('Tests des validateurs', () => {

  describe('isValidEmail', () => {

    it('should return true for valid email 1', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return true for valid email 2', () => {
      expect(isValidEmail('test.test@test.com')).toBe(true);
    });
    
    it('should return false for invalid email 1', () => {
      expect(isValidEmail('invalid')).toBe(false);
    });

    it('should return false for invalid email 2', () => {
      expect(isValidEmail('@domain.com')).toBe(false);
    });

    it('should return false for invalid email 3', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should return false for invalid email 4', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should return a TypeError when email is not a string', () => {
      expect(() => isValidEmail(null)).toThrow(TypeError);
    });

    it('should return a TypeError when email is a null', () => {
      expect(() => isValidEmail(null)).toThrow(TypeError);
    });

  });

  describe('isValidPassword', () => {

    it('should return true for valid password', () => {
      const result = isValidPassword('Password123!'); 
      expect(result.valid).toBe(true);
    });

    it ('should return false for password is empty', () => {
      const result = isValidPassword('');
      expect(result.valid).toBe(false);
      expect(result.errors).toBe("longueur, majuscule, minuscule, chiffre, spécial");
    });

    it ('should return multiple errors when password is invalid for multiple reasons', () => {
      const result = isValidPassword('short');
      expect(result.valid).toBe(false);
      expect(result.errors).toBe("longueur, majuscule, chiffre, spécial");
    });

    it ('should return error for password without uppercase', () => {
      const result = isValidPassword('alllowercase123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toBe("majuscule");
    });

    it ('should return error for password without lowercase', () => {
      const result = isValidPassword('ALLUPPERCASE123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toBe("minuscule");
    });

    it ('should return error for password without digit', () => {
      const result = isValidPassword('NoDigits!Here');
      expect(result.valid).toBe(false);
      expect(result.errors).toBe("chiffre");
    });

    it ('should return error for password without special character', () => {
      const result = isValidPassword('NoSpecial1here');
      expect(result.valid).toBe(false);
      expect(result.errors).toBe("spécial");
    });

    it('should throw TypeError for non-string password', () => {
      expect(() => isValidPassword(12345678)).toThrow(TypeError);
    });

  });

  describe('isValidAge', () => {

    it('should return true for valid age', () => {
      expect(isValidAge(25)).toBe(true);
    });

    it ('should return true for age 0', () => {
      expect(isValidAge(0)).toBe(true);
    });

    it ('should return true for age 150', () => {
      expect(isValidAge(150)).toBe(true);
    });

    it('should return false for age less than 0', () => {
      expect(isValidAge(-1)).toBe(false);
    });

    it('should return false for age greater than 150', () => {
      expect(isValidAge(151)).toBe(false);
    });

    it('should throw TypeError when age is not a number', () => {
      expect(() => isValidAge("twenty")).toThrow(TypeError);
    });

     it('should throw TypeError for non-integer number', () => {
      expect(() => isValidAge(25.5)).toThrow(TypeError);
     });

  });

});