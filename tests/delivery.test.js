const { deliveryFee, applyPromoCode, calculateSurge } = require('../src/delivery');

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

describe('calculateSurge', () => {
  
  describe('🟢 Cas nominaux (Chaque multiplicateur)', () => {
    it('Mardi 15h → 1.0 (normal)', () => {
      expect(calculateSurge(15.0, 2)).toBe(1.0);
    });

    it('Mercredi 12h30 → 1.3 (déjeuner)', () => {
      expect(calculateSurge(12.5, 3)).toBe(1.3);
    });

    it('Jeudi 20h → 1.5 (dîner)', () => {
      expect(calculateSurge(20.0, 4)).toBe(1.5);
    });

    it('Vendredi 21h → 1.8 (weekend soir)', () => {
      expect(calculateSurge(21.0, 5)).toBe(1.8);
    });

    it('Dimanche 14h → 1.2 (dimanche entier)', () => {
      expect(calculateSurge(14.0, 0)).toBe(1.2);
    });
  });

  describe('🟡 Transitions et limites', () => {
    it('11h30 pile (Lundi) → normal, le déjeuner ne commence qu\'à 12h', () => {
      expect(calculateSurge(11.5, 1)).toBe(1.0);
    });

    it('19h00 pile (Lundi) → début du dîner', () => {
      expect(calculateSurge(19.0, 1)).toBe(1.5);
    });

    it('22h00 pile → fermé (retourne 0)', () => {
      expect(calculateSurge(22.0, 3)).toBe(0);
    });

    it('9h59 (environ) → fermé car avant 10h', () => {
      // 9h59 = 9 + (59/60) = ~9.983
      expect(calculateSurge(9.98, 4)).toBe(0);
    });

    it('10h00 pile → ouverture normale', () => {
      expect(calculateSurge(10.0, 4)).toBe(1.0);
    });
  });
});