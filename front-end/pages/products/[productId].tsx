import { Product } from "@/types/cartTypes"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { getProductById as fetchProduct } from "../../services/productService";
import Navbar from "@/components/header/navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { jwtDecode } from "jwt-decode";
import { Plus } from "lucide-react";

interface ProductCardProps {
    name: string;
    price: number;
    media: string;
    productId: number;
    onMessage: (text: string) => void;
}

const ProductById = ({ onMessage }: { onMessage: (text: string) => void }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => {
                setStatusMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const router = useRouter();

    const { t } = useTranslation()

    const { productId } = router.query;

    const getProductById = async () => {
        const productResponse = await fetchProduct(
            Number(productId)
        );
        const product = productResponse;
        setProduct(product);
    }

    useEffect(() => {
        if (productId) getProductById();
    }, [productId]);

    const addToCart = async (productId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken: any = jwtDecode(token);
                const userId = decodedToken.userId;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}cart/add/${userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        method: "POST",
                        body: JSON.stringify({ productId, quantity: 1 }),
                    }
                );
                if (!res.ok && res.status === 400) {
                    localStorage.removeItem("token");
                    router.push("/login");
                } else {
                    setStatusMessage(`Added ${name} to cart`);
                }
                return;
            } else {
                router.push("/login");
                throw new Error("Token is null");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            onMessage("Failed to add product to cart");
        }
    };


    return (
        <>
            <Navbar />
            {product ? (
                <div className="container mx-auto p-4">
                    <h1 className="text-4xl font-bold text-center bg-blue-500 text-white p-5 mb-5 rounded-lg shadow-lg">{product.name}</h1>
                    <div className="flex justify-center mb-5">
                        <img src={product.media} alt={product.name} className="max-h-96 max-w-full rounded-lg shadow-lg" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-5 mt-5 text-xl">
                        <p className="pr-5 font-bold text-gray-700">{t('product.price')}: <span className="text-green-500">${product.price}</span></p>
                        <p className="font-bold text-gray-700 pr-5">{t('product.stock')}: <span className="text-red-500">{product.stock}</span></p>
                    <button
                        onClick={(event) => addToCart(Number(productId), event)}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm sm:text-base py-2 px-3 sm:px-4 rounded-md shadow-sm transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center space-x-1 sm:space-x-2 w-auto"
                    >
                        <Plus size={16} className="sm:w-5 sm:h-5" />
                    </button>
                    </div>
                    {statusMessage && <p className="text-center text-xl text-green-500">{statusMessage}</p>}
                    {product.stock < 20 && (
                        <p className="text-center text-xl text-red-500">{t('product.hurry')}</p>
                    )}
                    <div className="flex justify-center mt-5">
                        <p className="font-bold text-xl text-gray-700">{t('product.details')}: <span className="text-gray-600">{product.details}</span></p>
                    </div>
                </div>
            ) : (
                <p className="text-center text-xl text-gray-500">Loading...</p>
            )}
        </>
    )
}

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", [`common`])),
        },
    };
}

export default ProductById;