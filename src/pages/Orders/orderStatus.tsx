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

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Calculate total price for each order
        const updatedOrders = data.map((order: any) => {
          const totalPrice = order.items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          );
          return { ...order, totalprice: totalPrice };
        });

        setOrderList(updatedOrders); // Set the fetched and calculated orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
        ORDER DETAILS
      </h2>
      {orderList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span
                      className={`capitalize font-semibold ${
                        order.status === "ready"
                          ? "text-green-600"
                          : "text-teal-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Total Price:</strong>{" "}
                    <span className="text-lg font-semibold text-teal-700">
                      Rs. {order.totalprice}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="font-medium text-gray-800 mb-3">Items:</p>
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
        <p className="text-gray-500 text-center">No orders found.</p>
      )}
    </div>
  );
};

export default OrderDetailsCard;
