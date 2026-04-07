// api.test.js
const request = require('supertest');
const { app, resetOrders } = require('./app');

describe('API Integration Tests', () => {
  
  beforeEach(() => {
    resetOrders();
  });

  const validBody = {
    items: [{ name: "Pizza", price: 12.50, quantity: 2 }],
    distance: 5,
    weight: 2,
    hour: 15.0,
    dayOfWeek: 2
  };

  // ==========================================
  // POST /orders/simulate
  // ==========================================
  describe('POST /orders/simulate', () => {
    it('Commande normale → 200 + détail du prix correct', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send(validBody); // Supertest transforme l'objet en JSON automatiquement

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body.subtotal).toBe(25.00);
      expect(response.body.deliveryFee).toBe(3.00);
    });

    it('Fermé (23h) → 400', async () => {
      const body = { ...validBody, hour: 23.0 };
      const response = await request(app).post('/orders/simulate').send(body);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Le restaurant est actuellement fermé");
    });

    // À TOI DE JOUER : Ajoute les 5 autres tests (promo valide, promo expirée, hors zone...)
  });

  // ==========================================
  // POST /orders
  // ==========================================
  describe('POST /orders', () => {
    it('Commande valide → 201 + commande avec ID', async () => {
      const response = await request(app)
        .post('/orders')
        .send(validBody);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id'); // L'ID doit avoir été généré
      expect(response.body.total).toBe(28.00);
    });

    it('Commande invalide n\'est PAS enregistrée', async () => {
      const invalidBody = { ...validBody, distance: 15 }; // Va throw car > 10km
      
      const response = await request(app).post('/orders').send(invalidBody);
      expect(response.status).toBe(400);

      // On vérifie qu'elle n'est pas passée en essayant un GET (le tableau est censé être vide)
      // Note : Comme on a pas l'ID, on vérifie juste que l'erreur 400 a bien bloqué le push.
      // Le test suivant montre comment lier POST et GET.
    });

    // À TOI DE JOUER : Ajoute les 3 autres tests
  });

  // ==========================================
  // GET /orders/:id
  // ==========================================
  describe('GET /orders/:id', () => {
    it('ID existant → 200 + commande complète', async () => {
      // 1. On crée une commande
      const postRes = await request(app).post('/orders').send(validBody);
      const createdId = postRes.body.id;

      // 2. On la récupère
      const getRes = await request(app).get(`/orders/${createdId}`);
      
      expect(getRes.status).toBe(200);
      expect(getRes.body.id).toBe(createdId);
      expect(getRes.body.total).toBe(28.00);
    });

    it('ID inexistant → 404', async () => {
      const response = await request(app).get('/orders/id-qui-n-existe-pas');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Commande introuvable");
    });
  });

  // ==========================================
  // POST /promo/validate
  // ==========================================
  describe('POST /promo/validate', () => {
    it('Code inconnu → 404', async () => {
      const response = await request(app)
        .post('/promo/validate')
        .send({ promoCode: "FAUXCODE", subtotal: 50 });

      expect(response.status).toBe(404);
    });

    // À TOI DE JOUER : Ajoute les 4 autres tests (Code valide, Code expiré, etc.)
  });

});