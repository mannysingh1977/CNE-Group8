import reviewDb from "../repository/review.db";

const getReviewByProductId = async (productId: string)=> {
    const reviews = await reviewDb.getReviewByProductId({ productId });
    return reviews;
}

export default {
    getReviewByProductId,
}