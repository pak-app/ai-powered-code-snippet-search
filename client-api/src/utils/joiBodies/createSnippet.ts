
import Joi from 'joi';

export const createSnippetSchema = Joi.object({
    code: Joi.string().min(2).required().trim(),
    describe: Joi.string().required().trim(),
    language: Joi.string().trim(),
    tags: Joi.array().items(
        Joi.string().min(2).required()
    ).required().min(1)
});