import { Product } from "@/types/cartTypes"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { getProductById as fetchProduct } from "../../services/productService";
import Navbar from "@/components/header/navbar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { jwtDecode } from "jwt-decode";
import { Plus, Star, Trash } from "lucide-react";
import { Address, Review, Role } from "@/types/types";
import { deleteReviewById, getReviewsForProduct } from "@/services/reviewService";

interface ProductCardProps {
    name: string;
    price: number;
    media: string;
    productId: string;
    onMessage: (text: string) => void;
}

interface ProfileProps {
    userId?: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
    address: Address;
    seller: boolean;
    newsLetter: boolean;
    role: Role;
}

const ProductById = ({ onMessage }: { onMessage: (text: string) => void }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Array<Review> | []>([])
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
    const [reviewText, setReviewText] = useState<string>('');
    const [stars, setStars] = useState<number>(0);
    const [role, setRole] = useState<Role>();

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
            String(productId)
        );
        const product = productResponse;
        setProduct(product);
    }

    const getReviewsByProductId = async (productId: string) => {
        const reviewResponse = await getReviewsForProduct(String(productId));
        const reviews = await reviewResponse.json();
        setReviews(reviews);
    }

    useEffect(() => {
        if (productId) {
            getProductById();
            getReviewsByProductId(String(productId));
        }
    }, [productId]);

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const decoded = jwtDecode<ProfileProps>(token);
            if (decoded) {
                setRole(decoded.role);
            }
        }
    })

    const addToCart = async (productId: string, event: React.MouseEvent) => {
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

    const handleAddReview = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken.userId;
            setShowReviewForm(false)

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}review/addReview`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId,
                        productId,
                        reviewText,
                        stars,
                    }),
                });

                if (response.ok) {
                    setStatusMessage("Review added successfully");
                    setShowReviewForm(false);
                    setReviewText("");
                    setStars(0);
                    await getReviewsByProductId(String(productId));
                } else {
                    setStatusMessage("Failed to add review");
                }
            } catch (error) {
                console.error("Error adding review:", error);
                setStatusMessage("An error occurred while adding the review");
            }
        } else {
            router.push("/login");
            setStatusMessage("You need to be logged in to add a review");
        }
    }

    const handleDeleteReview = async (id: string, productId: string) => {
        await deleteReviewById(id, productId);
        setStatusMessage("Review deleted succesfully");
        await getReviewsByProductId(productId);
    }


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
                            onClick={(event) => addToCart(String(productId), event)}
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
                    <div className="flex flex-row items-center justify-between mt-8 mb-4">
                        <h5 className="text-2xl font-bold">{t('product.reviews')}</h5>
                        <button
                            className="bg-blue-500 text-white h-8 px-2 rounded-lg flex items-center justify-center"
                            onClick={() => setShowReviewForm(true)}
                        >
                            Add review
                        </button>
                        {showReviewForm && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                    <h2 className="text-xl font-bold mb-4">Add a Review</h2>
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            await handleAddReview();
                                        }}
                                    >
                                        <div className="mb-4">
                                            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
                                                Review
                                            </label>
                                            <textarea
                                                id="reviewText"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm pl-2 pt-1 pb-1 pr-2"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="stars" className="block text-sm font-medium text-gray-700">
                                                Rating
                                            </label>
                                            <select
                                                id="stars"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                value={stars}
                                                onChange={(e) => setStars(Number(e.target.value))}
                                                required
                                            >
                                                <option value="">Select rating</option>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <option key={star} value={star}>
                                                        {star}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                                onClick={() => setShowReviewForm(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600">{review.reviewText}</p>
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: review.stars ?? 0 }, (_, i) => (
                                                <Star key={i} size={16} className="text-yellow-500 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    {(role === "Admin" || role === "Owner") && (
                                        <button
                                            onClick={() => handleDeleteReview(String(review.id), String(productId))}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">This product has no reviews</p>
                        )}
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