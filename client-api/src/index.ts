import express from 'express';
import config from 'config';
import connectDB from './startup/database';
import registerRoutesMiddlewares from './startup/routes';
import { Server } from 'http';

const app = express();

// Register middlewares and routes
registerRoutesMiddlewares(app); // Register and add middlewares and routes

// Only connect to database and start server if not in test environment
let server: Server | undefined;
if (process.env.NODE_ENV !== 'test') {
    connectDB(); // Connect to database
    const SERVER_PORT = config.get('server.port');
    server = app.listen(SERVER_PORT, () => {
        console.log(`Server is running on port ${SERVER_PORT}`);
    });
}

export { app, server };