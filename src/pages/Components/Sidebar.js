import React from "react";

const Sidebar = () => {
  const navigateTo = (path) => {
    window.location.href = path; // Redirect to the specified path
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col p-4 w-60 h-screen bg-teal-800 text-white fixed">
      <h2 className="text-xl font-bold mb-6">Home</h2>
      <nav className="space-y-3">
        <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/addexpense")}
        >
          Add Expense
        </button>
        <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/profile")}
        >
          Profile
        </button>
        <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/Expenses")}
        >
          Expenses History
        </button>
        <button
          className="w-full text-left p-3 bg-red-600 rounded hover:bg-red-500 mt-6"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
