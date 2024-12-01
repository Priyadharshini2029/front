import React, { createContext, useContext, useState, useEffect } from "react";

interface OrderItem {
  itemName: string;
  category: string;
  price: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  _id: string;
  totalPrice: number;
  name: string;
  mobile: string;
  table: number;
  status: string;
  orderedAt: Date;
}

interface OrderContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  selectedItem: Order | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Order | null>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  mobile: string;
  setMobile: React.Dispatch<React.SetStateAction<string>>;
  table: number;
  setTable: React.Dispatch<React.SetStateAction<number>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [table, setTable] = useState<number>(0);
  const [status, setStatus] = useState<string>("");

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
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        selectedItem,
        setSelectedItem,
        name,
        setName,
        mobile,
        setMobile,
        table,
        setTable,
        status,
        setStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};

