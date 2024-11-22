import React, { useState, useEffect } from "react";
import Sidebar from "@/Components/Sidebar";

// Explicitly define Employee interface
interface Employee {
  _id: string;
  name: string;
  age: number;
  email: string;
  mobilenumber: string;
  approved: boolean;
  rolehotel: "Admin" | "Chef" | "Waiter" | "Customer"; // This is the string literal type
}

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch employees
  useEffect(() => {
    fetch("http://localhost:5000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  // Save changes (update employee approved status and role)
  const saveChanges = async (_id: string, approved: boolean, rolehotel: "Admin" | "Chef" | "Waiter" | "Customer") => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved, rolehotel }),
      });
      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp._id === _id ? { ...emp, approved, rolehotel } : emp
          )
        );
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Delete employee
  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Remove the employee from the state to update the UI
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee._id !== id)
        );
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col items-center ml-56 w-full justify-center min-h-screen bg-gray-100">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6">EMPLOYEE</h2>
        <div className="overflow-x-auto w-11/12">
          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-teal-500 text-white text-sm uppercase">
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Age</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee._id} className="text-center border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{employee.name}</td>
                  <td className="px-4 py-3">{employee.age}</td>
                  <td className="px-4 py-3">{employee.email}</td>
                  <td className="px-4 py-3">{employee.mobilenumber}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        saveChanges(employee._id, !employee.approved, employee.rolehotel)
                      }
                      className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
                        employee.approved ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {employee.approved ? "Approved" : "Not Approved"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={employee.rolehotel}
                      onChange={(e) => saveChanges(employee._id, employee.approved, e.target.value as "Admin" | "Chef" | "Waiter" | "Customer")}
                      className="block w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Chef">Chef</option>
                      <option value="Waiter">Waiter</option>
                      <option value="Customer">Customer</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteEmployee(employee._id)}
                      className="px-4 py-2 text-white bg-black hover:bg-slate-500 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
