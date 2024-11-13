import Header from '@/Components/Header';
import React, { useState} from 'react';

// Define the interface for the data structure
interface Shoe {
  shoetype: string;
  name: string;
  _id: string;
  brand: string;
  createdAt: string;
  price: number;
}

const DeleteShoe: React.FC = () => {
  const [shoes, setShoe] = useState<Shoe[]>([]);
  const [deleteshoes, setDeleteShoe] = useState(''); // Store the ID to delete
  const [message, setMessage] = useState('');

 

  // DELETE request to remove a shoe by ID
  const deleteShoe = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shoes/${deleteshoes}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setShoe((prevShoe) => prevShoe.filter(data => data._id !== deleteshoes));
        setMessage('Shoe deleted successfully');
        setDeleteShoe(''); // Clear the input field
      } else {
        setMessage('Failed to delete shoe. Check if the ID is correct.');
      }
    } catch (error) {
      setMessage(`Error deleting shoe: ${(error as Error).message}`);
    }
  };

 
  return (
    <><Header/>
    <div>
      <h2  className='flex justify-center items-center p-3 text-2xl'>Delete Shoe by ID</h2>
      <div className='flex justify-center items-center p-2'>
        <label htmlFor="deleteShoe">Shoe ID:</label>
        <input
          type="text"
          id="deleteShoe"
          value={deleteshoes}
          onChange={(e) => setDeleteShoe(e.target.value)}
          placeholder="Shoe ID"
        />
      </div>
      <div className='flex justify-center items-center p-2 text-2xl hover:text-fuchsia-500'>
      <button onClick={deleteShoe}>Delete Shoe</button></div>
      {message && <p>{message}</p>}

      </div></>
    
  );
};

export default DeleteShoe;
