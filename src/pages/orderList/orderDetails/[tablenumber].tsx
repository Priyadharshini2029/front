import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useOrderContext } from "../../../OrderProvider/orderContext";

const OrderDetails: React.FC = () => {
  const router = useRouter();
  const {
    orders,
    setOrders,
    name,
    setName,
    mobile,
    setMobile,
    table,
    setTable,
  } = useOrderContext();

  useEffect(() => {
    const path = window.location.pathname;
    const tableMatch = path.match(/table-(\d+)/);
    if (tableMatch && tableMatch[1]) {
      const tableNumber = parseInt(tableMatch[1], 10);
      if (!isNaN(tableNumber)) {
        setTable(tableNumber);
        console.log("Table number set to:", tableNumber);
      } else {
        console.warn("Invalid table number in URL");
      }
    } else {
      console.warn("No table number found in URL");
    }
  }, [setTable]);

  const calculateTotalPrice = (): number => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  const handleQuantityChange = (
    orderIndex: number,
    itemIndex: number,
    change: number
  ): void => {
    const updatedOrders = [...orders];
    const selectedItem = updatedOrders[orderIndex].items[itemIndex];
    const updatedQuantity = selectedItem.quantity + change;

    if (updatedQuantity > 0) {
      selectedItem.quantity = updatedQuantity;
      updatedOrders[orderIndex].totalPrice = updatedOrders[orderIndex].items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      setOrders(updatedOrders);
    }
  };

  const handleBackToMenu = (): void => {
    router.push(`/orderList/table-${table}`);
  };

  const handleConfirmOrder = async (): Promise<void> => {
    if (!name || !mobile) {
      alert("Please enter your name and mobile number before confirming the order.");
      return;
    }

    const orderPayload = {
      items: orders.flatMap((order) => order.items),
      name,
      mobile,
      table,
      totalPrice: calculateTotalPrice(),
      status: "",
      orderedAt: new Date(),
    };

    try {
      const response = await fetch("https://mongodbfood.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error Details:", errorDetails);
        throw new Error("Failed to place the order");
      }

      alert("Order confirmed successfully!");
      router.push(`/orderList/table-${table}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error confirming order:", error.message);
        alert("There was an issue confirming your order. Please try again.");
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Order Details for Table {table}
      </h2>

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
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
            className="border border-gray-300 rounded-md p-2 w-60 text-center"
          />
        </div>
      </div>

      <div className="border border-gray-300 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {orders.length > 0 ? (
          <div>
            <ul className="list-disc list-inside space-y-4">
              {orders.map((order, orderIndex) =>
                order.items.map((item, itemIndex) => (
                  <li
                    key={`${orderIndex}-${itemIndex}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <span>{item.itemName}</span>
                      <br />
                      <span className="text-sm text-gray-500">
                        Category: {item.category}
                      </span>
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
