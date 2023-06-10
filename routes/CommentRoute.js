/*import express from 'express';
import {
  createComment,
  getTimelineComments,
  getComment,
  likeComment,
  deleteComment,
  updateComment,
  getPostComments
} from '../controllers/CommentController.js';

const router = express.Router();

// Routes des commentaires
router.post('/', createComment);
router.get('/:id', getComment);
router.get('/timeline', getTimelineComments);
router.get('/post/:postId', getPostComments); // Nouvelle route pour récupérer les commentaires d'un post
router.put('/:id/like', likeComment);
router.delete('/:id/delete', deleteComment);
router.put('/:id/update', updateComment);

export default router;*/

import express from 'express'
import { createComment, deleteComment, getComment, getTimelineComments, likeComment, updateComment } from '../controllers/CommentController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'
const router = express.Router()

router.post('/',createComment)
router.get('/:id', getComment)
router.put('/:id', updateComment)
router.delete('/:id', deleteComment)
router.put('/:id/like', likeComment)
router.get('/:id/timeline', getTimelineComments)

export default router
