import { Router } from 'express';
import * as controller from '../controller/snippet';

const router = Router();

router.post('/create', controller.createSnippet);
// router.get('/snippet/search');

export default router;