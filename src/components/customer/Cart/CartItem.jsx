import React from 'react';
import { useCart } from '../../../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, addToCart } = useCart();

  // Helper to handle decreasing quantity
  // (Assuming you add a 'decrease' method to your context later)
  const handleRemoveOne = () => {
    if (item.quantity > 1) {
      // You can pass a negative quantity or create a specific 'updateQuantity' method
      // For now, let's keep it simple:
      removeFromCart(item.id); 
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="cart-item-container" style={itemStyles}>
      <div className="item-details">
        <h4>{item.name}</h4>
        <p>${item.price.toFixed(2)} x {item.quantity}</p>
      </div>

      <div className="item-actions">
        <div className="quantity-controls">
          {/* Button to add more of the same item */}
          <button onClick={() => addToCart(item)}>+</button>
          <span>{item.quantity}</span>
          <button onClick={handleRemoveOne}>-</button>
        </div>
        
        <button 
          className="delete-btn" 
          onClick={() => removeFromCart(item.id)}
          style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}
        >
          Remove All
        </button>
      </div>
    </div>
  );
};

// Quick inline styles for layout (you can move these to CSS)
const itemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #eee'
};

export default CartItem;