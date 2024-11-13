import Header from '@/Components/Header';
import React, { useState, useEffect } from 'react';

const ValidateToken: React.FC = () => {
  const [token, setToken] = useState<string>(''); // Initialize as empty string
  const [validationMessage, setValidationMessage] = useState<string | null>(null); // State for validation result
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading

  // useEffect to set token from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  // Function to validate the token
  const validateToken = async () => {
    if (!token) {
      setValidationMessage('No token found. Please log in or register first.');
      return;
    }

    setIsLoading(true);
    setValidationMessage(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/validate-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed. Please log in again.');
      }

      const data = await response.json();
      setValidationMessage('Token is valid.'); // Message on successful validation
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center p-5">
        <h2 className="text-2xl font-bold text-center p-5">Validate Token</h2>
        <input
          type="text"
          placeholder="Enter token"
          value={token}
          onChange={(e) => setToken(e.target.value)} // Update token on input change
          className="p-2 m-2 border rounded w-full max-w-md"
        />
        <button
          onClick={validateToken}
          className="p-2 bg-blue-500 text-white rounded w-full max-w-md"
          disabled={isLoading}
        >
          {isLoading ? 'Validating...' : 'Validate Token'}
        </button>
        {validationMessage && <p className="text-green-500 mt-4">{validationMessage}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default ValidateToken;
