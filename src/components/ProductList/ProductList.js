import React, { useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { fixPriceFormat } from '../../utils/fixPriceFormat';
import ProductQuantity from '../ProductQuantity/ProductQuantity';
import './ProductList.css';

const ProductList = () => {
  const { products, setProducts } = useContext(CartContext);
  const { setCartInfo } = useContext(CartContext);

  const checkCart = async () => {
    const apiResponse = await fetch('/api/cart');
    const cartData = await apiResponse.json();
    return cartData;
  };

  const createCartElements = async () => {
    const cartData = await checkCart();
    const productsInCart = cartData.map((item) => (
      <li key={item.pid} className="product">
        <div className="product-photo">
          <img className="product-photo__image" src={item.photo} alt="zdjęcie produktu" />
        </div>
        <div className="product-info">
          <p className="product-info__name">{item.name}</p>
          <p className="product-info__price">{fixPriceFormat(item.price)}</p>
        </div>

        <ProductQuantity
          pid={item.pid}
          min={item.min}
          max={item.max}
          isBlocked={item.isBlocked}
        />
      </li>
    ));
    setCartInfo(cartData);
    setProducts(productsInCart);
  };

  useEffect(() => {
    createCartElements();
  }, []);

  return (
    <>
      <h3 className="product-list-header">Lista produktów</h3>
      <ul className="product-list">{products}</ul>
    </>
  );
};

export default ProductList;
