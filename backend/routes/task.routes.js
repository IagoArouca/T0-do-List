const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.use(authMiddleware.authenticateToken);

router.post('/lists/:taskListId', taskController.createTask);

router.get('/lists/:taskListId', taskController.getAllTasksByList);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;