import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '@util/apiResponse.util';

const errorHandler: ErrorRequestHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(err);

    if (err instanceof ApiError) {
        res.status(err.statusCode).json(err.toJSON());
    } else if (err instanceof Error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
            success: false
        });
    } else {
        res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }

    next();
};

export default errorHandler;
