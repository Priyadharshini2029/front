import Sidebar from "@/Components/Sidebar";
import React, { useEffect, useState } from "react";

interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface Order {
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

  // Fetch orders from the API
  useEffect(() => {
    // Fetch the role from localStorage
    const storedRole = localStorage.getItem("Myhotelrole");
    setRole(storedRole);

    if (storedRole === "Admin") {
      const fetchOrders = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/orders");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await response.json();

          // Filter orders with status "delivered" and calculate total price
          const filteredOrders = data
            .filter((order: any) => order.status.toLowerCase() === "delivered")
            .map((order: any) => {
              const totalPrice = order.items.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0
              );
              return { ...order, totalprice: totalPrice };
            });

          setOrderList(filteredOrders); // Set the fetched and filtered orders
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, []);

  // If the user is not authorized, display a message
  if (role !== "Admin") {
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
          DELIVERED ORDER DETAILS
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
                        Rs. {order.totalprice}
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
