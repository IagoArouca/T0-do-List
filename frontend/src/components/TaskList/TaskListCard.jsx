import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolderOpen, FaTrash } from 'react-icons/fa'; 
import './TaskListCard.css';

const TaskListCard = ({ taskList, onDelete, isOwner }) => { 
  const taskCount = taskList.tasks ? taskList.tasks.length : 0;

  const handleDeleteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (window.confirm(`Tem certeza que deseja deletar a lista "${taskList.name}" e todas as suas tarefas?`)) {
      onDelete(taskList._id); 
    }
  };

  return (
    <Link to={`/lists/${taskList._id}`} className="task-list-card-link">
      <div className="task-list-card">
        <div className="task-list-card-tab"></div>
        <div className="task-list-card-content">
          <h3 className="card-title-with-icon">
            <FaFolderOpen className="folder-icon" />
            {taskList.name}
          </h3>
          <p className="owner">Proprietário: {taskList.owner?.username || 'Desconhecido'}</p>
          {taskList.collaborators && taskList.collaborators.length > 0 && (
            <p className="collaborators">
              Colaboradores: {taskList.collaborators.map(collab => collab.username).join(', ')}
            </p>
          )}
          <p className="created-at">Criado em: {new Date(taskList.createdAt).toLocaleDateString()}</p>
          <p className="task-count">{taskCount} Tarefas</p>

          {isOwner && (
            <button
              onClick={handleDeleteClick}
              className="delete-tasklist-button" 
              title="Deletar Lista de Tarefas" 
            >
              <FaTrash /> 
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TaskListCard;