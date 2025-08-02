
import Joi from 'joi';

const createSnippetSchema = Joi.object({
    code: Joi.string().min(2).required().trim(),
    description: Joi.string().required().trim(),
    language: Joi.string().trim(),
    tags: Joi.array().items(
        Joi.string().min(1).trim()
    ).required().min(1)
});

export default createSnippetSchema;