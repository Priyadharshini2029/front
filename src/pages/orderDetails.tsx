import React from "react";
import { useOrderContext } from "./OrderProvider/orderContext"; // Import useOrderContext
import { useRouter } from "next/router";

const OrderDetails: React.FC = () => {
  const { orders, setOrders, name, setName, mobile, setMobile } = useOrderContext(); // Access context
  const router = useRouter();

  const calculateTotalPrice = () => {
    return orders.reduce((total, order) => {
      return total + order.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
    }, 0);
  };

  const handleQuantityChange = (orderIndex: number, itemIndex: number, change: number) => {
    const updatedOrders = [...orders];
    const selectedItem = updatedOrders[orderIndex].items[itemIndex];

    const updatedQuantity = selectedItem.quantity + change;

    if (updatedQuantity > 0) {
      selectedItem.quantity = updatedQuantity;
      setOrders(updatedOrders); // Update the context
    }
  };

  const handleBackToMenu = () => {
    router.push("/orderList"); // Navigate back to the menu
  };

  const handleConfirmOrder = () => {
    alert("Order confirmed successfully!");
    router.push("/orderList"); // Redirect to the home page or confirmation page
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>

 {/* Name and Mobile input fields */}
 <div className="flex justify-center mb-6 space-x-4">
        <div>
          <label htmlFor="name" className="block font-medium text-lg mb-2">Name:</label>
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
          <label htmlFor="mobile" className="block font-medium text-lg mb-2">Mobile Number:</label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
            className="border border-gray-300 rounded-md p-2 w-60 text-center"
          />
        </div>
      </div>
      {/* Order Summary */}
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <p className="mb-2">
          <strong>Name:</strong> {name}
        </p>
        <p className="mb-2">
          <strong>Mobile:</strong> {mobile}
        </p>

        {orders.length > 0 ? (
          <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Ordered Items:</h4>
            <ul className="list-disc list-inside space-y-4">
              {orders.map((order, orderIndex) =>
                order.items.map((item, itemIndex) => (
                  <li key={`${orderIndex}-${itemIndex}`} className="flex justify-between items-center">
                    <div>
                      <span>{item.itemName}</span> <br />
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
