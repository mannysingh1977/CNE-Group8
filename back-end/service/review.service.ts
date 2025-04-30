import { jwtDecode } from "jwt-decode";
import { Review } from "../model/review";
import reviewDb from "../repository/review.db";
import { CustomJwtPayload } from "./user.service";

const getReviewByProductId = async (productId: string)=> {
    const reviews = await reviewDb.getReviewByProductId({ productId });
    return reviews;
}

const createReview = async (productId: string, userId: string, reviewText: string, stars: number): Promise<Review> => {
    const review = reviewDb.createReview(productId, userId, reviewText, stars);
    return review;
}

const deleteReviewById = async (id: string, token: string, productId: string): Promise<Review | null> => {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);

    const userId = decodedToken.userId;

    const review = await reviewDb.getReviewById(id, productId);
    const reviewUserId = review.getUserId();

    if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner" && reviewUserId !== userId) {
        throw new Error("Wrong role or not your review")
    }

    await reviewDb.deleteReviewById(id, productId)
    return null;
}

export default {
    getReviewByProductId,
    createReview,
    deleteReviewById,
}