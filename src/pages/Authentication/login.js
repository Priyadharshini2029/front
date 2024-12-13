import React, { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess("Login successful!");
      setError(""); // Clear any previous errors
      router.push("/dashboard"); // Navigate to dashboard after successful login
    } catch (err) {
      setError(err.message || "Login failed");
      setSuccess(""); // Clear success message on error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 bg-fuchsia-700">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-md p-6 border border-gray-950">
        <h2 className="text-2xl font-semibold text-black mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {success && <p className="text-green-600 mt-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 mt-6 rounded-md hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-black">
            Do not have an account?{" "}
            <a
              href="/Authentication/register"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
