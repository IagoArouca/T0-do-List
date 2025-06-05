import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const statusClass = task.isCompleted ? 'completed' : 'pending';
  const typeLabel = task.isWeekly ? 'Semanal' : task.isMonthly ? 'Mensal' : 'Única';

  return (
    <div className={`task-card ${statusClass}`}>
      <h4 className="task-title">{task.description}</h4>
      <div className="task-details">
        <span className={`task-status ${statusClass}`}>{task.isCompleted ? 'Concluída' : 'Pendente'}</span>
        <span className="task-type">Tipo: {typeLabel}</span>
      </div>
      {onUpdate && <button onClick={() => onUpdate(task._id, { ...task, isCompleted: !task.isCompleted })}>{task.isCompleted ? 'Marcar como Pendente' : 'Marcar como Concluída'}</button>}
      {onDelete && <button onClick={() => onDelete(task._id)}>Excluir</button>}
    </div>
  );
};

export default TaskCard;