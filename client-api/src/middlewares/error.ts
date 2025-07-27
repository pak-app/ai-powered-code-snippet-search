import { Request, Response, NextFunction } from 'express';

export default function error(
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {

    const errorStatusCode = error.statusCode || 500;    // Get the status code of error
    const message = error.message || 'Something went wrong on the server.';   // Set the error message
    const status = error.status || 'error';

    console.error(error.stack);
    // console.log(error);

    res.status(errorStatusCode).send({
        status: status,
        message: message
    });
}