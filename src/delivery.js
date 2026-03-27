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

module.exports = { deliveryFee };