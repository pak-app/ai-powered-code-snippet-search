import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { promisify } from 'util';
import { EmbeddingResponse, EmbeddingRequest } from '../types/gRPCClient';

// Define gRPC service interfaces

interface EmbedServiceClient {
    GenerateEmbedding: (
        request: EmbeddingRequest,
        options: { deadline: Date },
        callback: (error: grpc.ServiceError | null, response: EmbeddingResponse) => void
    ) => void;
}

// Configuration
const PROTO_PATH: string = path.resolve(__dirname, '../../../protos/embedding.proto');
const GRPC_SERVER: string = process.env.GRPC_SERVER || 'localhost:50051';

// Load gRPC package definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

// Create gRPC client (initialized once)
const embedProto = grpc.loadPackageDefinition(packageDefinition).embed as any;
const client: EmbedServiceClient = new embedProto.EmbedService(
    GRPC_SERVER,
    grpc.credentials.createInsecure() // Use createSsl() in production
);

// Promisify gRPC method for async/await
const generateEmbeddingAsync = promisify(client.GenerateEmbedding).bind(client);

export default async function getEmbeddingArray(body: EmbeddingRequest) {
    const deadline = new Date(Date.now() + 10000);
    const gRPCResponse: EmbeddingResponse = await generateEmbeddingAsync(
        body,
        { deadline }
    );

    return gRPCResponse.embedding;
}