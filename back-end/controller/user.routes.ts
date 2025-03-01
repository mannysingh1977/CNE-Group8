/**
 * @swagger
 * paths:
 *  /users:
 *      get:
 *          tags:
 *          - User Management
 *      post:
 *          tags:
 *          - User Management
 *  /users/login:
 *      post:
 *          tags:
 *          - User Management
 *  /users/register:
 *      post:
 *          tags:
 *          - User Management
 * /users/{id}:
 *      get:
 *          tags:
 *          - User Management
 * /users/updateRole/{userId}:
 *      put:
 *          tags:
 *          - User Management
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         emailAddress:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *         seller:
 *           type: boolean
 *         newsLetter:
 *           type: boolean
 *         role:
 *           type: string
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         emailAddress:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             houseNumber:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *             state:
 *               type: string
 *             country:
 *               type: string
 *         seller:
 *           type: boolean
 *         newsLetter:
 *           type: boolean
 *         role:
 *           type: string
 *     UserInputLogin:
 *       type: object
 *       properties:
 *         emailAddress:
 *           type: string
 *         password:
 *           type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput, UserInputLogin } from '../types';
import { ObjectId } from 'mongodb';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await userService.getAllUsers());
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInputLogin'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInputLogin>req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication Succesful', ...response });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.addUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
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
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        if (ObjectId.isValid(userId)) {
            const objectId = new ObjectId(userId);
            const user = await userService.getUserById(objectId.toString());
            res.status(200).send(user);
        } else {
            res.status(400).send({ error: 'Invalid user id provided' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/updateRole/{userId}:
 *   put:
 *     summary: Update user role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User role updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.put('/updateRole/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new ObjectId(req.params.userId);
        const { role } = req.body;
        const updatedUser = await userService.updateUserRole(userId.toString(), role);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

userRouter.put('/seller/grant/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new ObjectId(req.params.userId);
        const token = req.body.token;
        const updatedUser = await userService.grantSellerStatus(userId.toString(), String(token));
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

userRouter.put(
    '/seller/revoke/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = new ObjectId(req.params.userId);
            const token = req.body.token;
            const updatedUser = await userService.revokeSellerStatus(userId.toString(), String(token));
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
);

userRouter.delete(
    '/seller/remove/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = new ObjectId(req.params.userId);
            const token = req.body.token;
            const deletedUser = await userService.deleteUser(userId.toString(), String(token));
            res.status(200);
        } catch (error) {
            next(error);
        }
    }
);
export { userRouter };
