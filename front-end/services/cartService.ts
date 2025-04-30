import { ShoppingCart } from "@/types/cartTypes";
import router from "next/router";

export const fetchShoppingCart = async (userId: string, token: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}cart/items/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    if (!res.ok && res.status === 400) {
      localStorage.removeItem("token");
      router.push("/login");
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateCartQuantityInDatabase = async (
  itemId: string,
  productId: string,
  newQuantity: number,
  userId: string,
  token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}cart/update/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: JSON.stringify({ itemId, productId, quantity: newQuantity }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to update quantity in the database");
  }
  return res;
};

export const removeFromDatabaseService = async (
  itemId: string,
  userId: string,
  token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}cart/remove/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
      body: JSON.stringify({ productId: itemId }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to remove item from the database");
  }
  return res;
};

export const checkoutService = async (
  userId: string,
  cart: ShoppingCart,
  token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}cart/checkout/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
      body: JSON.stringify({ cart: cart }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to checkout");
  }
  return res;
};

export const getOrdersByUserId = async (userId: string, token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}cart/orders/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to get orders by user id");
  }

  return res;
};
