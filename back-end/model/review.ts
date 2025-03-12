import { User } from './user';
import { Product } from './product';

export class Review {
    private id?: string;
    private userId: string;
    private productId: string;
    private reviewText: string;

    constructor(review: { id?: string; userId: string; productId: string; reviewText: string }) {
        this.validate(review);
        this.id = review.id;
        this.userId = review.userId;
        this.productId = review.productId;
        this.reviewText = review.reviewText;
    }

    validate(review: { id?: string; userId: string; productId: string; reviewText: string }) {
        if (review.reviewText.length > 1000) {
            throw new Error('Review text is too long');
        }

        if (review.reviewText.length < 1) {
            throw new Error('Review text is required');
        }
    }

    getId(): string | undefined {
        return this.id;
    }

    getUserId(): string {
        return this.userId;
    }

    getProductId(): string {
        return this.productId;
    }

    getReviewText(): string {
        return this.reviewText;
    }

    static fromDocument(data: {
        id?: string;
        userId: string;
        productId: string;
        reviewText: string;
    }): Review {
        return new Review({
            id: data.id,
            userId: data.userId,
            productId: data.productId,
            reviewText: data.reviewText,
        });
    }

    equals(review: Review): boolean {
        return (
            this.userId === review.userId &&
            this.productId === review.productId &&
            this.reviewText === review.reviewText
        );
    }
}
