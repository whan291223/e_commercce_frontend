import React from 'react';
import { useCart } from '../../../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, addToCart } = useCart();

  const handleRemoveOne = () => {
    if (item.quantity > 1) {
      removeFromCart(item.id);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div
      className="
        flex items-center justify-between
        py-4
        border-b border-gray-200 dark:border-gray-700
      "
    >
      {/* Item info */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ${item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end space-y-2">
        {/* Quantity controls */}
        <div
          className="
            flex items-center
            border border-gray-300 dark:border-gray-600
            rounded-md
          "
        >
          <button
            onClick={handleRemoveOne}
            className="
              px-3 py-1
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
          >
            −
          </button>

          <span className="px-3 text-sm text-gray-900 dark:text-gray-100">
            {item.quantity}
          </span>

          <button
            onClick={() => addToCart(item)}
            className="
              px-3 py-1
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
          >
            +
          </button>
        </div>

        {/* Remove all */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="
            text-xs
            text-red-500 hover:text-red-600
            dark:text-red-400 dark:hover:text-red-300
            transition
          "
        >
          Remove all
        </button>
      </div>
    </div>
  );
};

export default CartItem;
