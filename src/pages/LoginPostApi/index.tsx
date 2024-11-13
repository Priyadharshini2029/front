import Header from '@/Components/Header';
import React, {useState } from 'react';

// Define the interface for the user data structure
interface User {
  name: string;
  _id: string;
  email: string;
  password: string;
  token:string
}

const FetchMyApi: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // State to store the logged-in user
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Function to handle form submission and login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password in the body
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data: User = await response.json();
      setUser(data); // Set the fetched user data in state
      localStorage.setItem('token', data.token); // Optionally store token in localStorage
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <>
      <Header />
      <div>
        <h2 className="flex justify-center items-center p-5 font-bold text-black text-2xl">User Login</h2>
        {!user ? (
          <form onSubmit={handleLogin} className="flex flex-col items-center p-5">
            <input
              type="email"
              placeholder="Email"
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
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">Login</button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <div className="bg-white rounded-lg p-3 border-slate-500 border border-t-4 border-b-4 border-r-4 border-l-4">
            <h3 className="font-bold text-xl mb-4">Login Successfull!</h3>
            <p><strong>Token:</strong> {user.token}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FetchMyApi;
