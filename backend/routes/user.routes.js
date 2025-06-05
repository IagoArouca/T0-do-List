const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js'); 


router.get('/me', authMiddleware.authenticateToken, userController.getMe);

router.put('/me', authMiddleware.authenticateToken, userController.updateMe);

module.exports = router;