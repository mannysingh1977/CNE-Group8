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
        const products = await productService.getAllProducts();
        res.send(products);
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
        const limit = Number(req.params.limit);
        const products = await productService.getProductsLimitDesc(limit);
        res.send(products);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
productRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = req.params.id;
        if (!productId || productId.trim() === '') {
            return res.status(400).send({ error: 'Invalid product id provided' });
        }
        const product = await productService.getProductById(productId);
        res.status(200).send(product);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
productRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('req.body', req.body);
        const createdProduct = await productService.createProduct(req.body);
        res.send(createdProduct);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /products/catalog/{userId}:
 *   get:
 *     summary: Get product catalog for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User product catalog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
productRouter.get('/catalog/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const catalog = await productService.getProductCatalog(userId);
        res.send(catalog);
    } catch (error) {
        next(error);
    }
});

export { productRouter };
