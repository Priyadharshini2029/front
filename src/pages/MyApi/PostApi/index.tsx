import Header from '@/Components/Header';
import React, { useEffect, useState } from 'react';

// Define the interface for the data structure
interface Shoe {
  shoetype: string;
  name: string;
  _id: string;
  brand: string;
  createdAt: string;
  price: number;
}

const FetchMyApi: React.FC = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [newShoe, setNewShoe] = useState({
    shoetype: '',
    name: '',
    brand: '',
    price: 0,
  });

  

  // POST request to add a new shoe
  const postData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shoes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShoe),
      });
      if (response.ok) {
        const addedShoe: Shoe = await response.json();
        setShoes((prevShoes) => [...prevShoes, addedShoe]);
        setNewShoe({ shoetype: '', name: '', brand: '', price: 0 }); // Reset form
      } else {
        console.error("Failed to add shoe");
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

 

  return (
    <><Header/><div>
      <h2 className='flex justify-center items-center p-5 text-5xl'>List of Shoes</h2>

    </div><h2 className='flex justify-center items-center p-3 text-2xl'>Add New Shoe</h2><form onSubmit={(e) => {
      e.preventDefault();
      postData();
    } }>
        <div className='flex justify-center items-center p-2'>
          <label>Shoe Type:</label>
          <input
            type="text"
            value={newShoe.shoetype}
            onChange={(e) => setNewShoe({ ...newShoe, shoetype: e.target.value })} />
        </div>
        <div className='flex justify-center items-center p-2'>
          <label>Name:</label>
          <input
            type="text"
            value={newShoe.name}
            onChange={(e) => setNewShoe({ ...newShoe, name: e.target.value })} />
        </div>
        <div className='flex justify-center items-center p-2'>
          <label>Brand:</label>
          <input
            type="text"
            value={newShoe.brand}
            onChange={(e) => setNewShoe({ ...newShoe, brand: e.target.value })} />
        </div>
        <div className='flex justify-center items-center p-2'>
          <label>Price:</label>
          <input
            type="number"
            value={newShoe.price}
            onChange={(e) => setNewShoe({ ...newShoe, price: parseFloat(e.target.value) })} />
        </div>
        <div className='flex justify-center items-center p-2 text-2xl hover:text-fuchsia-500'>
        <button  type="submit">Add Shoe</button></div>
      </form></>
    
  );
};

export default FetchMyApi;
