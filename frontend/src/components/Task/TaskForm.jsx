import React, { useState } from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (description.trim()) {
      onSubmit(description);
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <Input
        label="Descrição da Tarefa"
        type="text"
        id="task-description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-actions">
        <Button type="submit">Adicionar</Button>
      </div>
    </form>
  );
};

export default TaskForm;