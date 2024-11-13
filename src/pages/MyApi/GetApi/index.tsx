import Header from '@/Components/Header';
import React, { useEffect, useState } from 'react';

// Define the interface for the data structure
interface Shoe {
  shoetype: string;
  name: string;
  _id: string;
  brand: string;
  createdAt: string;
  price:number
}

const FetchMyApi: React.FC = () => {
  const [shoes, setShoe] = useState<Shoe[]>([]); // State to store the selected id for fetching

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shoes`);
      const data: Shoe[] = await response.json(); // Use Product interface for the response
      setShoe(data); // Set the fetched data in state
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data based on the current itemId
  }, []);

  return (
    <><Header/>
    <div>
      <h2 className='flex justify-center items-center p-5 font-bold text-black text-2xl'>List of Shoes</h2>
      <div className=" bg-white rounded-lg grid grid-cols-3 p-3 h-[500px] border-slate-500 border border-t-4 border-b-4 border-r-4 border-l-4 justify-center items-center">
        {shoes.length > 0 ? (
          shoes.map(data=> (
            <div key={data._id} style={{ marginBottom: '20px' }}>
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Id:</strong> {data._id}</p>
              <p><strong>ShoeType:</strong> {data.shoetype}</p>
              <p><strong>Brand:</strong> {data.brand}</p>
              <p><strong>Price:</strong> {data.price}</p>
              <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div></>
  );
};

  
export default FetchMyApi;
