import { addProductType, Product } from "@/types/cartTypes";
import { jwtDecode } from "jwt-decode";

export const getProductById = async (productId: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}products/${productId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch product");
    }
    console.log('product', res)
    return res.json();
};

export const postProduct = async (product: addProductType) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token is null");
    }
    const decodedToken = jwtDecode<{ userId: number }>(token);

    product.userId = decodedToken.userId;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify(product),
    });
    if (!res.ok) {
        throw new Error("Failed to add product");
    }
    return res;
}

export const getProductCatalog = async (userId: number) => {
    console.log('userId', userId)
    const token = localStorage.getItem("token");
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}products/catalog/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch product catalog");
    }
    return res;
};