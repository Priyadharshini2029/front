import React, { useEffect, useState } from "react";
import { useOrderContext } from "../OrderProvider/orderContext"; // Import your context
import Sidebar from "@/Components/Sidebar";

const OrderDelivery: React.FC = () => {
  const { orders, setOrders } = useOrderContext();
  const [orderList, setOrderList] = useState(orders); // Local state to manage orders
  const [role, setRole] = useState<string | null>("");

  // Fetch orders and filter only "Ready" orders
  useEffect(() => {
    // Check if the user is a waiter
    const storedRole = localStorage.getItem("Myhotelrole");
    setRole(storedRole);

    if (storedRole === "Waiter") {
      const fetchOrders = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/orders");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await response.json();

          // Filter only "Ready" orders and calculate totalPrice
          const updatedOrders = data
            .filter((order: any) => order.status === "Ready")
            .map((order: any) => {
              const totalPrice = order.items.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0
              );
              return { ...order, totalPrice };
            });

          setOrders(updatedOrders); // Update global context
          setOrderList(updatedOrders); // Update local state
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [setOrders]);

  // Mark an order as "Delivered" and remove it from the list
  const handleDeliverOrder = async (orderIndex: number, orderId: string) => {
    const updatedOrders = [...orderList];
    updatedOrders[orderIndex].status = "Delivered";

    try {
      await fetch(`http://localhost:5000/api/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: orderId, status: "Delivered" }),
      });

      // Remove the delivered order from the list
      const filteredOrders = updatedOrders.filter(
        (_order, index) => index !== orderIndex
      );

      setOrders(filteredOrders); // Update global context
      setOrderList(filteredOrders); // Update local state
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // If the user is not a waiter, block access
  if (role !== "Waiter") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-semibold text-lg">
          Unauthorized Access
        </p>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="p-6 ml-64">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          ORDER DELIVERY DETAILS
        </h2>
        {orderList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {orderList.map((order, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-md p-6 bg-white"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <p className="font-bold text-lg">{order.name}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Mobile:</strong> {order.mobile}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Table:</strong> {order.table}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      <strong>Status:</strong>{" "}
                      <span className="capitalize font-semibold text-green-600">
                        {order.status}
                      </span>
                    </p>
                    <p className="text-lg text-gray-800">
                      <strong>Total Price:</strong>{" "}
                      <span className="text-lg font-semibold text-teal-500">
                        Rs. {order.totalPrice}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <p className="font-medium text-gray-800 mb-3">Items</p>
                  <ul className="space-y-3">
                    {order.items.map((item: any, itemIndex: number) => (
                      <li
                        key={itemIndex}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <p className="text-gray-500 text-xs">
                            {item.quantity} x Rs. {item.price}
                          </p>
                        </div>
                        <p className="font-semibold">
                          Rs. {item.quantity * item.price}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliver Order Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleDeliverOrder(index, order?._id)}
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-400 transition"
                  >
                    Deliver Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderDelivery;
