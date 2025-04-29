import { Review } from "../model/review";
import reviewDb from "../repository/review.db";

const getReviewByProductId = async (productId: string)=> {
    const reviews = await reviewDb.getReviewByProductId({ productId });
    return reviews;
}

const createReview = async (productId: string, userId: string, reviewText: string, stars: number): Promise<Review> => {
    const review = reviewDb.createReview(productId, userId, reviewText, stars);
    return review;
}

export default {
    getReviewByProductId,
    createReview
}