import React, { useState } from "react";
import Link from "next/link"; // Import the Link component from Next.js
import { useRouter } from "next/router"; // For navigating between pages

// Define the Customer interface for type checking
interface Customer {
  name: string;
  email: string;
  password: string;
  age: number;
  mobilenumber: number;
  approved: boolean;
  rolehotel: string;
}

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Convert age and mobilenumber to numbers before creating the customer object
      const newCustomer: Customer = {
        name,
        email,
        password,
        age: parseInt(age), // Convert age to number
        mobilenumber: parseInt(mobilenumber), // Convert mobilenumber to number
        approved: false, // Default to not approved
        rolehotel: "customer", // Default role
      };

      // Send the customer data to the backend
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Registration successful
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/Authentication/login");
      }, 3000);

      // Clear form fields
      setName("");
      setEmail("");
      setPassword("");
      setAge("");
      setMobilenumber("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-fuchsia-700">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-md p-6 border border-gray-950">
          <h2 className="text-2xl font-semibold text-black mb-6">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
                required
              />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Mobile Number"
                value={mobilenumber}
                onChange={(e) => setMobilenumber(e.target.value)}
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
              <Link href="/Authentication/login">
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Login here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
