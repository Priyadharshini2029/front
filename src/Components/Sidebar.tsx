import React, { useEffect, useState } from 'react';


const Sidebar: React.FC = () => {
  const[role, setRole] = useState("");
  const navigateTo = (path: string) => {
    window.location.href = path; // Redirect to the specified path
  };

  const handleLogout = () => {
    // Clear any stored tokens or session data
    localStorage.removeItem('authToken');
    localStorage.removeItem('Myhotelrole');
    // Redirect to the login page
    window.location.href = '/';
  };
  useEffect(()=>{
    const role = localStorage.getItem("Myhotelrole")
    if(role){
    setRole(role)
    }
    },[])
  return (
    <div className="flex flex-col p-4 w-60 h-screen bg-teal-800 text-white fixed">
      <h2 className="text-xl font-bold mb-6">Home</h2>
      <nav className="space-y-3">
        {role === "Admin" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/dashboard")}
        >
          Dashboard
        </button>}
        {role === "Admin" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/addmenu")}
        >
          Add Menu
        </button>}
        {role === "Admin" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/Orders/orderStatus")}
        >
          Order Status
        </button>}
        {role === "Admin" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/profile")}
        >
          Profile
        </button>}
        {role === "Admin" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/Orders/orderManagement")}
        >
          Order History
        </button>}
        {role === "Chef" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/Orders/orderModal")}
        >
          Orders
        </button>}
        {role === "Waiter" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/Orders/orderDelivery")}
        >
          Ordered Items
        </button>}
        {role === "Admin" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/employee")}
        >
         Employee
        </button>}
        {role === "Customer" && <button
          className="w-full text-left p-3 bg-teal-800 rounded hover:bg-teal-600"
          onClick={() => navigateTo("/profile")}
        >
          Profile
        </button>}
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
