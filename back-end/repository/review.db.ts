import { Container } from "@azure/cosmos";
import { getContainer } from "./database";
import { Review } from "../model/review";


const reviewContainer: Container = getContainer('review');

const mapToReview = async (data: any): Promise<Review> => {
    return Review.fromDocument({
        id: data.id,
        userId: data.userId,
        productId: data.productId,
        reviewText: data.reviewText,
        stars: data.stars
    })
}

const getReviewByProductId = async ({ productId }: { productId: string }): Promise<Review[]> => {
    try {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.productId = @productId",
            parameters: [
                {
                    name: "@productId",
                    value: productId
                }
            ]
        };

        const { resources: reviews } = await reviewContainer.items.query(querySpec).fetchAll();
        const reviewArray = await Promise.all(reviews.map(mapToReview));
        return reviewArray;
    } catch (error) {
        console.log(error);
        throw new Error("Database error, See server log for details");
    }
};

export default {
    getReviewByProductId,
}