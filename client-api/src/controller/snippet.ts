import { Request, Response } from 'express';
import getEmbeddingArray from '../utils/gRPCClient';
import { SnippetPOSTBody } from '../types/createSnippet';
import { AppError } from '../utils/errors';
import Snippet from '../models/snippet';
import ISnippet from '../types/snippetDbModel';

export async function createSnippet(
    req: Request,
    res: Response
) {
    const body: SnippetPOSTBody = req.body;

    const embeddingArray = await getEmbeddingArray(body);
    
    if(!embeddingArray)
        throw new AppError('Embedding prcess failed, please check your description');

    const result: ISnippet = await new Snippet({
        ...body,
        embedding: embeddingArray
    }).save();

    res.status(201).json(result);
}

// export function searchSnippet(
//     req: Request,
//     res: Response
// ){

// }