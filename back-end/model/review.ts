import { User } from './user';
import { Product } from './product';

export class Review {
    private id?: number;
    private user: User;
    private product: Product;
    private reviewText: string;

    constructor(review: { id?: number; user: User; product: Product; reviewText: string }) {
        this.validate(review);
        this.id = review.id;
        this.user = review.user;
        this.product = review.product;
        this.reviewText = review.reviewText;
    }

    validate(review: { id?: number; user: User; product: Product; reviewText: string }) {
        if (review.reviewText.length > 1000)  {
            throw new Error('Review text is too long');
        }

        if (review.reviewText.length < 1) {
            throw new Error('Review text is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }
    getUser(): User {
        return this.user;
    }
    getProduct(): Product {
        return this.product;
    }
    getReviewText(): string {
        return this.reviewText;
    }

    equals(review: Review): boolean {
        return (
            this.user == review.user &&
            this.product == review.product &&
            this.reviewText == review.reviewText
        );
    }
}
