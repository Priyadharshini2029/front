import Header from '@/Components/Header';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';

// Define the interface for the user data structure
interface User {
  name: string;
  _id: string;
  email: string;
  token: string; // Store JWT token received from backend
}

const Register: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // State to store the registered user
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [name, setName] = useState(''); // State for name input
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Function to handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      // Hash the password before sending
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password: hashedPassword }), // Send hashed password
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      const data: User = await response.json();
      setUser(data); // Set the registered user data and token in state
      localStorage.setItem('token', data.token); // Optionally store token in localStorage
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <>
      <Header />
      <div>
        <h2 className="flex justify-center items-center p-5 font-bold text-black text-2xl">User Registration</h2>
        {!user ? (
          <form onSubmit={handleRegister} className="flex flex-col items-center p-5">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 m-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 m-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 m-2 border rounded"
              required
            />
            <button type="submit" className="p-2 bg-black hover:bg-slate-500 text-white rounded">Register</button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <div className="bg-white rounded-lg p-3 border-slate-500 border border-t-4 border-b-4 border-r-4 border-l-4">
            <h3 className="font-bold text-xl mb-4">Registration Successful!</h3>
            <p><strong>Token:</strong> {user.token}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
