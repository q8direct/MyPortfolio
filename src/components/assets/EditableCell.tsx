import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: 'text' | 'number';
  className?: string;
  step?: string;
}

export default function EditableCell({ 
  value, 
  onSave, 
  type = 'text',
  className = '',
  step
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value.toString()) {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onSave(editValue);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        step={step}
        className={`w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    );
  }

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className={`cursor-pointer ${className}`}
    >
      {value}
    </div>
  );
}