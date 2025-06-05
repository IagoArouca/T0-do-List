import React, { useState } from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import './TaskListForm.css';

const TaskListForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-list-form">
      <Input
        label="Nome da Lista"
        type="text"
        id="task-list-name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="form-actions">
        <Button type="submit">Criar</Button>
        <Button onClick={onCancel} className="cancel-button">Cancelar</Button>
      </div>
    </form>
  );
};

export default TaskListForm;