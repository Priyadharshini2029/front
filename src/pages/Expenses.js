import React, { useEffect, useState } from "react";
import Sidebar from "@/pages/Components/Sidebar";

const Expense = () => {
  const [expenses, setExpenses] = useState([]); // State for all expenses
  const [filteredExpenses, setFilteredExpenses] = useState([]); // State for filtered expenses
  const [selectedDate, setSelectedDate] = useState(""); // State for the selected date filter
  const [selectedExpense, setSelectedExpense] = useState(null); // State for selected expense details

  // Fetch expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/expenses/");
        if (response.ok) {
          const data = await response.json();
          setExpenses(data.expenses); // Populate expenses in context
          setFilteredExpenses(data.expenses); // Initialize filtered expenses
        } else {
          console.error("Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filtered = expenses;

    // Apply date filter
    if (selectedDate) {
      const selected = new Date(selectedDate);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getDate() === selected.getDate() &&
          expenseDate.getMonth() === selected.getMonth() &&
          expenseDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    setFilteredExpenses(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedDate(""); // Reset selected date filter
    setFilteredExpenses(expenses); // Reset the filtered expenses
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full ml-56 bg-gray-100 p-8">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">EXPENSE HISTORY</h2>

        {/* Filter Section */}
        <div className="flex items-center mb-4 gap-4">
          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
            placeholder="Select Date"
          />

          <button
            onClick={applyFilters}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-4 border-black bg-white">
            <thead className="bg-teal-500 border-2 border-black text-white">
              <tr>
                <th className="px-4 py-2">Expense ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="text-center border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{expense._id}</td>
                  <td className="px-4 py-3">{expense.name}</td>
                  <td className="px-4 py-3">{expense.category}</td>
                  <td className="px-4 py-3">${expense.amount}</td>
                  <td className="px-4 py-3">{new Date(expense.date).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Expense Details */}
        {selectedExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg w-1/3">
              <h3 className="text-2xl font-bold mb-4">Expense Details</h3>
              <p>
                <strong>Expense ID:</strong> {selectedExpense._id}
              </p>
              <p>
                <strong>Name:</strong> {selectedExpense.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedExpense.category}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedExpense.amount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedExpense.date).toLocaleString()}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;
