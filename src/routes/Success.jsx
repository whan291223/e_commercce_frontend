import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  
  const pollingRef = useRef({ shouldStop: false, timeoutId: null, pollCount: 0 });

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Reset polling state
    pollingRef.current = { shouldStop: false, timeoutId: null, pollCount: 0 };
    const maxPolls = 15;

    const checkStatus = async () => {
      if (pollingRef.current.shouldStop) return;

      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/payment/checkout-status?session_id=${sessionId}`//TODO change to call api
        );

        if (!res.ok) throw new Error("Backend error");

        const data = await res.json();

        if (data.status === "paid") {
          pollingRef.current.shouldStop = true;
          setStatus("success");
          clearCart();
          return;
        }

        setStatus("pending");
        pollingRef.current.pollCount += 1;

        if (pollingRef.current.pollCount < maxPolls && !pollingRef.current.shouldStop) {
          pollingRef.current.timeoutId = setTimeout(checkStatus, 3000);
        } else if (pollingRef.current.pollCount >= maxPolls) {
          pollingRef.current.shouldStop = true;
          setStatus("error");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        pollingRef.current.shouldStop = true;
        setStatus("error");
      }
    };

    checkStatus();

    return () => {
      pollingRef.current.shouldStop = true;
      if (pollingRef.current.timeoutId) {
        clearTimeout(pollingRef.current.timeoutId);
      }
    };
  }, [sessionId, clearCart]);

  const Container = ({ children }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-colors duration-300">
      {children}
    </div>
  );

  if (status === "loading" || status === "pending") {
    return (
      <Container>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {status === "loading" ? "Verifying Payment..." : "Waiting for confirmation..."}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">This may take a few seconds.</p>
      </Container>
    );
  }

  if (status === "success") {
    return (
      <Container>
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-center max-w-md">
          Thank you for your purchase. Your order has been confirmed and is now being processed.
        </p>
        <button
          onClick={() => navigate("/customer")}
          className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Return to Shop
        </button>
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
        <span className="text-4xl">❌</span>
      </div>
      <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Something went wrong</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
        We couldn't verify your payment. If you were charged, please contact support.
      </p>
      <button
        onClick={() => navigate("/customer")}
        className="mt-6 text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        Go back and try again
      </button>
    </Container>
  );
};

export default Success;