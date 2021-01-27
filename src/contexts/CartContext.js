import React, { createContext, useState } from 'react';

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartInfo, setCartInfo] = useState([]);

  return (
    <CartContext.Provider value={{ products, setProducts, cartInfo, setCartInfo }}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
