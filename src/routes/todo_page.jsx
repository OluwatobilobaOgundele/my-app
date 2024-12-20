import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { fetchTodoDetails } from "../api";
import "../styles/todo_information.css"
import LoadingSpinner from "../components/loading";

const TodoDetails = () => {
  const [todo, setTodo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { handleDelete, handleEdit, toggleStatus } = useOutletContext();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setError("Invalid todo ID.");
        return;
      }

      const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
      
      if (id && id.startsWith("local-")) {
        const foundTodo = localTodos.find((todo) => todo.id === id);
        if (foundTodo) {
          setTodo(foundTodo);
          setEditedTitle(foundTodo.title);
          return;
        } else {
          setError("Local todo not found.");
          return;
        }
      }
  
      try {
        const data = await fetchTodoDetails(id);
        setTodo(data);
        setEditedTitle(data.title);
      } catch (error) {
        setError("Failed to fetch todo details. Please try again later.");
      }
    };

    fetchDetails();
  }, [id]);

  const handleDeleteAndNavigate = () => {
    handleDelete(id);
    navigate("..", { replace: true });
  };

  const handleSaveEdit = () => {
    const updatedTodo = { ...todo, title: editedTitle };
    handleEdit(updatedTodo);
    setTodo(updatedTodo);
    setIsEditing(false);


    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = localTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
  };

  const handleToggleStatus = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    toggleStatus(id);
    setTodo(updatedTodo);

    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = localTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t);
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
  };
  

  if (error) return <p>{error}</p>;
  if (!todo) return <LoadingSpinner/>;

  return (
    <section className="todo-details">
      <h2>Todo Details</h2>
      <p><strong>ID:</strong> {todo.id}</p>
      {!isEditing ? (
        <p><strong>Title:</strong> {todo.title}</p>
      ) : (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          aria-label="Edit todo title"
        />
      )}
      <p><strong>Completed:</strong> {todo.completed ? "Yes" : "No"}</p>

      <div className="todo-actions">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="button">Edit</button>
        ) : (
          <button onClick={handleSaveEdit} className="button">Save</button>
        )}
        <button onClick={handleToggleStatus} className="button">
          {todo.completed ? "Mark as Pending" : "Mark as Completed"}
        </button>
        <button onClick={handleDeleteAndNavigate} className="button button-danger">Delete</button>
        <button onClick={() => navigate("..")} className="button">Back to Todos</button>
      </div>
    </section>
  );
};

export default TodoDetails;

