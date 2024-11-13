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
  const [editShoeId, setEditShoeId] = useState<string | null>(null);
  const [updatedShoe, setUpdatedShoe] = useState({
    shoetype: '',
    name: '',
    brand: '',
    price: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch shoes from the API
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shoes`);
      const data: Shoe[] = await response.json();
      setShoes(data);
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  // PUT request to update an existing shoe
  const updateData = async () => {
    if (!editShoeId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/shoes/${editShoeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedShoe),
      });
      if (response.ok) {
        const updatedShoeData: Shoe = await response.json();
        setShoes((prevShoes) =>
          prevShoes.map((shoe) => (shoe._id === editShoeId ? updatedShoeData : shoe))
        );
        setIsModalOpen(false); // Close modal
        setEditShoeId(null); // Exit edit mode
      } else {
        console.error("Failed to update shoe");
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  // Initialize data fetching
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div>
        <h2 className="flex justify-center items-center p-5 text-3xl">List of Shoes</h2>
        <div className="grid grid-cols-3 justify-center items-center">
          {shoes.length > 0 ? (
            shoes.map((shoe) => (
              <div key={shoe._id} style={{ marginBottom: '20px' }}>
                <p><strong>Id:</strong> {shoe._id}</p>
                <p><strong>Name:</strong> {shoe.name}</p>
                <p><strong>ShoeType:</strong> {shoe.shoetype}</p>
                <p><strong>Brand:</strong> {shoe.brand}</p>
                <p><strong>Price:</strong> {shoe.price}</p>
                <div className="flex justify-center items-center p-2 text-lg hover:text-cyan-600">
                  <button onClick={() => {
                    setEditShoeId(shoe._id);
                    setUpdatedShoe({
                      shoetype: shoe.shoetype,
                      name: shoe.name,
                      brand: shoe.brand,
                      price: shoe.price,
                    });
                    setIsModalOpen(true); // Open modal
                  }}>Edit</button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Modal for editing shoe */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-400 p-6 rounded-lg w-1/3">
            <h2 className="text-2xl mb-4">Update Shoe</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateData();
            }}>
              <div className="grid mb-4">
                <label>Shoe Type:</label>
                <input
                  type="text"
                  value={updatedShoe.shoetype}
                  onChange={(e) => setUpdatedShoe({ ...updatedShoe, shoetype: e.target.value })}
                />
              </div>
              <div className="grid mb-4">
                <label>Name:</label>
                <input
                  type="text"
                  value={updatedShoe.name}
                  onChange={(e) => setUpdatedShoe({ ...updatedShoe, name: e.target.value })}
                />
              </div>
              <div className="grid mb-4">
                <label>Brand:</label>
                <input
                  type="text"
                  value={updatedShoe.brand}
                  onChange={(e) => setUpdatedShoe({ ...updatedShoe, brand: e.target.value })}
                />
              </div>
              <div className="grid mb-4">
                <label>Price:</label>
                <input
                  type="number"
                  value={updatedShoe.price}
                  onChange={(e) => setUpdatedShoe({ ...updatedShoe, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="flex justify-end">
                <button type="button" className="mr-2 px-4 py-2 bg-black hover:bg-gray-400 text-white rounded" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-black hover:bg-gray-400 text-white rounded">
                  Update Shoe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FetchMyApi;
