import React from 'react';
import { useCart } from '../../../context/CartContext';
import CartItem from './CartItem';
import cartBlank from '../../../assets/cart-blank.svg';
const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, cartTotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 z-40
          bg-black/40 dark:bg-black/60
          transition-opacity duration-300
          ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-md
          bg-white dark:bg-gray-900
          shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
                onClick={toggleCart}
                className="text-2xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
                &times;
            </button>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Your Shopping Cart
            </h2>
            </div>

          {/* Items */}
          <div className="flex-1">
            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                {/* Blank cart icon */}
                <img
                    src={cartBlank}// adjust path if needed
                    alt="Empty Cart"
                    className="w-32 h-32 object-contain dark:invert"
                />
                <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
                    Your cart is empty.
                </p>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto h-full">
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
                </div>
            )}
            </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-medium mb-4">
                <span className="text-gray-700 dark:text-gray-300">Total</span>
                <span className="text-gray-900 dark:text-white">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                className="
                  w-full py-3 rounded-lg
                  bg-indigo-600 hover:bg-indigo-700
                  text-white font-semibold
                  transition
                "
              >
                Pay with Stripe
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
