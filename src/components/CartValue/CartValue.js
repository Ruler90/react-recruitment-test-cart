import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { fixPriceFormat } from '../../utils/fixPriceFormat';
import './CartValue.css';

const CartValue = () => {
  const [cartValue, setCartValue] = useState(0);
  const { cartInfo } = useContext(CartContext);

  const calculateCartValue = () => {
    let finalCartValue = 0;
    for (let prop in cartInfo) {
      const prodPrice = cartInfo[prop].price * cartInfo[prop].quantity;
      finalCartValue = finalCartValue + prodPrice;
    }
    return fixPriceFormat(finalCartValue.toFixed(2).toString());
  };

  useEffect(() => {
    setCartValue(calculateCartValue());
  }, [cartInfo]);

  return (
    <>
      <h3 className="cart-value-info">Wartość koszyka:</h3>
      <p className="cart-value-price">{cartValue}</p>
    </>
  );
};

export default CartValue;
