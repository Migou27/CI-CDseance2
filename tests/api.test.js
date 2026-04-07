const request = require('supertest');
const { app, resetOrders } = require('../app'); // Adapte le chemin vers ton fichier app.js

describe('Tests d\'intégration API - Commandes et Promos', () => {
  
  // On vide le tableau des commandes en mémoire avant chaque test
  beforeEach(() => {
    resetOrders();
  });

  // Un corps de requête valide réutilisable pour nos tests
  const validBody = {
    items: [{ name: "Pizza", price: 12.50, quantity: 2 }], // 25.00€
    distance: 5,
    weight: 2,
    hour: 15.0, // 15h
    dayOfWeek: 2 // Mardi
  };

  // ==========================================
  // 1. POST /orders/simulate (7 tests)
  // ==========================================
  describe('POST /orders/simulate', () => {
    it('1. Commande normale → 200 + détail du prix correct', async () => {
      const res = await request(app).post('/orders/simulate').send(validBody);
      expect(res.status).toBe(200);
      expect(res.body.subtotal).toBe(25.00);
      expect(res.body.deliveryFee).toBe(3.00);
      expect(res.body.total).toBe(28.00);
    });

    it('2. Avec code promo valide → réduction appliquée', async () => {
      const body = { ...validBody, promoCode: "HELLO10" }; // HELLO10 offre -10€ fixe
      const res = await request(app).post('/orders/simulate').send(body);
      
      expect(res.status).toBe(200);
      expect(res.body.discount).toBe(10.00);
      expect(res.body.total).toBe(18.00);
    });

    it('3. Avec code promo expiré → 400 + message d\'erreur', async () => {
      const body = { ...validBody, promoCode: "LUCKY5" };
      const res = await request(app).post('/orders/simulate').send(body);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/expir/i);
    });

    it('4. Panier vide → 400', async () => {
      const body = { ...validBody, items: [] };
      const res = await request(app).post('/orders/simulate').send(body);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Panier vide : Impossible de passer commande");
    });

    it('5. Hors zone (> 10 km) → 400', async () => {
      const body = { ...validBody, distance: 15 };
      const res = await request(app).post('/orders/simulate').send(body);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Distance cannot be greater than 10 km");
    });

    it('6. Fermé (23h) → 400', async () => {
      const body = { ...validBody, hour: 23.0 };
      const res = await request(app).post('/orders/simulate').send(body);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Le restaurant est actuellement fermé");
    });

    it('7. Surge (Vendredi 20h) → deliveryFee multiplié', async () => {
      const body = { ...validBody, hour: 20.0, dayOfWeek: 5 }; // Surge 1.8x attendu
      const res = await request(app).post('/orders/simulate').send(body);
      
      expect(res.status).toBe(200);
      expect(res.body.surge).toBe(1.8);
      // Frais de base (3.00) * 1.8 = 5.40
      expect(res.body.deliveryFee).toBe(5.40); 
      expect(res.body.total).toBe(30.40);
    });
  });

  // ==========================================
  // 2. POST /orders (5 tests)
  // ==========================================
  describe('POST /orders', () => {
    it('8. Commande valide → 201 + commande avec ID', async () => {
      const res = await request(app).post('/orders').send(validBody);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.total).toBe(28.00);
    });

    it('9. La commande est retrouvable via GET /orders/:id', async () => {
      const postRes = await request(app).post('/orders').send(validBody);
      const orderId = postRes.body.id;

      const getRes = await request(app).get(`/orders/${orderId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.id).toBe(orderId);
    });

    it('10. Deux commandes → deux IDs différents', async () => {
      const res1 = await request(app).post('/orders').send(validBody);
      const res2 = await request(app).post('/orders').send(validBody);
      
      expect(res1.body.id).not.toBe(res2.body.id);
    });

    it('11. Commande invalide → 400 (pas enregistrée)', async () => {
      const invalidBody = { ...validBody, distance: -5 };
      const res = await request(app).post('/orders').send(invalidBody);
      
      expect(res.status).toBe(400);
    });

    it('12. Vérifier que la commande invalide n\'est PAS enregistrée', async () => {
      const invalidBody = { ...validBody, hour: 23 };
      await request(app).post('/orders').send(invalidBody);
      
      const getRes = await request(app).get('/orders/fake-id-123');
      expect(getRes.status).toBe(404);
    });
  });

  // ==========================================
  // 3. GET /orders/:id (3 tests)
  // ==========================================
  describe('GET /orders/:id', () => {
    it('13. ID existant → 200 + commande complète', async () => {
      const postRes = await request(app).post('/orders').send(validBody);
      const id = postRes.body.id;

      const res = await request(app).get(`/orders/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.total).toBe(28.00);
    });

    it('14. ID inexistant → 404', async () => {
      const res = await request(app).get('/orders/unknown-id-999');
      
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Commande introuvable");
    });

    it('15. La structure retournée est correcte', async () => {
      const postRes = await request(app).post('/orders').send(validBody);
      const res = await request(app).get(`/orders/${postRes.body.id}`);
      
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('subtotal');
      expect(res.body).toHaveProperty('discount');
      expect(res.body).toHaveProperty('deliveryFee');
      expect(res.body).toHaveProperty('surge');
      expect(res.body).toHaveProperty('total');
    });
  });

  // ==========================================
  // 4. POST /promo/validate (5 tests)
  // ==========================================
  describe('POST /promo/validate', () => {
    it('16. Code valide → 200 + détails de la réduction', async () => {
      const res = await request(app).post('/promo/validate').send({
        promoCode: "HELLO10", // -10€ 
        subtotal: 50.00
      });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.discount).toBe(10.00);
      expect(res.body.newSubtotal).toBe(40.00);
    });

    it('17. Code expiré → 400 + raison', async () => {
      const res = await request(app).post('/promo/validate').send({
        promoCode: "LUCKY5", // Code expiré dans promoCodes.js
        subtotal: 50.00
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('18. Commande sous le minimum → 400 + raison', async () => {
      const res = await request(app).post('/promo/validate').send({
        promoCode: "SUMMER25",
        subtotal: 20.00
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/minimum/i);
    });

    it('19. Code inconnu → 404', async () => {
      const res = await request(app).post('/promo/validate').send({
        promoCode: "CODE_MAGIQUE",
        subtotal: 50.00
      });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Promo code 'CODE_MAGIQUE' does not exist");
    });

    it('20. Sans code dans le body → 400', async () => {
      const res = await request(app).post('/promo/validate').send({
        subtotal: 50.00
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Le code promo est requis");
    });
  });

});