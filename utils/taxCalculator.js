function calculateProductTax(price) {
  if (price > 1000 && price <= 5000) {
    return price * 0.12; // Tax PA: 12%
  } else if (price > 5000) {
    return price * 0.18; // Tax PB: 18%
  } else {
    return 0;
  }
}

function calculateServiceTax(price) {
  if (price > 1000 && price <= 8000) {
    return price * 0.1; // Tax SA: 10%
  } else if (price > 8000) {
    return price * 0.15; // Tax SB: 15%
  } else {
    return 0;
  }
}

module.exports = {
  calculateProductTax,
  calculateServiceTax,
};
