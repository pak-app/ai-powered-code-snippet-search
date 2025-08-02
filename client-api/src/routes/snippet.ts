import { Router } from 'express';
import * as controller from '../controller/snippet';
import validateBody from '../middlewares/validator';
import createSnippetSchema from '../utils/joiBodies/createSnippet';

const router = Router();

router.post('/create', validateBody(createSnippetSchema, 'body'), controller.createSnippet);
router.get('/', controller.searchSnippet);

export default router;