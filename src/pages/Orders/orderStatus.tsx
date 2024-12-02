import Sidebar from "@/pages/Components/Sidebar";
import React, { useEffect, useState } from "react";

interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  name: string;
  mobile: string;
  table: string;
  status: string;
  totalprice: number;
  items: OrderItem[];
}

const OrderDetailsCard: React.FC = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("Myhotelrole");
    setRole(storedRole);

    if (storedRole === "Admin") {
      const fetchOrders = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/orders");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data: Order[] = await response.json();

          const filteredOrders = data
            .filter((order: Order) => order.status.toLowerCase() === "delivered")
            .map((order: Order) => {
              const totalPrice = order.items.reduce(
                (sum: number, item: OrderItem) => sum + item.price * item.quantity,
                0
              );
              return { ...order, totalprice: totalPrice };
            });

          setOrderList(filteredOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, []);

  if (role !== "Admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 font-semibold text-lg">Unauthorized Access</p>
      </div>
    );
  }

  const markAsPaid = async (orderIndex: number, orderId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: orderId, status: "Paid" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status. Please try again.");
      }

      setOrderList((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Paid" } : order
        )
      );
      alert("Order marked as Paid!");
    } catch (error) {
      console.error("Error marking order as paid:", error);
      alert("Failed to update order status");
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-6 ml-64">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          DELIVERED ORDER DETAILS
        </h2>
        {orderList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {orderList.map((order, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-md p-6 bg-white"
              >
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
                        Rs. {order.totalprice}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-3">Items</p>
                  <ul className="space-y-3">
                    {order.items.map((item: OrderItem, itemIndex: number) => (
                      <li key={itemIndex} className="flex justify-between items-center text-sm">
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

                {order.status.toLowerCase() === "delivered" && (
                  <div className="mt-4">
                    <button
                      onClick={() => markAsPaid(index, order._id)}
                      className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
                    >
                      Mark as Paid
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No delivered orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderDetailsCard;
