import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export default function error(
    error: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) {

    const errorStatusCode = error.statusCode || 500;    // Get the status code of error
    const message = error.message || 'Something went wrong on the server.';   // Set the error message
    const status = error.status || 'error';

    console.error(error);

    res.status(errorStatusCode).send({
        status: status,
        message: message
    });
}