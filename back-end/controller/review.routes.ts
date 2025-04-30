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

reviewRouter.post("/addReview", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.body.productId;
        const userId = req.body.userId;
        const reviewText = req.body.reviewText;
        const stars = req.body.stars
        const createdReview = await reviewService.createReview(productId, userId, reviewText, stars);
        res.send(createdReview);
    } catch (error) {
        next(error);
    }
})

reviewRouter.delete("/delete/:id/:productId", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const id = req.params.id
        const productId = req.params.productId
        const deletedReview = await reviewService.deleteReviewById(id, String(token), productId)
        res.status(200).json(deletedReview);
    } catch(error) {
        next(error);
    }
})

export { reviewRouter };