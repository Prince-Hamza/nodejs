import express from 'express'
import { comment, createPost, deletePost, getMyPosts, getPost, getTimelinePosts, likePost, test, timeline, updatePost } from '../controllers/PostController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'
const router = express.Router()

router.post('/create',createPost)
// router.get('/:id', getPost)
// router.put('/:id/update', updatePost)
// router.delete('/:id/delete', deletePost)
// router.put('/:id/like', likePost)
router.get('/timeline', timeline)
router.get('/myposts', getMyPosts)

router.get('/test', test)
router.get('/updateComments', test)
router.get('/updateLikes', test)
router.post('/like', likePost)
router.post('/comment', comment)


export default router