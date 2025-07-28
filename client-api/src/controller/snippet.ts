import { Request, Response } from 'express';
import { generateEmbeddingAsync } from '../utils/gRPCClient';
import { SnippetPOSTBody } from '../types/createSnippet';
import { AppError } from '../utils/errors';
import { EmbeddingResponse } from '../types/gRPCClient';

export async function createSnippet(
    req: Request,
    res: Response
) {
    const body: SnippetPOSTBody = req.body;

    const deadline = new Date(Date.now() + 10000);
    const gRPCResponse: EmbeddingResponse = await generateEmbeddingAsync(
        body,
        { deadline }
    );
    
    if(!gRPCResponse)
        throw new AppError('Unexpected error');

    res.status(200).json({
        embed: gRPCResponse.embedding
    });
}

export function searchSnippet(
    req: Request,
    res: Response
){

}