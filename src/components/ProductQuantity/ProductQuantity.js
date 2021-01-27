import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import './ProductQuantity.css';

const ProductQuantity = (props) => {
  const [quantity, setQuantity] = useState(props.min);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [addBtn, setAddBtn] = useState(true);
  const [removeBtn, setRemoveBtn] = useState(true);

  const { cartInfo, setCartInfo } = useContext(CartContext);

  const updateQuantityInfo = (num) => {
    const newCartInfo = [...cartInfo];
    for (let prop in newCartInfo) {
      if (newCartInfo[prop].pid === props.pid) {
        newCartInfo[prop].quantity = quantity + num;
      }
    }
    setCartInfo(newCartInfo);
  };

  useEffect(() => {
    updateQuantityInfo(0);
  }, []);

  const addProduct = async () => {
    const productData = {
      pid: props.pid,
      quantity: quantity + 1,
    };
    await setLoadingState(true);
    const apiResponse = await fetch('/api/product/check', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    const productStatus = await apiResponse.json();
    await setLoadingState(false);

    if (productStatus.success) {
      setQuantity(quantity + 1);
      updateQuantityInfo(1);
      setErrorMsg('');
      setRemoveBtn(true);
    } else {
      setErrorMsg(
        'Obecnie posiadamy tylko ' + props.max + ' szt. tego produktu'
      );
      setAddBtn(false);
    }
  };

  const removeProduct = async () => {
    const productData = {
      pid: props.pid,
      quantity: quantity - 1,
    };
    await setLoadingState(true);
    const apiResponse = await fetch('/api/product/check', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    const productStatus = await apiResponse.json();
    await setLoadingState(false);

    if (productStatus.success) {
      setQuantity(quantity - 1);
      updateQuantityInfo(-1);
      setErrorMsg('');
      setAddBtn(true);
    } else {
      setErrorMsg('Osiągnięto minimalną ilość produktów');
      setRemoveBtn(false);
    }
  };

  let changeQuantityBtns;

  if (loadingState) {
    changeQuantityBtns = (
      <div className="product-quantity-btns">
        <div className="loading-overlay">
          <img
            className="loading-overlay__spinner"
            src="https://media.empik.com/content/elements/spinner-40-black.svg"
            alt="ikona ładowania"
          />
        </div>
        <button type="button" className="product-quantity__btn" disabled onClick={addProduct}>+</button>
        <button type="button" className="product-quantity__btn" disabled onClick={removeProduct}>-</button>
      </div>
    );
  } else if (props.isBlocked) {
    changeQuantityBtns = (
      <div className="product-quantity-btns">
        <button type="button" className="product-quantity__btn" disabled onClick={addProduct}>+</button>
        <button type="button" className="product-quantity__btn" disabled onClick={removeProduct}>-</button>
      </div>
    );
  } else if (!addBtn) {
    changeQuantityBtns = (
      <div className="product-quantity-btns">
        <button type="button" className="product-quantity__btn" disabled onClick={addProduct}>+</button>
        <button type="button" className="product-quantity__btn" onClick={removeProduct}>-</button>
      </div>
    );
  } else if (!removeBtn) {
    changeQuantityBtns = (
      <div className="product-quantity-btns">
        <button type="button" className="product-quantity__btn" onClick={addProduct}>+</button>
        <button type="button" className="product-quantity__btn" disabled onClick={removeProduct}>-</button>
      </div>
    );
  } else {
    changeQuantityBtns = (
      <div className="product-quantity-btns">
        <button type="button" className="product-quantity__btn" onClick={addProduct}>+</button>
        <button type="button" className="product-quantity__btn" onClick={removeProduct}>-</button>
      </div>
    );
  }

  return (
    <div className="product-quantity">
      <p className="product-quantity__text">
        Obecnie masz {quantity} szt. produktu
      </p>
      {changeQuantityBtns}
      <p className="product-quantity__text product-quantity__text--error">
        {errorMsg}
      </p>
    </div>
  );
};

export default ProductQuantity;
