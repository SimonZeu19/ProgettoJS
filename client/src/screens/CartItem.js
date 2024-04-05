import React, { useState } from 'react';
import axios from 'axios';
import RemoveFromCart from './RemovefromCart';

function CartItem({ cartItem, onRemove }) {
  return (
    <div>
      <h3>{cartItem.productName}</h3>
      <p>Quantittà: {cartItem.quantity}</p>
      <p>Prezzo Totale: {cartItem.totalPrice}</p>
      <RemoveFromCart cartItemId={cartItem._id} onRemove={onRemove} />
    </div>
  );
}

export default CartItem;