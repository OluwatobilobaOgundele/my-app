import React, { useState } from "react";
import "../styles/modal.css";

const TaskModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [completed, setCompleted] = useState(initialData.completed || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...initialData, title, completed });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="modal-title">
      <div className="modal-content">
        <h3 id="modal-title">{initialData.id ? "Edit Todo" : "Create Todo"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              placeholder="Todo Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <button type="button" onClick={() => setCompleted(!completed)}>
            {completed ? "Mark as Incomplete" : "Mark as Complete"}
          </button>
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
