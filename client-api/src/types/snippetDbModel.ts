import { Document } from 'mongoose';

export default interface ISnippet extends Document {
    code: string;
    language: string;
    description: string;
    tags: string[];
    embedding: number[],
    createdAt: Date;
    updatedAt: Date;
}