export interface SnippetPOSTBody {
    code: string;
    description: string;
    tags: string[];
    language: string;
};

export interface SnippetPOSTResponse {
    embedding: number[]
};