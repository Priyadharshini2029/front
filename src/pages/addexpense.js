import React, { useState, useEffect } from "react";
import Sidebar from "../pages/Components/Sidebar";

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]); // To hold fetched expense data
  const [categories, setCategories] = useState([
    "Food",
    "Transport",
    "Rent",
    "Utilities",
    "Entertainment",
    "Miscellaneous",
  ]); // Predefined categories
  const [newCategory, setNewCategory] = useState(""); // For adding new category
  const [search, setSearch] = useState(""); // Search term for filtering
  const [showModal, setShowModal] = useState(false); // To handle modal visibility
  const [selectedExpense, setSelectedExpense] = useState({
    _id: "",
    category: "",
    name: "",
    amount: 0,
  }); // To handle selected expense for add or edit

  // Fetch Expenses from Backend
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/expenses/"); // Replace URL if needed
      if (!response.ok) throw new Error("Failed to fetch expenses");

      const data = await response.json();

      if (Array.isArray(data.expenses)) {
        setExpenses(data.expenses); // Store only the array
      } else {
        console.error("Unexpected data format from backend", data);
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]); // Clear expenses on error
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete expense");

      // Update frontend data after deletion
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Save Expense (Add or Update)
  const handleSave = async () => {
    try {
      const url = selectedExpense._id
        ? `http://127.0.0.1:5000/api/expenses/${selectedExpense._id}`
        : "http://127.0.0.1:5000/api/expenses/add"; // Correct POST endpoint
      const method = selectedExpense._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedExpense),
      });

      if (!response.ok) throw new Error("Failed to save expense");

      setShowModal(false); // Close modal
      fetchExpenses(); // Refresh the expenses list
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  // Add New Category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  // Apply Filter Logic
  const applyFilter = () => {
    const filteredExpenses = expenses.filter(
      (expense) =>
        expense.category.toLowerCase().includes(search.toLowerCase()) ||
        expense.name.toLowerCase().includes(search.toLowerCase())
    );
    setExpenses(filteredExpenses);
  };

  // Reset Filter Logic
  const handleResetFilter = async () => {
    setSearch(""); // Clear search input
    await fetchExpenses(); // Reload original data
  };

  // Edit Expense
  const handleEdit = (id) => {
    const expenseToEdit = expenses.find((expense) => expense._id === id);
    if (expenseToEdit) {
      setSelectedExpense(expenseToEdit); // Populate the modal with selected expense details
      setShowModal(true); // Open the modal
    }
  };

  // Fetch Expenses on Component Mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <>
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col items-center ml-20 mr-5 bg-gray-100 min-h-screen">
        <div className="w-full max-w-4xl p-6 ml-52 mr-5 px-20 bg-white shadow-lg rounded-lg mt-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-purple-700">
            Expense Management
          </h1>

          {/* Add Expense Button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                setSelectedExpense({ _id: "", category: "", name: "", amount: 0 });
                setShowModal(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Expense
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by category or name"
              className="border px-4 py-2 rounded w-1/2"
            />
            <button
              onClick={applyFilter}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Apply Filter
            </button>
            <button
              onClick={handleResetFilter}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Reset Filter
            </button>
          </div>

          {/* Expense Table */}
          <div>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center">No expenses found.</p>
            ) : (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="text-center">
                      <td className="border px-4 py-2">{expense.category}</td>
                      <td className="border px-4 py-2">{expense.name}</td>
                      <td className="border px-4 py-2">${expense.amount}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(expense._id)}
                          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal for Add/Edit Expense */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  {selectedExpense._id ? "Edit Expense" : "Add Expense"}
                </h2>
                {/* Category Selection */}
                <div className="mb-4">
                  <label className="block mb-2 font-bold">Category</label>
                  <select
                    value={selectedExpense.category}
                    onChange={(e) =>
                      setSelectedExpense({ ...selectedExpense, category: e.target.value })
                    }
                    className="border px-4 py-2 rounded w-full"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {/* Add New Category */}
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New Category"
                      className="border px-4 py-2 rounded w-full"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="bg-green-500 text-white px-4 py-2 ml-2 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  value={selectedExpense.name}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, name: e.target.value })
                  }
                  className="border px-4 py-2 rounded w-full mb-2"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={selectedExpense.amount}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, amount: parseFloat(e.target.value) })
                  }
                  className="border px-4 py-2 rounded w-full mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpenseManagement;
