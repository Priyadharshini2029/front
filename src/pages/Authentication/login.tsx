import React, { useState } from "react";
import Link from "next/link"; // Import the Link component from Next.js
import router from "next/router";

// Define the Customer interface for type checking
interface Customer {
  name: string;
  _id: string;
  email: string;
  token: string;
  password: string;
  approved: boolean;
  rolehotel: string;
}
 interface Customerdetails {
  token:string;
  customer:Customer
 }
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send the login credentials to the backend for validation
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: Customerdetails = await response.json();
     console.log("customer details:" , data)
      // Check if the user is approved
      if (!data.customer.approved) {
        throw new Error("Account is not approved yet.");
      }
      localStorage.setItem("Myhotelrole", data.customer.rolehotel)
      if(data.customer.rolehotel !=="Admin"){
        setSuccess("Login successful!");
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      }
      else{
        setSuccess("Login successful!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
      // Successful login
     
      setError("");

      console.log("Login successful:", data);
      // Store the user token, handle redirection, etc. as needed.
    } catch (err: any) {
      setError(err.message || "Login failed");
      setSuccess("");
    }
  };

  return (
    <> 
    <div className="flex items-center justify-center min-h-screen p-10 bg-fuchsia-700">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-md p-6 border border-gray-950">
        <h2 className="text-2xl font-semibold text-black mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
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
            <Link href="/Authentication/register">
              <span className="text-blue-500 hover:underline cursor-pointer">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div></>
  );
};

export default Login; 