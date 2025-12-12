import express from 'express';
import { getDebateTopics, createDebate, getDebateById, submitArgument, getAllDebates } from '../controllers/debateController.js';

const router = express.Router();

router.get('/topics', getDebateTopics);
router.get('/history', getAllDebates);
router.post('/create', createDebate);
router.get('/:debateId', getDebateById);
router.post('/:debateId/argument', submitArgument);

export default router;
