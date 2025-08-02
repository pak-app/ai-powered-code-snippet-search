import { Request, Response } from 'express';
import { generateEmbeddingAsync } from '../utils/gRPCClient';
import { SnippetPOSTBody } from '../types/createSnippet';
import { AppError } from '../utils/errors';
import { EmbeddingResponse } from '../types/gRPCClient';
import Snippet from '../models/snippet';
import ISnippet from '../types/snippetDbModel';

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
        throw new AppError('Embedding prcess failed, please check your description');

    const result: ISnippet = await new Snippet({
        ...body,
        embedding: gRPCResponse.embedding
    }).save();

    res.status(201).json(result);
}

// export function searchSnippet(
//     req: Request,
//     res: Response
// ){

// }