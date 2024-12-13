import Sidebar from '@/pages/Components/Sidebar';
import React from 'react';

const Dashboard = () => {
  return (
    <>
      <Sidebar />
      <div className="p-10">
        <h1 className="text-3xl font-bold text-center text-purple-600">
          Welcome to the Personal Expense Tracker!
        </h1>
        <p className="text-center text-lg text-gray-600 mt-4">
          Track and manage your expenses effortlessly.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
