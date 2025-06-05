const Task = require('../models/task.model');
const TaskList = require('../models/taskList.model');

exports.createTask = async (req, res) => {
  try {
    const { description } = req.body;
    const { taskListId } = req.params;

    const taskList = await TaskList.findById(taskListId);
    if (!taskList || (taskList.owner.toString() !== req.user.userId && !taskList.collaborators.includes(req.user.userId))) {
      return res.status(404).json({ message: 'Lista de tarefas não encontrada ou você não tem permissão.' });
    }

    const newTask = new Task({ description, taskList: taskListId });
    const savedTask = await newTask.save();

    await TaskList.findByIdAndUpdate(
      taskListId,
      { $push: { tasks: savedTask._id } }, 
      { new: true, useFindAndModify: false } 
    );

    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ message: 'Erro ao criar tarefa.' });
  }
};

exports.getAllTasksByList = async (req, res) => {
  try {
    const { taskListId } = req.params;

    const taskList = await TaskList.findById(taskListId);
    if (!taskList || (taskList.owner.toString() !== req.user.userId && !taskList.collaborators.includes(req.user.userId))) {
      return res.status(404).json({ message: 'Lista de tarefas não encontrada ou você não tem permissão.' });
    }

    const tasks = await Task.find({ taskList: taskListId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Erro ao obter tarefas da lista:', error);
    res.status(500).json({ message: 'Erro ao obter tarefas da lista.' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('taskList', 'name owner collaborators');
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    const taskList = task.taskList;
    if (taskList.owner.toString() !== req.user.userId && !taskList.collaborators.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Não autorizado a visualizar esta tarefa.' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Erro ao obter tarefa por ID:', error);
    res.status(500).json({ message: 'Erro ao obter tarefa.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { description, isCompleted } = req.body;
    const task = await Task.findById(req.params.id).populate('taskList', 'owner collaborators');
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    const taskList = task.taskList;
    if (taskList.owner.toString() !== req.user.userId && !taskList.collaborators.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Não autorizado a atualizar esta tarefa.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { description, isCompleted },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('taskList', 'owner collaborators');
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    const taskList = task.taskList;
    if (taskList.owner.toString() !== req.user.userId && !taskList.collaborators.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Não autorizado a excluir esta tarefa.' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ message: 'Erro ao excluir tarefa.' });
  }
};