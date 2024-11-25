import { createContext, useContext, useState } from "react";

interface OrderItem {
  category: string;
  itemName: string;
  price: number;
  quantity: number;
}

interface Order extends OrderItem {
  totalPrice:number;
  items: OrderItem[]; // An array of items in the order
  orderId?: string; // Optional: Order ID
  orderedAt?: Date; // Optional: Date of order
  status?: string; // Optional: Status of the order
  name: string; // Required: Customer's name
  mobile: number; // Required: Customer's mobile number
}

// Updated OrderContextType to reflect the changes
interface OrderContextType {
  selectedItem: Order | null; // Represents a single order, not just an order item
  setSelectedItem: (item: Order | null) => void;
  orders: Order[]; // List of orders
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>; // Updated to reflect correct type
  addOrder: (order: Order) => void; // Function to add an order
  name: string; // Customer's name
  setName: (name: string) => void; // Setter for customer's name
  mobile: number; // Customer's mobile number
  setMobile: (mobile: number) => void; // Setter for customer's mobile number
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<Order | null>(null); // Order is now the full order, not just an item
  const [orders, setOrders] = useState<Order[]>([]); // List of all orders
  const [name, setName] = useState<string>(""); // Customer's name
  const [mobile, setMobile] = useState<number>(0); // Customer's mobile number

  const addOrder = (order: Order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
  };

  return (
    <OrderContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        orders,
        setOrders,
        addOrder,
        name,
        setName,
        mobile,
        setMobile,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
