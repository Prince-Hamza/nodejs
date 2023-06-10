import express from 'express'
import { createPost, deletePost, getPost, getTimelinePosts, likePost, test, timeline, updatePost } from '../controllers/PostController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'
const router = express.Router()

router.post('/create',createPost)
// router.get('/:id', getPost)
// router.put('/:id/update', updatePost)
// router.delete('/:id/delete', deletePost)
// router.put('/:id/like', likePost)
router.get('/timeline', timeline)
router.get('/test', test)


export default router