import React from 'react';
import CartContextProvider from '../../contexts/CartContext';
import CartValue from '../CartValue/CartValue';
import ProductList from '../ProductList/ProductList';
import './App.css';

const App = () => {
  return (
    <div className='container'>
      <CartContextProvider>
        <ProductList />
        <CartValue />
      </CartContextProvider>
    </div>
  );
};

export { App };
