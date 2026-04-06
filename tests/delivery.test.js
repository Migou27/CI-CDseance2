const { deliveryFee, applyPromoCode } = require('../src/delivery');

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


describe('Tests de la fonction applyPromoCode', () => {

  it('should return correct price when applying a %tage reduction', () => {
    expect(applyPromoCode(100, "BIENVENUE20")).toBe(80);
  });

  it('should return correct price when applying a fixed reduction', () => {
    expect(applyPromoCode(100, "HELLO10")).toBe(90);
  });

  it('should throw TypeError for non-numeric subtotal', () => {
    expect(() => applyPromoCode("one hundred", "BIENVENUE20")).toThrow(TypeError);
  });
  
  it('should throw RangeError for negative subtotal', () => {
    expect(() => applyPromoCode(-1, "BIENVENUE20")).toThrow(RangeError);
  });

  it('should throw TypeError for non-string promo code', () => {
    expect(() => applyPromoCode(100, 123)).toThrow(TypeError);
  });

  it('should throw TypeError for empty promoCode', () => {
    expect(() => applyPromoCode(100, "   ")).toThrow(TypeError);
  });
  
  it('should throw Error for non-existing promo code', () => {
    expect(() => applyPromoCode(100, "INVALIDCODE")).toThrow(Error);
  });

  it('should throw Error for promo code with insufficient subtotal', () => {
    expect(() => applyPromoCode(10, "HELLO10")).toThrow(Error);
  });

  it('should throw Error for expired promo code', () => {
    expect(() => applyPromoCode(100, "LUCKY5")).toThrow(Error);
  });

  it('should throw Error when subtotal is null', () => {
    expect(() => applyPromoCode(null, "BIENVENUE20")).toThrow(TypeError);
  });

  it('should throw Error when promoCode is null', () => {
    expect(() => applyPromoCode(100, null)).toThrow(TypeError);
  });

});