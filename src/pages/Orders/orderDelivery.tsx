import React, { useEffect, useState } from "react";
import { useOrderContext } from "../../OrderProvider/orderContext";
import Sidebar from "@/pages/Components/Sidebar";

interface OrderItem {
  itemName: string;
  price: number;
  quantity: number;
  category: string;
}

interface Order {
  _id: string;
  name: string;
  mobile: string;
  table: number;
  status: string;
  items: OrderItem[];
  totalPrice: number;
  orderedAt: string; // Changed from Date to string
}

const OrderDelivery: React.FC = () => {
  const {setOrders } = useOrderContext();
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("Myhotelrole");
    setRole(storedRole);

    if (storedRole === "Waiter") {
      const fetchOrders = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/orders");
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data: Order[] = await response.json();

          const updatedOrders = data
            .filter((order) => order.status === "Ready")
            .map((order) => ({
              ...order,
              totalPrice: order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
              orderedAt: new Date(order.orderedAt).toISOString() // Ensure orderedAt is always a string
            }));

          
          setOrderList(updatedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [setOrders]);

  const handleDeliverOrder = async (orderIndex: number, orderId: string) => {
    const updatedOrders = [...orderList];
    updatedOrders[orderIndex].status = "Delivered";

    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: orderId, status: "Delivered" }),
      });

      const filteredOrders = updatedOrders.filter(
        (_order, index) => index !== orderIndex
      );

      
      setOrderList(filteredOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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
                key={order._id}
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
                        Rs. {order.totalPrice}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-800 mb-3">Items</p>
                  <ul className="space-y-3">
                    {order.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <p className="text-gray-500 text-xs">
                            {item.quantity} x Rs. {item.price} - {item.category}
                          </p>
                        </div>
                        <p className="font-semibold">
                          Rs. {item.quantity * item.price}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleDeliverOrder(index, order._id)}
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

