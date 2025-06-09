import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js'; // ✅ Cambiar authMiddleware por protectAdmin

const router = express.Router();

// ✅ Usar protectAdmin en lugar de authMiddleware
// GET /api/customers - Obtener todos los clientes
router.get('/', protectAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Lista de clientes - Por implementar',
      data: [],
      count: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message
    });
  }
});

// POST /api/customers - Crear nuevo cliente
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente - Mock',
      data: {
        _id: `customer_${Date.now()}`,
        name,
        email,
        phone,
        address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
});

// GET /api/customers/:customerId - Obtener cliente por ID
router.get('/:customerId', protectAdmin, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    res.json({
      success: true,
      message: 'Cliente encontrado - Mock',
      data: {
        _id: customerId,
        name: 'Cliente Mock',
        email: 'cliente@example.com',
        phone: '+54 11 1234-5678',
        address: 'Dirección mock 123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error.message
    });
  }
});

// PUT /api/customers/:customerId - Actualizar cliente
router.put('/:customerId', protectAdmin, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, email, phone, address } = req.body;
    
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente - Mock',
      data: {
        _id: customerId,
        name,
        email,
        phone,
        address,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
});

// DELETE /api/customers/:customerId - Eliminar cliente
router.delete('/:customerId', protectAdmin, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente - Mock',
      data: { _id: customerId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
});

// GET /api/customers/search/:query - Buscar clientes
router.get('/search/:query', protectAdmin, async (req, res) => {
  try {
    const { query } = req.params;
    
    res.json({
      success: true,
      message: `Búsqueda de clientes: "${query}" - Mock`,
      data: [],
      count: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda de clientes',
      error: error.message
    });
  }
});

export default router;