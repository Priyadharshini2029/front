import React, { useEffect, useState } from "react";
import { useOrderContext } from "../OrderProvider/orderContext";
import { useRouter } from "next/router";

interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  price: number;
}

const OrderList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { setSelectedItem, orders, setOrders, name, mobile, table, setTable } = useOrderContext();
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/menus");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const tableMatch = path.match(/table-(\d+)/);
    if (tableMatch && tableMatch[1]) {
      const tableNumber = parseInt(tableMatch[1], 10);
      if (!isNaN(tableNumber)) {
        setTable(tableNumber);
        console.log('Table number set to:', tableNumber);
      } else {
        console.warn("Invalid table number in URL");
      }
    } else {
      console.warn("No table number found in URL");
    }
  }, [setTable]);

  const handleOrderClick = (item: MenuItem) => {
    setCurrentOrder(item);
    setQuantity(1);
    setTotalPrice(item.price);
    setShowModal(true);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      if (currentOrder) {
        setTotalPrice(currentOrder.price * newQuantity);
      }
    }
  };

  const handlePlaceOrder = () => {
    if (!currentOrder) return;

    const selectedItemWithQuantity = {
      ...currentOrder,
      quantity,
      totalPrice,
      items: [
        {
          category: currentOrder.category,
          itemName: currentOrder.itemName,
          price: currentOrder.price,
          quantity: quantity,
        },
      ],
      name,
      mobile,
      table: table,
      orderId: "",
      status: "Ordered",
      _id: "",
      orderedAt: new Date(),
    };

    setSelectedItem(selectedItemWithQuantity);
    setOrders((prevOrders) => [...prevOrders, selectedItemWithQuantity]);

    router.push(`/orderList/orderDetails/table-${table}`);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center  w-full justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-semibold text-purple-800 text-center mb-6">
          ORDERS for Table {table}
        </h2>
        <div className="overflow-x-auto w-9/12">
          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-teal-500 text-white text-sm uppercase">
              <tr>
                <th className="border border-gray-300 p-4 text-left">Item Name</th>
                <th className="border border-gray-300 p-4 text-left">Category</th>
                <th className="border border-gray-300 p-4 text-left">Price</th>
                <th className="border border-gray-300 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-200">
                  <td className="p-4">{item.itemName}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">Rs. {item.price}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleOrderClick(item)}
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && currentOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Place Order</h2>
                <p><strong>Item:</strong> {currentOrder.itemName}</p>
                <p><strong>Category:</strong> {currentOrder.category}</p>
                <p><strong>Price per Item:</strong> Rs. {currentOrder.price}</p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;

