import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import { useRouter } from "next/router";
import {
  checkoutService,
  fetchShoppingCart,
  removeFromDatabaseService,
  updateCartQuantityInDatabase,
} from "@/services/cartService";
import type { ShoppingCart, CartItem } from "@/types/cartTypes";
import { useTranslation } from "next-i18next";

function useShoppingCart(userId: string) {
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadShoppinCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const data = await fetchShoppingCart(userId, token);
        if (!data.items || data.items.length === 0) {
          setCart({
            id: data.id,
            items: [],
            total: 0,
          });
          setLoading(false);
          return;
        }

        const total = data.items.reduce((sum: number, item: any) => {
          const price = Number(item.product.price);
          return sum + price * item.quantity;
        }, 0);
        const cart: ShoppingCart = {
          id: data.id,
          items: data.items
            .map((item: any) => {
              if (!item.product) {
                console.error(
                  `Product data is missing for item with id: ${item.id}`
                );
                return null;
              }
              return {
                id: item.id,
                quantity: item.quantity || 1,
                productId: item.product.id,
                product: {
                  stock: item.product.stock,
                  media: item.product.media,
                  name: item.product.name,
                  price: item.product.price,
                },
              };
            })
            .filter((item: any) => item !== null),
          total: total,
        };
        setCart(cart);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch cart data: " + error);
        setLoading(false);
      }
    };

    loadShoppinCart();
  }, [userId]);

  const updateQuantityInDatabase = async (
    itemId: string,
    productId: string,
    newQuantity: number
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await updateCartQuantityInDatabase(
          itemId,
          productId,
          newQuantity,
          userId,
          token
        );
      } else {
        throw new Error("Token is null");
      }
    } catch (error) {
      console.error("Error updating product quantity in cart:", error);
    }
  };
  const updateQuantity = async (newQuantity: number, item: CartItem) => {
    if (cart) {
      const updatedItems = cart.items.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setCart({
        ...cart,
        items: updatedItems,
        total: Number(newTotal.toFixed(2)),
      });
      const product = cart.items.find(
        (cartItem) => cartItem.id === item.id
      )?.product;
      if (product) {
        if (item.id) {
          await updateQuantityInDatabase(item.id, item.productId, newQuantity);
        } else {
          console.error("Item ID is undefined");
        }
      }
    }
  };

  const removeFromDatabase = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        removeFromDatabaseService(itemId, userId, token);
        return;
      } else {
        throw new Error("Token is null");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const removeItem = (itemId: string) => {
    if (cart) {
      const updatedItems = cart.items.filter((item) => item.id !== itemId);
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      removeFromDatabase(String(itemId));
      setCart({
        ...cart,
        items: updatedItems,
        total: Number(newTotal.toFixed(2)),
      });
    }
  };
  return { cart, loading, error, updateQuantity, removeItem };
}

interface ShoppingCartProps {
  userId: string;
}

export default function ShoppingCart({ userId }: ShoppingCartProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const { cart, loading, error, updateQuantity, removeItem } =
    useShoppingCart(userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!cart) {
    return <div>{t("nocart")}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {t("cart.title")}
          </h2>
        </div>
        {cart.items.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">{t("cart.cartempty")}</p>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4 border-b last:border-b-0"
              >
                <Image
                  src={item.product.media}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(parseInt(e.target.value), item)
                    }
                    className="w-16 px-2 py-1 text-center border rounded"
                  />
                  <button
                    onClick={() => item.id && removeItem(item.id)}
                    className="p-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 sm:px-6 py-4 bg-gray-100 border-t flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="text-lg font-semibold">
            {t("cart.total")}
            {cart.total.toFixed(2)}
          </div>
          <button
            onClick={() =>
              router.push({
                pathname: "/checkout",
                query: { userId: userId, cart: JSON.stringify(cart) },
              })
            }
            className="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {t("cart.checkout")}
          </button>
        </div>
      </div>
    </div>
  );
}
