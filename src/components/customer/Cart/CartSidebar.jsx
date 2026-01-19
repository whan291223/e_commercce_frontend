import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import { useCart } from '../../../context/CartContext';
import CartItem from './CartItem';
import cartBlank from '../../../assets/cart-blank.svg';
import UserApi from '../../../api/UserApi';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ Add this

  const token = sessionStorage.getItem('jwt_token');

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    UserApi.getSession(token)
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Failed to get user session', err);
        if (err.response?.status === 401) {
          sessionStorage.removeItem("jwt_token");
          setUser(null);
        }
      });
  }, [token]);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // ✅ Require login for checkout
    if (!user) {
      toggleCart(); // Close cart
      navigate("/login", { state: { from: "/shop", checkoutIntent: true } }); // Redirect to login
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/payment/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
            user_id: user.id, // TODO need to not send user id instead check from session
          }),
        }
      );

      if (!res.ok) throw new Error("Checkout failed");

      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout. Please try again.");
      setLoading(false);
    }
  };

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
        <div className="flex flex-col h-full p-6 min-h-0">
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
          <div className="flex-1 overflow-hidden min-h-0">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <img
                  src={cartBlank}
                  alt="Empty Cart"
                  className="w-32 h-32 object-contain dark:invert"
                />
                <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
                  Your cart is empty.
                </p>
              </div>
            ) : (
              <div className="h-full min-h-0 space-y-4 overflow-y-auto pr-2">
                {cartItems.map(item => (
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
                onClick={handleCheckout}
                disabled={loading}
                className="
                  w-full py-3 rounded-lg
                  bg-indigo-600 hover:bg-indigo-700
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  text-white font-semibold
                  transition
                "
              >
                {loading ? "Redirecting to Stripe…" : user ? "Proceed to Checkout" : "Login to Checkout"}
              </button>
              
              {!user && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  You'll be redirected to login
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;