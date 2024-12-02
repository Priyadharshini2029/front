import React, { useEffect, useState } from "react";
import Sidebar from "@/Components/Sidebar";
import { useOrderContext } from "../../OrderProvider/orderContext";

// Interface for Order Items
interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

// Interface for Orders
interface Order {
  _id: string;
  name: string;
  mobile: string;
  table: string | number; // Changed to allow string or number for table
  status: string;
  totalPrice: number;
  orderedAt: string | Date; // Changed to allow string or Date for orderedAt
  items: OrderItem[];
}

const OrderManagement: React.FC = () => {
  const {
    orders,
    setOrders,
    table,
    setTable,
    status,
    setStatus,
  } = useOrderContext(); // Accessing context values

  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders); // State for filtered orders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // State for selected order in the modal
  const [selectedDate, setSelectedDate] = useState<string>(""); // State for the selected date filter

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data); // Populate orders in context
          setFilteredOrders(data); // Initialize filtered orders
        } else {
          console.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [setOrders]);

  // Apply filters
  const applyFilters = () => {
    let filtered = orders;

    if (table) {
      filtered = filtered.filter((order) => order.table === table);
    }
    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }

    // Apply date filter
    if (selectedDate) {
      const selected = new Date(selectedDate);
      filtered = filtered.filter((order) => {
        const orderedDate = new Date(order.orderedAt);
        return (
          orderedDate.getDate() === selected.getDate() &&
          orderedDate.getMonth() === selected.getMonth() &&
          orderedDate.getFullYear() === selected.getFullYear()
        );
      });
    }

    setFilteredOrders(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setTable(0); // Set table to 0 for reset
    setStatus(""); // Reset status
    setSelectedDate(""); // Reset selected date filter
    setFilteredOrders(orders); // Reset the filtered orders
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full ml-56 bg-gray-100 p-8">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">ORDER HISTORY</h2>

        {/* Filter Section */}
        <div className="flex items-center mb-4 gap-4">
          <input
            type="number"
            value={table || ""}
            onChange={(e) => setTable(Number(e.target.value))}
            className="border border-gray-300 px-3 py-2 rounded-lg"
            placeholder="Filter by Table"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          >
            <option value="">Filter by Status</option>
            <option value="Paid">Paid</option>
            <option value="Ready">Ready</option>
            <option value="ordered">Ordered</option>
            <option value="Delivered">Delivered</option>
          </select>

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

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-4 border-black bg-white ">
            <thead className="bg-teal-500 border-2 border-black text-white">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Table</th>
                <th className="px-4 py-2">Ordered At</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="text-center border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.table}</td> {/* Correct handling of table */}
                  <td className="px-4 py-3">
                    {/* Handle `orderedAt` field as either string or Date */}
                    {typeof order.orderedAt === "string"
                      ? new Date(order.orderedAt).toLocaleString()
                      : new Date(order.orderedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        order.status === "Paid" ? "bg-green-500" : "bg-purple-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">${order.totalPrice}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
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

        {/* Modal for Order Details */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 shadow-lg w-1/3">
              <h3 className="text-2xl font-bold mb-4">Order Details</h3>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Table:</strong> {selectedOrder.table}
              </p>
              <p>
                <strong>Ordered At:</strong>{" "}
                {typeof selectedOrder.orderedAt === "string"
                  ? new Date(selectedOrder.orderedAt).toLocaleString()
                  : new Date(selectedOrder.orderedAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Total Price:</strong> ${selectedOrder.totalPrice}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
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

export default OrderManagement;
