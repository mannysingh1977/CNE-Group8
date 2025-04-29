import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { productRouter } from './controller/product.routes';
import errorHandler from './middelware/errorHandler';
import { expressjwt } from 'express-jwt';
import cartRouter from './controller/cart.routes';
import helmet from 'helmet';
import uploadRouter from './controller/upload.routes';
import { reviewRouter } from './controller/review.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;
app.use(cors({ origin: 'http://localhost:8080' }));

app.use('/upload', uploadRouter);

app.use(bodyParser.json({ limit: '50mb' }));

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/api-docs',
            /^\/api-docs\/.*/,
            '/login',
            '/register',
            '/status',
            '/users/register',
            '/users/login',
            /^\/products\/(desc|asc)\/limit\/\d+$/,
        ],
    }),
    helmet()
);
const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UserBazaar',
            version: '1.0.0',
            description:
                "API docs for user bazaar. Please login first with the /users/login and copy the code inside the field you get when clicking the green button 'Authorize'. \nUse email: Jhon.owner@userbazaar.com password: JhonsSuperSecretPassword\nAlways add products to the cart before asking the items in the cart, otherwise you get an empty list",
        },
    },
    apis: ['./controller/*.ts', './routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/review', reviewRouter);

app.use(errorHandler);

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
function multer(arg0: { dest: string }) {
    throw new Error('Function not implemented.');
}
