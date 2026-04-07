# CI-CDseance2

[![CI Status](https://github.com/Migou27/CI-CDseance1/actions/workflows/ci.yml/badge.svg)](https://github.com/Migou27/CI-CDseance1/actions)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/Migou27/CI-CDseance1?style=flat-square&color=blue)

Node.js training project for practicing CI/CD, testing, and API validation logic with `Express`, `Jest`, `Supertest`, and `ESLint`.

## Features

- Utility helpers (`capitalizeFirstLetter`, `calculateAverage`, `slugify`, `clamp`)
- Validation helpers (`isValidEmail`, `isValidPassword`, `isValidAge`, `sortStudents`)
- Delivery pricing logic:
  - base delivery fee by distance and weight
  - surge coefficient by day/time
  - promo code application from `data/promoCodes.js`
- Order total calculation with full error propagation
- REST API to simulate/create/fetch orders and validate promo codes
- CI workflow for lint + tests

## Tech Stack

- Node.js (CommonJS modules)
- Express
- Jest
- Supertest
- ESLint (flat config)
- GitHub Actions

## Project Structure

```text
.
├── app.js                     # Express API
├── data/
│   └── promoCodes.js          # Promo code catalog
├── src/
│   ├── delivery.js            # Delivery fee, promos, surge
│   ├── order.js               # Final order total calculation
│   ├── utils.js               # Utility functions
│   └── validators.js          # Input validation helpers
├── tests/
│   ├── api.test.js
│   ├── delivery.test.js
│   ├── order.test.js
│   ├── utils.test.js
│   └── validators.test.js
└── .github/workflows/ci.yml   # CI pipeline
```

## Installation

```bash
npm ci
```

## Available Scripts

- `npm test`: run the Jest test suite
- `npm run test:coverage`: run tests with coverage report
- `npm run lint`: run ESLint checks
- `npm run lint:fix`: auto-fix lint issues when possible

## Business Rules

### Delivery Fee (`deliveryFee`)

- Input must be numeric distance and weight
- Distance and weight must be non-negative
- Maximum delivery distance is `10 km`
- Non-integer distance is rounded up
- Formula:
  - base `2 EUR`
  - `+0.5 EUR` per km over 3 km
  - `+1.5 EUR` if weight is over 5 kg

### Surge Coefficient (`calculateSurge`)

- Closed outside `10:00` to `<22:00` -> coefficient `0`
- Sunday (`dayOfWeek = 0`) -> `1.2`
- Friday/Saturday evenings (`19:00-22:00`) -> `1.8`
- Monday-Thursday lunch (`12:00-13:30`) -> `1.3`
- Monday-Thursday dinner (`19:00-21:00`) -> `1.5`
- Otherwise -> `1.0`

### Promo Codes (`applyPromoCode`)

Promo codes are read from `data/promoCodes.js` and validated against:

- Unknown code -> error
- Expired code -> error
- `subtotal < minOrder` -> error
- Type `percentage` -> reduce by `value%`
- Type `fixed` -> reduce by `value` EUR
- Final subtotal is never below `0`

## Order Total Calculation

`calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek)` returns:

- `subtotal`
- `discount`
- `deliveryFee` (base fee multiplied by surge)
- `surge`
- `total`

It also throws domain errors for invalid cart items, invalid promo usage, out-of-range delivery constraints, and closed restaurant periods.

## API Endpoints

### `POST /orders/simulate`

Calculates pricing without storing an order.

Example body:

```json
{
  "items": [{ "name": "Pizza", "price": 12.5, "quantity": 2 }],
  "distance": 5,
  "weight": 2,
  "promoCode": "HELLO10",
  "hour": 15.0,
  "dayOfWeek": 2
}
```

### `POST /orders`

Creates an order in memory and returns it with generated `id`.

### `GET /orders/:id`

Returns an order by id or `404` if not found.

### `POST /promo/validate`

Validates and applies a promo code against a given subtotal.

Example body:

```json
{
  "promoCode": "HELLO10",
  "subtotal": 50
}
```

## Testing

The repository includes unit and integration tests for:

- utility functions
- validators
- delivery/promo/surge logic
- order total logic
- API endpoints (`Supertest`)

Coverage threshold is configured in `package.json` at 80% globally for branches/functions/lines/statements.

## CI

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push and pull requests to `main`/`master`:

1. checkout
2. setup Node.js 20 with npm cache
3. install dependencies with `npm ci`
4. lint with ESLint
5. run Jest tests

