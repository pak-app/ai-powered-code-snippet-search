import mongoose from "mongoose";
import config from 'config';

export default function connectDB(): void {
    
    const hostName: string = config.get('database.host');
    const port: number = config.get('database.port');
    const databaseName: string = config.get('database.dbname');
    
    const MONGODB_URI: string = `mongodb://${hostName}:${port}/${databaseName}`;
    console.log(MONGODB_URI);
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log(`DB is connected on URI ${MONGODB_URI}`)
        });
};