import express from 'express';
import { userScheme } from '../controllers/SchemeController.js';

const router = express.Router()

router.post('/createuser', userScheme)

export default router