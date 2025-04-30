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

const getReviewById = async (id: string, productId: string): Promise<Review> => {
    try {
        const { resource: review } = await reviewContainer.item(id, productId).read();
        const mappedReview = await mapToReview(review);
        return mappedReview;
    } catch(error) {
        console.log(error);
        throw new Error("Database error. See server logs for details")
    }
}

const createReview = (productId: string, userId: string, reviewText: string, stars: number): Promise<Review> => {
    const review = new Review({userId, productId, reviewText, stars})
    return reviewContainer.items.create({ ...review }).then(response => {
        return mapToReview(response.resource);
    }).catch(error => {
        console.log(error);
        throw new Error("Failed to create review, See server log for details");
    });
}

const deleteReviewById = async (id: string, productId: string): Promise<void> => {
    try {
        const {resource: review} = await reviewContainer.item(id, productId).read();

        if (!review) return;

        await reviewContainer.item(id, productId).delete();
    } catch(error) {
        console.log(error);
        throw new Error("Database error. See server logs for details");
    }
}

export default {
    getReviewByProductId,
    createReview,
    deleteReviewById,
    getReviewById,
}