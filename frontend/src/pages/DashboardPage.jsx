import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api.js'; 
import TaskListCard from '../components/TaskList/TaskListCard.jsx';
import TaskListForm from '../components/TaskList/TaskListForm.jsx';
import Button from '../components/UI/Button.jsx';
import MusicPlayer from '../components/MusicPlayer/MusicPlayer.jsx';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const [taskLists, setTaskLists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingLists, setLoadingLists] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskLists = async () => {
      setLoadingLists(true);
      setError(null);
      try {
        const lists = await api.getAllTasklists(); 
        setTaskLists(lists);
      } catch (err) {
        console.error('Erro ao carregar listas de tarefas:', err);
        setError(err.response?.data?.message || 'Erro ao carregar listas de tarefas.');
      } finally {
        setLoadingLists(false);
      }
    };

    fetchTaskLists();
  }, [user]); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateTaskList = async (name) => {
    try {
      const newTaskList = await api.createTasklist(name);
      setTaskLists(prevLists => [...prevLists, newTaskList]); 
      setIsCreating(false);
    } catch (err) {
      console.error('Erro ao criar lista de tarefas:', err);
      setError(err.response?.data?.message || 'Erro ao criar lista de tarefas.');
    }
  };

  const handleDeleteTaskList = async (listId) => {
    try {
      await api.deleteTasklist(listId); 
      setTaskLists(prevLists => prevLists.filter(list => list._id !== listId));
      alert('Lista de tarefas deletada com sucesso!'); 
    } catch (err) {
      console.error('Erro ao deletar lista:', err);
      setError(err.response?.data?.message || 'Erro ao deletar lista de tarefas.');
    }
  };

  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Lista de Tarefas </h1>
        <Button onClick={handleLogout}>Sair</Button>
      </header>

      <div className="dashboard-actions">
        <Button onClick={toggleCreating}
        className={isCreating ? 'cancel-button-task' : ''}>
        {isCreating ? 'X' : 'Criar Nova Lista'}
                  
        </Button>
        {isCreating && <TaskListForm onSubmit={handleCreateTaskList} onCancel={toggleCreating} />}
      </div>

      <div className="task-lists-grid">
        {loadingLists ? (
          <p>Carregando listas...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          taskLists.map(list => {
            const isOwner = user && list.owner?._id === user._id; 

            return (
              <TaskListCard
                key={list._id}
                taskList={list}
                onDelete={handleDeleteTaskList} 
                isOwner={isOwner} 
              />
            );
          })
        )}
      </div>

      <MusicPlayer />
    </div>
  );
};

export default DashboardPage;