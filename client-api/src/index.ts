
import express from 'express';
import config from 'config';
import connectDB from './startup/database';
import registerRoutesMiddlewares from './startup/routes';

const app = express();

// Register middlewares and routes
connectDB();    // Connect to database
registerRoutesMiddlewares(app); // Register and add middlewares and routes

const SERVER_PORT = config.get('server.port');
const server = app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`)
});

export default server;