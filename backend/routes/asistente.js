const { Router } = require('express');
const { getAsistente, postAsistente } = require('../controllers/asistente');

const router = Router();

router.get('/', getAsistente);
router.post('/', postAsistente);

module.exports = router;