export interface SnippetPOSTBody {
    code: string;
    description: string;
    tags: string[];
    language: string;
};

export interface SnippetPOSTResponse extends SnippetPOSTBody {
    embedding: number[]
};