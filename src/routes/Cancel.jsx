import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cancel = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const Container = ({ children }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-colors duration-300">
      {children}
    </div>
  );

  return (
    <Container>
      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mb-4">
        <span className="text-4xl">⚠️</span>
      </div>
      <h1 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
        Payment Cancelled
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-3 text-center max-w-md">
        No worries! Your {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} {cartItems.length !== 1 ? 'are' : 'is'} still safely in your cart.
      </p>
      
      <button
        onClick={() => navigate("/shop")}
        className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
      >
        Return to Shop
      </button>
    </Container>
  );
};

export default Cancel;