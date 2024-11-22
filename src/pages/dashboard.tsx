import Sidebar from '@/Components/Sidebar';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <><Sidebar/>
    <div className="p-10">
        
      <h1 className="text-3xl font-bold text-center justify-center text-purple-600">
        Welcome to the Food Order App!
      </h1>
    </div></>
  );
};

export default Dashboard;
