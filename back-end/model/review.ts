import { User } from './user';
import { Product } from './product';

export class Review {
    private id?: string;
    private userId: string;
    private productId: string;
    private reviewText: string;
    private stars: number;

    constructor(review: { id?: string; userId: string; productId: string; reviewText: string; stars: number}) {
        this.validate(review);
        this.id = review.id;
        this.userId = review.userId;
        this.productId = review.productId;
        this.reviewText = review.reviewText;
        this.stars = review.stars;
    }

    validate(review: { id?: string; userId: string; productId: string; reviewText: string; stars: number }) {
        if (review.reviewText.length > 1000) {
            throw new Error('Review text is too long');
        }

        if (review.reviewText.length < 1) {
            throw new Error('Review text is required');
        }

        if (review.stars > 5 || review.stars < 1) {
            throw new Error('Stars should be between 1 and 5')
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

    getStars(): number {
        return this.stars
    }

    static fromDocument(data: {
        id?: string;
        userId: string;
        productId: string;
        reviewText: string;
        stars: number
    }): Review {
        return new Review({
            id: data.id,
            userId: data.userId,
            productId: data.productId,
            reviewText: data.reviewText,
            stars: data.stars,
        });
    }

    equals(review: Review): boolean {
        return (
            this.userId === review.userId &&
            this.productId === review.productId &&
            this.reviewText === review.reviewText &&
            this.stars === review.stars
        );
    }
}
