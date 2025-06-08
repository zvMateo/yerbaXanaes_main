import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  updateCustomerSegment,
  getCustomerAnalytics,
  recalculateAllStats
} from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de clientes (todas requieren autenticación de admin)
router.get('/', authMiddleware, getAllCustomers);
router.get('/analytics', authMiddleware, getCustomerAnalytics);
router.get('/email/:email', authMiddleware, getCustomerByEmail);
router.get('/:id', authMiddleware, getCustomerById);

router.put('/:id/segment', authMiddleware, updateCustomerSegment);
router.post('/recalculate-stats', authMiddleware, recalculateAllStats);

export default router;