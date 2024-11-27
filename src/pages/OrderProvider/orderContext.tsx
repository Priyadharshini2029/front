import React, { createContext, useContext, useState } from "react";

interface OrderItem {
  itemName: string;
  category: string;
  price: number;
  quantity: number;
}

interface Order {
  items: OrderItem[];
  _id?: string;
  totalPrice?: number;
  name: string;
  mobile: number;
  table: number;
  status:string;
}

interface OrderContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  selectedItem: Order | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Order | null>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  mobile: number;
  setMobile: React.Dispatch<React.SetStateAction<number>>;
  table: number;
  setTable: React.Dispatch<React.SetStateAction<number>>;
  status:string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<number>(0);
  const [table, setTable] = useState<number>(1);
  const[status]=useState("");

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
