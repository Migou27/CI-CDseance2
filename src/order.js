const { deliveryFee, applyPromoCode, calculateSurge } = require('./delivery');

function calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek) {

  if (!items || items.length === 0) {
    throw new Error("Panier vide : Impossible de passer commande");
  }

  let subtotal = 0;
  for (const item of items) {
    if (item.price < 0) throw new Error("Le prix d'un article ne peut pas être négatif");
    if (item.quantity <= 0) throw new Error("La quantité d'un article doit être supérieure à 0");
    
    subtotal += item.price * item.quantity;
  }

  let surge;
  try {
    surge = calculateSurge(hour, dayOfWeek);
  } catch (error) {
    throw error; 
  }

  if (surge === 0) {
    throw new Error("Le restaurant est actuellement fermé");
  }

  let baseDeliveryFee;
  try {
    baseDeliveryFee = deliveryFee(distance, weight);
  } catch (error) {
    throw error; 
  }

  let discountedSubtotal = subtotal;
  let discount = 0;

  if (promoCode) {
    try {
      discountedSubtotal = applyPromoCode(subtotal, promoCode);
      
      discount = subtotal - discountedSubtotal;

      if (discount < 0) {
        discount = 0;
        discountedSubtotal = subtotal;
      }
    } catch (error) {
      throw error;
    }
  }

  const finalDeliveryFee = baseDeliveryFee * surge; 
  const total = discountedSubtotal + finalDeliveryFee; 

  const round2 = (num) => Number(Math.round(num + "e2") + "e-2");

  return {
    subtotal: round2(subtotal),
    discount: round2(discount),
    deliveryFee: round2(finalDeliveryFee),
    surge: surge,
    total: round2(total)
  };
}

module.exports = { calculateOrderTotal };