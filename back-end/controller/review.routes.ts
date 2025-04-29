import express, { NextFunction, Request, Response } from 'express';
import reviewService from '../service/review.service';

const reviewRouter = express.Router();

reviewRouter.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.productId;
        if (!productId || productId.trim() === '') {
            return res.status(400).send({error: 'Invalid product id provided'});
        }

        const reviews = await reviewService.getReviewByProductId(productId);
        res.status(200).send(reviews)
    } catch(error) {
        next(error);
    }
});

export { reviewRouter };