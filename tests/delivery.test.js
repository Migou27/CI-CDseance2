const { deliveryFee } = require('../src/delivery');

describe('Tests de la fonction deliveryFee', () => {

  it('should return correct fee for distance 2 and weight 3', () => {
    expect(deliveryFee(2, 3)).toBe(2);
  });
  it('should return correct fee for distance 2 and weight 6', () => {
    expect(deliveryFee(2, 6)).toBe(3.5);
  });
  it('should return correct fee for distance 5 and weight 3', () => {
    expect(deliveryFee(5, 3)).toBe(3);
  });
  it('should return correct fee for distance 5 and weight 6', () => {
    expect(deliveryFee(5, 6)).toBe(4.5);
  });

  it('should throw TypeError for non-numeric distance', () => {
    expect(() => deliveryFee("five", 3)).toThrow(TypeError);
  });

  it('should throw TypeError for non-numeric weight', () => {
    expect(() => deliveryFee(5, "six")).toThrow(TypeError);
  });

  it('should throw RangeError for negative distance', () => {
    expect(() => deliveryFee(-1, 3)).toThrow(RangeError);
  });

  it('should throw RangeError for negative weight', () => {
    expect(() => deliveryFee(5, -1)).toThrow(RangeError);
  });

  it('should throw RangeError for distance greater than 10', () => {
    expect(() => deliveryFee(11, 3)).toThrow(RangeError);
  });

  it('should round up non-integer distance', () => {
    expect(deliveryFee(3.2, 3)).toBe(2.5);
  });

});