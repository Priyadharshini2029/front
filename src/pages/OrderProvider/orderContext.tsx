import React, { createContext, useContext, useState } from "react";

interface OrderItem {
  items: {
    itemName: string;
    category: string;
    price: number;
    quantity: number;
  }[];
  totalprice: number;
  name: string;
  mobilenumber: string;
}

interface OrderContextProps {
  selectedItem: OrderItem["items"][0] | null;
  setSelectedItem: (item: OrderItem["items"][0] | null) => void;
  orders: OrderItem[];
  setOrders: (orders: OrderItem[]) => void;
  addOrder: (order: OrderItem) => void;
  name: string;
  setName: (name: string) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<OrderItem["items"][0] | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const addOrder = async (order: OrderItem) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrders), // Send updated orders
      });

      if (!response.ok) {
        throw new Error("Failed to update orders in the backend");
      }

      const data = await response.json();
      console.log("Orders successfully updated:", data);
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };

  return (
    <OrderContext.Provider value={{selectedItem,setSelectedItem,orders,setOrders,addOrder,name,setName,mobile,setMobile,}}>
      {children}
    </OrderContext.Provider>
  );
};
