import React from "react";
import { useOrderContext } from "../OrderProvider/orderContext";
import { useRouter } from "next/router";

// Unified and consistent Order type
interface OrderItem {
  itemName: string;
  category: string;
  price: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  totalprice?: number;
  name: string;
  mobilenumber: string; // Always use string for phone numbers
}

const OrderDetails: React.FC = () => {
  const {
    orders = [],
    setOrders,
    name = "",
    setName,
    mobile = "",
    setMobile,
  } = useOrderContext();
  const router = useRouter();

  // Calculate total price
  const calculateTotalPrice = (): number => {
    return orders.reduce<number>((total, order) => {
      const orderTotal = order.items.reduce<number>(
        (subTotal, item) => subTotal + item.price * item.quantity,
        0
      );
      return total + orderTotal;
    }, 0);
  };

  // Handle quantity change
  const handleQuantityChange = (orderIndex: number, itemIndex: number, change: number): void => {
    const updatedOrders = [...orders];
    const selectedItem = updatedOrders[orderIndex].items[itemIndex];
    const updatedQuantity = selectedItem.quantity + change;

    if (updatedQuantity > 0) {
      selectedItem.quantity = updatedQuantity;
      setOrders(updatedOrders);
    }
  };

  // Navigate back to the menu
  const handleBackToMenu = (): void => {
    router.push("/Orders/orderList");
  };

  // Confirm the order
  const handleConfirmOrder = async (): Promise<void> => {
    if (!name || !mobile) {
      alert("Please enter your name and mobile number before confirming the order.");
      return;
    }

    const orderPayload = {
      items: orders.flatMap((order) => order.items),
      name,
      mobilenumber: mobile,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error("Failed to place the order");
      alert("Order confirmed successfully!");
      router.push("/Orders/orderList");
    } catch (error) {
      console.error("Error:", error);
      alert("There was an issue confirming your order. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>

      {/* Input fields */}
      <div className="flex justify-center mb-6 space-x-4">
        <div>
          <label htmlFor="name" className="block font-medium text-lg mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-300 rounded-md p-2 w-60 text-center"
          />
        </div>
        <div>
          <label htmlFor="mobile" className="block font-medium text-lg mb-2">
            Mobile Number:
          </label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(Number(e.target.value))}
            placeholder="Enter your mobile number"
            className="border border-gray-300 rounded-md p-2 w-60 text-center"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {orders.length > 0 ? (
          <div>
            <ul className="list-disc list-inside space-y-4">
              {orders.map((order, orderIndex) =>
                order.items.map((item, itemIndex) => (
                  <li key={`${orderIndex}-${itemIndex}`} className="flex justify-between items-center">
                    <div>
                      <span>{item.itemName}</span>
                      <br />
                      <span className="text-sm text-gray-500">Category: {item.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(orderIndex, itemIndex, -1)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(orderIndex, itemIndex, 1)}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                    <span>Rs. {item.price * item.quantity}</span>
                  </li>
                ))
              )}
            </ul>
            <p className="mt-4 text-lg font-semibold">
              Total Price: <span className="text-teal-500">Rs. {calculateTotalPrice()}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No items have been ordered yet.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handleBackToMenu}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
        >
          Back to Menu
        </button>
        <button
          onClick={handleConfirmOrder}
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
