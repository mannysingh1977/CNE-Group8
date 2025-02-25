/**
 * @swagger
 * paths:
 *   /products/all:
 *     get:
 *       tags:
 *         - Products
 *   /products/desc/limit/{limit}:
 *      get:
 *        tags:
 *         - Products
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import productService from '../service/product.service';

const productRouter = express.Router();

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Get all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productRouter.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await productService.getAllProducts());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /products/desc/limit/{limit}:
 *   get:
 *     summary: Get products with a limit in descending order
 *     parameters:
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: The maximum number of products to return
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productRouter.get('/desc/limit/:limit', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await productService.getProductsLimitDesc(Number(req.params.limit)));
    } catch (error) {
        next(error);
    }
});

export { productRouter };

productRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send(await productService.getProductById(Number(req.params.id)));
    } catch (error) {
        next(error);
    }
});

productRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req.body', req.body)
        res.send(await productService.createProduct(req.body));
    } catch (error) {
        next(error);
    }
});

productRouter.get('/catalog/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await productService.getProductCatalog(Number(req.params.userId)));
    } catch (error) {
        next(error);
    }
});
