import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(400).json({
        status: 'error',
        message: err.message,
    });
};

export default errorHandler;