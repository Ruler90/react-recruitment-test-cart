export const fixPriceFormat = (price) => {
  if (!price.includes('.')) {
    price = price + ',00 zł';
  } else if (!price.match(/\.\d{2}/)) {
    price = price + '0 zł';
    price = price.replace('.', ',');
  } else {
    price = price + ' zł';
    price = price.replace('.', ',');
  }
  return price;
};
