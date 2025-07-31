import { BadRequestError } from '../utils/errors';
import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';

export default (schema: ObjectSchema, property: keyof Request) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        // rejectEmptyBody(req);   // checks if the body or params are empty or not
        const propertyData = req[property];
        await schema.validateAsync(propertyData);   // Validate body of request

        next(); // rest of the logic
    }
    catch (error: any) {
        next(new BadRequestError(`Bad request: ${error.message}`));    // centeralized error handler
    }
}
