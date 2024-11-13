const { Router } = require('express');
const mocksController = require('../controllers/mocks.controller.js');

const router = Router();

router.get('/mockingpets', mocksController.getMockingPets);
router.get('/mockingusers', mocksController.getMockingUsers);
router.post('/generatedata', mocksController.generateData);

module.exports = router;
