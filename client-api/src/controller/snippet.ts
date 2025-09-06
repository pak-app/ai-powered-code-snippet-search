import { Request, Response } from 'express';
import getEmbeddingArray from '../utils/gRPCClient';
import { SnippetPOSTBody } from '../types/createSnippet';
import { AppError } from '../utils/errors';
import Snippet from '../models/snippet';
import ISnippet from '../types/snippetDbModel';
import { SearchQuery } from '../types/searchQuery';

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function createSnippet(
    req: Request,
    res: Response
) {
    const body: SnippetPOSTBody = req.body;

    const embeddingArray = await getEmbeddingArray(body.description);

    if (!embeddingArray)
        throw new AppError('Embedding prcess failed, please check your description');

    const result: ISnippet = await new Snippet({
        ...body,
        embedding: embeddingArray
    }).save();

    res.status(201).json(result);
}

export async function searchSnippet(
    req: Request,
    res: Response
) {
    const query = req.query as SearchQuery;
    const search = query.search.split('+');
    const searchSentence = search.join(' ');

    const embedSearchSentence = await getEmbeddingArray({
        code: '',
        language: '',
        description: searchSentence,
        tags: []
    });

    // 2. Get all snippets
    const snippets = await Snippet.find();

    // 3. Calculate similarity
    const scored = snippets.map(snippet => ({
        snippet,
        score: cosineSimilarity(embedSearchSentence, snippet.embedding),
    }));

    // 4. Sort and return top 5
    const topResults = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => ({ ...item.snippet.toObject(), similarity: item.score }));
    
    res.status(200).json(topResults);
}