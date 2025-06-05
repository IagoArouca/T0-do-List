import React from 'react';
import './Input.css';

const Input = ({ label, type = 'text', id, name, value, onChange, className = '', ...rest }) => {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`input ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;