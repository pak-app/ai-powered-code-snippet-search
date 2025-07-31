// models/Snippet.ts
import mongoose, { Schema } from "mongoose";
import ISnippet from '../types/snippetDbModel';

const SnippetSchema: Schema = new Schema<ISnippet>(
    {
        code: {
            type: String,
            required: true,
            trim: true
        },
        language: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        tags: {
            type: [String],
            default: []
        },
        embedding: {
            type: [Number],
            required: true,
            validate: {
                validator: (arr: number[]) => arr.every((val) => typeof val === "number"),
                message: "Embedding must be an array of numbers (float or int)."
            }
        }
    },
    { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model<ISnippet>("Snippet", SnippetSchema);
