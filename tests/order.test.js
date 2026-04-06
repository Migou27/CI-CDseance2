const { calculateOrderTotal } = require('../src/order');

describe('calculateOrderTotal', () => {

  const baseItems = [{ name: "Pizza", price: 12.50, quantity: 2 }];

  describe('Scénarios complets', () => {
    it('Commande standard (Mardi 15h, 5km, 2kg, sans promo)', () => {
      const result = calculateOrderTotal(baseItems, 5, 2, null, 15.0, 2);
      expect(result.total).toBe(28.00);
    });

    it('Commande avec code promo valide (Mardi 15h, 5km, 2kg)', () => {
      const result = calculateOrderTotal(baseItems, 5, 2, "HELLO10", 15.0, 2);
      expect(result.total).toBe(18.00);
    });
  });

  describe('Erreurs internes au panier', () => {
    it('Devrait lever une erreur si le panier est vide', () => {
      expect(() => calculateOrderTotal([], 5, 2, null, 15.0, 2))
        .toThrow("Panier vide : Impossible de passer commande");
    });

    it('Devrait lever une erreur si commande passée pendant la fermeture', () => {
      expect(() => calculateOrderTotal(baseItems, 5, 2, null, 23.0, 2))
        .toThrow("Le restaurant est actuellement fermé");
    });
  });

  describe('Propagation des erreurs des sous-fonctions', () => {

    it('Devrait relancer l\'erreur de deliveryFee si la distance est trop grande', () => {
      expect(() => calculateOrderTotal(baseItems, 15, 2, null, 15.0, 2))
        .toThrow("Distance cannot be greater than 10 km"); 
    });

    it('Devrait relancer l\'erreur de applyPromoCode si le code n\'existe pas', () => {
      expect(() => calculateOrderTotal(baseItems, 5, 2, "CODE_FAUX", 15.0, 2))
        .toThrow("Promo code 'CODE_FAUX' does not exist");
    });

    it('Devrait lever une erreur si le sous-total est inférieur au minimum requis par le code promo', () => {
      const smallItems = [{ name: "Soda", price: 5.00, quantity: 1 }];
      expect(() => calculateOrderTotal(smallItems, 5, 2, "SUMMER25", 15.0, 2))
        .toThrow("Promo code 'SUMMER25' requires a minimum order of 50€");
    });

    it('Devrait relancer l\'erreur de calculateSurge si les formats de temps sont invalides', () => {
      expect(() => calculateOrderTotal(baseItems, 5, 2, null, "15h", 2))
        .toThrow(TypeError);
    });

  });
});