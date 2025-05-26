import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
    getAllBazaznaniy,
    createBazaznaniy,
    updateBazaznaniy,
    deleteBazaznaniy
} from '../controllers/bazaznaniyController.js';

const router = express.Router();

// Маршруты для базы знаний
router.get('/', getAllBazaznaniy);
router.post('/', protect, authorize('admin', 'support'), createBazaznaniy);
router.put('/:id', protect, authorize('admin', 'support'), updateBazaznaniy);
router.delete('/:id', protect, authorize('admin'), deleteBazaznaniy);

export default router; 