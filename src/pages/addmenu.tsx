import Sidebar from "@/Components/Sidebar";
import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

interface MenuItem  {
  _id : string;
  category: string;
  itemName: string;
  price: number;
};

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [newcategory, setNewcategory] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/menus");
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // Create a new menu item
  const createMenuItem = async (item: MenuItem) => {
    try {
      const response = await fetch("http://localhost:5000/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error("Failed to create menu item");
      fetchMenuItems(); // Refresh the menu list
    } catch (error) {
      console.error("Error creating menu item:", error);
    }
  };

  // Update an existing menu item
  const updateMenuItem = async (menuitem: MenuItem) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/menus/${menuitem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuitem),
        }
      );
      if (!response.ok) throw new Error("Failed to update menu item");
      fetchMenuItems(); // Refresh the menu list
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  // Delete a menu item
  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/menus/${_id}`,
        { method: "DELETE" }
      );
      console.log("Delete item:",_id)
      if (!response.ok) throw new Error("Failed to delete menu item");
      fetchMenuItems(); // Refresh the menu list
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  // Save the menu item (create or update)
  const handleSave = () => {
    if (!selectedItem) return;

    if (
      !menuItems.some((item) => item.itemName === selectedItem.itemName)
    ) {
      // New item creation
      createMenuItem(selectedItem);
    } else {
      // Update existing item
      updateMenuItem(selectedItem);
    }

    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <><Sidebar/>
    <div className="flex flex-col items-center ml-20 mr-5 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl p-6 ml-52 mr-5 px-20 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-fuchsia-800">
          MENU MANAGEMENT
        </h2>

        {/* Add Item Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setSelectedItem({_id:"", category: "", itemName: "", price: 0 });
              setShowModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by category or item name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={() => {
              const filtered = menuItems.filter(
                (item) =>
                  item.category.toLowerCase().includes(search.toLowerCase()) ||
                  item.itemName.toLowerCase().includes(search.toLowerCase())
              );
              setMenuItems(filtered);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
          <button
            onClick={fetchMenuItems}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Reset Filter
          </button>
        </div>

        {/* Menu Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.itemName} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                <td className="border border-gray-300 px-4 py-2">${item.price}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-teal-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex gap-2 justify-between items-center">
          {newcategory ? <input type="text" value={selectedItem?.category || ""}
  onChange={(e) =>
    setSelectedItem({ ...selectedItem!, category: e.target.value })
  }
  className="w-full px-4 py-2 border mb-4 rounded" />:<select
  value={selectedItem?.category || ""}
  onChange={(e) =>
    setSelectedItem({ ...selectedItem!, category: e.target.value })
  }
  className="w-full px-4 py-2 border mb-4 rounded"
>
  <option value="" disabled>
    Select Category
  </option>
  {menuItems.map((item) => (
    <option key={item.category} value={item.category} className="h-6">
      {item.category}
    </option>
  ))}
</select>}
<button className="flex justify-center  items-center w-3 h-4" onClick={()=>setNewcategory(!newcategory)}>{newcategory?<AiOutlineMinus className="h-2 w-2" /> :<AiOutlinePlus className="h-2 w-2" />}</button> 
</div>
            <input
              type="text"
              placeholder="Item Name"
              value={selectedItem?.itemName || ""}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem!, itemName: e.target.value })
              }
              className="w-full px-4 py-2 border mb-4 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={selectedItem?.price || 0}
              onChange={(e) =>
                setSelectedItem({ ...selectedItem!, price: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border mb-4 rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600 "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div></>
  );
};

export default MenuManagement;
