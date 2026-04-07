const promoCodes = require('../data/promoCodes.js');

function deliveryFee(distance, weight) {
  if (typeof distance !== 'number' || typeof weight !== 'number') {
    throw new TypeError("Distance and weight must be numbers");
  }
  if (distance < 0 || weight < 0) {
    throw new RangeError("Distance and weight cannot be negative");
  }

  if (distance > 10) {
    throw new RangeError("Distance cannot be greater than 10 km");
  }

  if (!Number.isInteger(distance)) {
    distance = Math.ceil(distance);
  }

  const fee = 2 + (distance > 3 ? 0.5 * (distance - 3) : 0) + (weight > 5 ? 1.5 : 0);

  return fee;

}

function applyPromoCode(subtotal, promoCode) {
  if (typeof subtotal !== 'number') {
    throw new TypeError("Subtotal must be a number");
  }
  if (subtotal < 0) {
    throw new RangeError("Subtotal cannot be negative");
  }
  if (typeof promoCode !== 'string' || promoCode.trim() === '') {
    throw new TypeError("Promo code must be a non-empty string");
  }

  const activePromo = promoCodes.find(promo => promo.code === promoCode.trim());

  if (!activePromo) {
    throw new Error(`Promo code '${promoCode}' does not exist`);
  }

  if (subtotal < activePromo.minOrder) {
    throw new Error(`Promo code '${activePromo.code}' requires a minimum order of ${activePromo.minOrder}€`);
  }

  const expiresAt = new Date(activePromo.expiresAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (expiresAt < today) {
    throw new Error(`Promo code '${activePromo.code}' has expired`);
  }

  let discountedTotal;
  if (activePromo.type === 'percentage') {
    discountedTotal = subtotal - (subtotal * activePromo.value / 100);
  } else if (activePromo.type === 'fixed') {
    discountedTotal = subtotal - activePromo.value;
  } else {
    throw new Error(`Promo code '${activePromo.code}' has unsupported type '${activePromo.type}'`);
  }

  return Math.max(0, Number(discountedTotal.toFixed(2)));
}

function calculateSurge(hour, dayOfWeek) {
  if (typeof hour !== 'number' || typeof dayOfWeek !== 'number') {
    throw new TypeError("hour and dayOfWeek must be numbers");
  }
  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new RangeError("dayOfWeek must be between 0 (Sunday) and 6 (Saturday)");
  }

  if (hour < 10 || hour >= 22) {
    return 0; // Fermé
  }

  if (dayOfWeek === 0) {
    return 1.2;
  }

  if (dayOfWeek === 5 || dayOfWeek === 6) {
    if (hour >= 19 && hour < 22) {
      return 1.8;
    }
    return 1.0;
  }

  if (dayOfWeek >= 1 && dayOfWeek <= 4) {
    if (hour >= 12 && hour < 13.5) {
      return 1.3;
    }
    if (hour >= 19 && hour < 21) {
      return 1.5;
    }
    return 1.0;
  }

  //return 1.0;
}

module.exports = { calculateSurge };
module.exports = { deliveryFee, applyPromoCode, calculateSurge };