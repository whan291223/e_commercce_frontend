import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserApi from "../api/UserApi.jsx";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await UserApi.signup(username, password);
      navigate("/login", { state: { signupSuccess: true } });
    } catch (err) {
      setError(`Signup failed. Try a different username. ${err}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Signup
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                       py-2 rounded-lg transition font-semibold"
          >
            Signup
          </button>

          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
