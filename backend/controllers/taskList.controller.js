const TaskList = require('../models/taskList.model.js');
const User = require('../models/user.model.js');
const Task = require('../models/task.model');

exports.createTaskList = async (req, res) => {
    try {
        const { name } = req.body;
        const newTaskList = new TaskList({ name, owner: req.user.userId });
        const savedTaskList = await newTaskList.save();

        await User.findByIdAndUpdate(req.user.userId, {
            $push: {ownedTaskLists: savedTaskList._id  },
        });

        res.status(201).json(savedTaskList);
    }
     catch (error) {
        console.error('Erro ao criar lista de tarefas:', error);
        res.status(500).json({ message: 'Erro ao criar lista de tarefas.' });
     }
}

exports.getAllTaskLists = async (req, res) => {
  try {
    const taskLists = await TaskList.find({
      $or: [{ owner: req.user.userId }, { collaborators: req.user.userId }],
    })
      .populate('owner', 'username email') 
      .populate('collaborators', 'username email')
      .populate('tasks')                        

    res.status(200).json(taskLists);
  } catch (error) {
    console.error('Erro ao obter listas de tarefas:', error);
    res.status(500).json({ message: 'Erro ao obter listas de tarefas.' });
  }
};

exports.getTaskListById = async (req, res) => {
  const listId = req.params.id;
  try {
    const taskList = await TaskList.findById(listId).populate('owner collaborators', 'username email')

    if (!taskList) {
      return res.status(404).json({ message: 'Lista de tarefas não encontrada.' });
    }

    const isOwner = taskList.owner._id.toString() === req.user.userId;

    const isCollaborator = taskList.collaborators.some(collab => collab._id.toString() === req.user.userId);

    if (isOwner || isCollaborator) {
      return res.status(200).json(taskList);
    } else {
      return res.status(404).json({ message: 'Lista de tarefas não encontrada.' });
    }

  } catch (error) {
    console.error('Erro ao obter lista de tarefas por ID:', error);
    return res.status(500).json({ message: 'Erro ao obter lista de tarefas.' });
  }
};

exports.updateTaskList = async (req, res) => {
  try {
    const taskList = await TaskList.findById(req.params.id);
    if (!taskList || taskList.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Não autorizado a atualizar esta lista de tarefas.' });
    }

    const updatedTaskList = await TaskList.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.status(200).json(updatedTaskList);
  } catch (error) {
    console.error('Erro ao atualizar lista de tarefas:', error);
    res.status(500).json({ message: 'Erro ao atualizar lista de tarefas.' });
  }
};


exports.deleteTaskList = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.userId; 

    const taskList = await TaskList.findById(id);

    if (!taskList) {
      return res.status(404).json({ message: 'Lista de tarefas não encontrada.' });
    }

    if (taskList.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Não autorizado a excluir esta lista de tarefas.' });
    }

    await Task.deleteMany({ taskList: id });

    await TaskList.findByIdAndDelete(id);

     await User.findByIdAndUpdate(userId, {
      $pull: { ownedTaskLists: id },
     });

    res.status(200).json({ message: 'Lista de tarefas e suas tarefas associadas excluídas com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir lista de tarefas:', error);
    res.status(500).json({ message: 'Erro ao excluir lista de tarefas.' });
  }
};

exports.inviteCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const taskList = await TaskList.findById(req.params.id);
    const userToInvite = await User.findOne({ email });

    if (!taskList || taskList.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Não autorizado a convidar colaboradores para esta lista.' });
    }

    if (!userToInvite) {
      return res.status(404).json({ message: 'Usuário a ser convidado não encontrado.' });
    }

    if (taskList.collaborators.includes(userToInvite._id) || taskList.owner.toString() === userToInvite._id.toString()) {
      return res.status(409).json({ message: 'Usuário já é um colaborador ou o proprietário.' });
    }

    taskList.collaborators.push(userToInvite._id);
    await taskList.save();

    await User.findByIdAndUpdate(userToInvite._id, {
      $push: { collaboratedTaskLists: taskList._id },
    });

    res.status(200).json({ message: 'Convite enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao convidar colaborador:', error);
    res.status(500).json({ message: 'Erro ao convidar colaborador.' });
  }
};

exports.removeCollaborator = async (req, res) => {
  try {
    const { userId } = req.params;
    const taskList = await TaskList.findById(req.params.id);

    if (!taskList || taskList.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Não autorizado a remover colaboradores desta lista.' });
    }
    if (!taskList.collaborators.includes(userId)) {
      return res.status(404).json({ message: 'Colaborador não encontrado nesta lista.' });
    }

    taskList.collaborators = taskList.collaborators.filter(id => id.toString() !== userId);
    await taskList.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { collaboratedTaskLists: taskList._id },
    });

    res.status(200).json({ message: 'Colaborador removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover colaborador:', error);
    res.status(500).json({ message: 'Erro ao remover colaborador.' });
  }
};