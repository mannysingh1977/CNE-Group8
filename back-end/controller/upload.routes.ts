import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadRouter = express.Router();
const upload = multer({ dest: '../../front-end/public/productPictures' });

uploadRouter.post('/', upload.single('media'), (req: Request, res: Response) => {
    console.log('Request received:', req.body);
    console.log('File received:', req.file);

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const tempPath = req.file.path;
    const targetPath = path.join(
        __dirname,
        '../../front-end/public/productPictures',
        req.file.originalname
    );

    fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded successfully.');
    });
});

export default uploadRouter;
