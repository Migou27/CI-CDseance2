// app.js
const express = require('express');
const { applyPromoCode } = require('./src/delivery');
const { calculateOrderTotal } = require('./src/order');

const app = express();
app.use(express.json());

let orders = [];

const resetOrders = () => {
  orders = [];
};

app.post('/orders/simulate', (req, res) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    const result = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/orders', (req, res) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    const result = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);

    const id = Date.now().toString() + Math.floor(Math.random() * 1000);
    const newOrder = { id, items, ...result };
    
    orders.push(newOrder);
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ error: "Commande introuvable" });
  }
  
  res.status(200).json(order);
});

app.post('/promo/validate', (req, res) => {
  try {
    const { promoCode, subtotal } = req.body;
    
    if (!promoCode) {
      return res.status(400).json({ error: "Le code promo est requis" });
    }

    const newSubtotal = applyPromoCode(subtotal, promoCode);
    const discount = subtotal - newSubtotal;

    res.status(200).json({ 
      valid: true, 
      discount,
      newSubtotal 
    });
  } catch (error) {
    if (error.message.includes("does not exist")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = { app, resetOrders };