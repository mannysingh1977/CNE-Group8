import { useEffect, useState } from "react";
import { getOrdersByUserId } from "@/services/cartService";
import { jwtDecode } from "jwt-decode";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "next-i18next";

const Orders: React.FC = () => {
  interface DecodedToken {
    userId: string;
  }
  interface Product {
    id: string;
    name: string;
    description: string;
    media: string;
    stock: number;
    price: number;
    details: string;
  }
  interface Item {
    id: string;
    quantity: number;
    productId: number;
    product: Product;
  }
  interface Order {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    items: Item[];
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  const { t } = useTranslation()

  const toggleCollapse = (orderId: string) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = String(decodedToken.userId);
        const response = await getOrdersByUserId(userId, token);
        if (!response.ok) {
          console.log("Failed to fetch orders");
          return;
        }
        const data = await response.json();
        setOrders(data);

        const initialCollapsedState = data.reduce(
          (acc: { [key: string]: boolean }, order: Order) => {
            acc[order.id] = true;
            return acc;
          },
          {}
        );
        setCollapsed(initialCollapsedState);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            onClick={() => toggleCollapse(order.id)}
            className="cursor-pointer bg-white rounded shadow-md p-4 my-4"
          >
            <div className="flex justify-between">
              <div>
                <h3>{t('order.number')}: {order.id}</h3>
                <p>{t('order.boughtat')}: {new Date(order.createdAt).toLocaleString()}</p>
                <h4>{t('order.items')}:</h4>
              </div>
              <div>
                {collapsed[order.id] ? (
                  <ChevronDown size={24} />
                ) : (
                  <ChevronUp size={24} />
                )}
              </div>
            </div>
            {!collapsed[order.id] && (
              <ul>
                {order.items.map((item) => {
                  console.log(item);
                  return (
                    <li key={item.id} className="flex flex-row items-center">
                      <img
                        src={item.product.media}
                        alt={item.product.name}
                        width="100"
                      />
                      <div className="flex flex-col ml-4 w-full h-full">
                        <p>{t('order.productname')}: {item.product.name}</p>
                        <p>{t('order.quantity')}: {item.quantity}</p>
                        <p>{t('order.price')}: ${item.product.price}</p>
                      </div>
                      <div className="flex flex-col ml-4 w-full h-full justify-start">
                        <p className="w-full min-h-full">
                        {t('order.description')}: {item.product.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
