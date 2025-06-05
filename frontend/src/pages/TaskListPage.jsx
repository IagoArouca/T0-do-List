import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import * as api from '../services/api.js';
import MusicPlayer from '../components/MusicPlayer/MusicPlayer.jsx'

import TaskCard from '../components/Task/TaskCard.jsx'; 
import TaskForm from '../components/Task/TaskForm.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import './TaskListPage.css';

const TaskListPage = () => {
  const { id: taskListId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [taskList, setTaskList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [activeSection, setActiveSection] = useState('tasks'); 

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  useEffect(() => {
    const fetchTaskListAndTasks = async () => {
      setLoadingList(true);
      setLoadingTasks(true);
      setError(null);
      try {
        const listData = await api.getTasklistById(taskListId);
        setTaskList(listData);
        const tasksData = await api.getAllTasksByList(taskListId);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message || 'Erro ao carregar detalhes da lista ou tarefas.');
      } finally {
        setLoadingList(false);
        setLoadingTasks(false);
      }
    };

    fetchTaskListAndTasks();
  }, [taskListId]);

  const handleCreateTask = async (description) => {
    try {
      const newTask = await api.createTask(taskListId, description);
      setTasks([...tasks, newTask]);
      setIsCreatingTask(false);
    } catch (err) {
      setError(err.message || 'Erro ao criar tarefa.');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await api.updateTask(taskId, taskData);
      setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    } catch (err) {
      setError(err.message || 'Erro ao atualizar tarefa.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message || 'Erro ao excluir tarefa.');
    }
  };

  const toggleCreatingTask = () => {
    setIsCreatingTask(!isCreatingTask);
  };

  const handleInviteCollaborator = async () => {
    setIsInviting(true);
    setInviteError(null);
    try {
      if (inviteEmail.trim()) {
        const response = await api.inviteCollaborator(taskListId, inviteEmail);
        console.log('Convite enviado:', response);
        const updatedTaskList = await api.getTasklistById(taskListId);
        setTaskList(updatedTaskList);
        setInviteEmail('');
      } else {
        setInviteError('Por favor, insira o email do colaborador.');
      }
    } catch (err) {
      setInviteError(err.message || 'Erro ao convidar colaborador.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      await api.removeCollaborator(taskListId, collaboratorId);
      const updatedTaskList = await api.getTasklistById(taskListId);
      setTaskList(updatedTaskList);
    } catch (err) {
      setError(err.message || 'Erro ao remover colaborador.');
    }
  };

  if (loadingList || loadingTasks) {
    return <p>Carregando detalhes...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!taskList) {
    return <p>Lista de tarefas não encontrada.</p>;
  }

  const isOwner = taskList.owner?._id?.toString() === user?._id?.toString();

  return (
    <div className="task-list-page-container">
      <aside className="task-list-sidebar">
        <h3>Opções</h3>
        <ul className="sidebar-menu">
          <li onClick={() => handleMenuClick('tasks')} className={activeSection === 'tasks' ? 'active' : ''}>
            Lista de Tarefas
          </li>
          {isOwner && (
            <li onClick={() => handleMenuClick('collaborators')} className={activeSection === 'collaborators' ? 'active' : ''}>
              Adicionar Colaboradores
            </li>
          )}
        </ul>
      </aside>
      <main className="task-list-main-content">
        <header className="main-content-header">
          <h1>{taskList.name}</h1>
          <p>Proprietário: {taskList.owner?.username || 'Desconhecido'}</p>
          {taskList.collaborators && taskList.collaborators.length > 0 && (
            <p>Colaboradores: {taskList.collaborators.map(collab => collab.username).join(', ')}</p>
          )}
        </header>

        {activeSection === 'tasks' && (
          <div className="task-list-items">
            <div className="add-new-task-button-container">
              <Button
                  onClick={toggleCreatingTask}
                  className={isCreatingTask ? 'cancel-button-task' : ''} >
                  {isCreatingTask ? 'X' : 'Adicionar Nova Tarefa'}
            </Button>
              {isCreatingTask && <TaskForm onSubmit={handleCreateTask} onCancel={toggleCreatingTask} />}
            </div>
            {tasks.length === 0 ? (
              <p>Nenhuma tarefa nesta lista.</p>
            ) : (
              <div className="task-cards-container">
                {tasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'collaborators' && isOwner && (
          <div className="collaborator-invite">
            <h3>Convidar Colaborador</h3>
            <Input
              label="Email do Colaborador"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button onClick={handleInviteCollaborator} disabled={isInviting}>
              {isInviting ? 'Convidando...' : 'Convidar'}
            </Button>
            {inviteError && <p className="error-message">{inviteError}</p>}
          </div>
        )}
         <div className='btn-dashboard'>
          <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </main>
      <MusicPlayer /> 
    </div>
  );
};

export default TaskListPage;