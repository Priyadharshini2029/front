import React, { useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess("Registration successful!");
      setError(""); // Clear any previous errors
      router.push("/Authentication/login"); // Navigate to login page after successful registration
    } catch (err) {
      setError(err.message || "Registration failed");
      setSuccess(""); // Clear success message on error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 bg-fuchsia-700">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-md p-6 border border-gray-950">
        <h2 className="text-2xl font-semibold text-black mb-6">Register</h2>
        <form onSubmit={handleRegister}>
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
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-black">
            Already have an account?{" "}
            <a
              href="/Authentication/login"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
