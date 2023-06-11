import express from 'express'
import { deleteUser, followUser, getAllUsers, getUser, queryUser, sendStreamingKey, unfollowUser, update, updateUser } from '../controllers/UserController.js'
import authMiddleWare from '../middleware/AuthMiddleware.js'

const router = express.Router()

router.get('/:id', getUser)
router.get('/:name/search', queryUser)
router.get('/', getAllUsers)
router.put('/:id', authMiddleWare, updateUser)
router.delete('/:id', authMiddleWare, deleteUser)
router.post('/follow', followUser)
router.post('/unfollow', unfollowUser)
router.post('/update', update)
router.post('/sendStreamingKey', sendStreamingKey)

export default router