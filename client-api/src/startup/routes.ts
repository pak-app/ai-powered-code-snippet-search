import snippetRouter from '../routes/snippet';
import { Application, json } from 'express';
import error from '../middlewares/error';

export default function registerRoutesMiddlewares(app: Application): void {
    app.use(json());    // Enable JSON for Express HTTP methods
    app.use('/api/snippet', snippetRouter); // Register router of snippetRouter
    app.use(error); // Centeral error handler
}