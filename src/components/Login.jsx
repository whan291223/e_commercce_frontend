import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserApi from "../api/UserApi.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await UserApi.login(username, password);
      const token = response.data.access_token;
      sessionStorage.setItem("jwt_token", token);

      const sessionRes = await UserApi.getSession(token);
      const role = sessionRes.data.role;

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(`Invalid credentials or server error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white  dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Login
        </h1>

        {location.state?.signupSuccess && (
          <p className="text-green-600 text-center mb-4">
            User created successfully. Please login.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 dark:text-white">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
          >
            Login
          </button>

          {error && (
            <p className="text-red-600 text-center text-sm">{error}</p>
          )}

          <p className="text-center text-gray-600 dark:text-white">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
