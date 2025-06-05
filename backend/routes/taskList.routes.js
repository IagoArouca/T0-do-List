const express = require('express');
const router = express.Router();
const taskListController = require('../controllers/taskList.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

router.use(authMiddleware.authenticateToken);

router.post('/', taskListController.createTaskList);

router.get('/', taskListController.getAllTaskLists);

router.get('/:id', taskListController.getTaskListById);

router.put('/:id', taskListController.updateTaskList);

router.delete('/:id', taskListController.deleteTaskList);

router.post('/:id/invite', taskListController.inviteCollaborator);

router.delete('/:id/collaborators/:userId', taskListController.removeCollaborator);

module.exports = router;