const express = require('express');
const router = express.Router();
const propagandaController = require('../controllers/propagandaController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, propagandaController.listPropagandasForUser);

router.post('/', authMiddleware, adminMiddleware, propagandaController.createPropaganda);
router.get('/all', authMiddleware, adminMiddleware, propagandaController.getAllPropagandas);
router.delete('/:id', authMiddleware, adminMiddleware, propagandaController.deletePropaganda);

router.get('/:id', authMiddleware, adminMiddleware, propagandaController.getPropagandaById);
router.put('/:id', authMiddleware, adminMiddleware, propagandaController.updatePropaganda);

module.exports = router;