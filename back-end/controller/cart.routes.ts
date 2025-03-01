/**
 * @swagger
 * paths:
 *   /cart/items/{userId}:
 *     get:
 *       tags:
 *       - Cart
 *   /cart/add/{userId}:
 *     post:
 *       tags:
 *       - Cart
 *   /cart/delete/{userId}:
 *     delete:
 *       tags:
 *       - Cart
 *   /update/{userId}:
 *     put:
 *       tags:
 *       - Cart
 *   /checkout/{userId}:
 *     delete:
 *       tags:
 *       - Cart
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

import express, { NextFunction, Request, Response } from 'express';
import cartService from '../service/cart.service';

const cartRouter = express.Router();
/**
 * @swagger
 * /cart/items/{userId}:
 *   get:
 *     summary: Get all items in a cart of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Returned all items in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
cartRouter.get('/items/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await cartService.getCartItems(String(req.params.userId)));
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /cart/add/{userId}:
 *   post:
 *     summary: Add an item to the cart of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
cartRouter.post('/add/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(
            await cartService.addToCart(
                String(req.params.userId),
                String(req.body.productId),
                Number(req.body.quantity)
            )
        );
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /cart/delete/{userId}:
 *   delete:
 *     summary: Delete an item from the cart of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
cartRouter.delete('/remove/:userId/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(
            await cartService.removeFromCart(String(req.params.userId), String(req.body.productId))
        );
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /update/{userId}:
 *   put:
 *     summary: Update an item in the cart of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item updated in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemId:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
cartRouter.put('/update/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId, productId, quantity } = req.body;
        res.send(
            await cartService.updateCart(
                String(req.params.userId),
                String(productId),
                Number(quantity),
                String(itemId)
            )
        );
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /checkout/{userId}:
 *   delete:
 *     summary: Checkout the cart of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Cart checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
cartRouter.delete('/checkout/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        console.log("User id in route: " + userId)
        const { cart } = req.body;

        console.log('Received cart for checkout:', cart);

        const newOrder = await cartService.checkout(String(userId), cart);

        res.status(200).send(newOrder);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /cart/orders/{userId}:
 *   get:
 *     summary: Get all orders for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
cartRouter.get('/orders/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await cartService.getOrdersByUserId(String(req.params.userId));
        console.log('Orders fetched routes:', response);
        res.send(response);
    } catch (error) {
        next(error);
    }
});

export default cartRouter;
