

import React, { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { fetchTodos } from "../api";
import TodoModal from "../components/todo_form";
import LoadingSpinner from "../components/loading";
import "../styles/todos.css";
import Notification from "../components/prompt_message";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: "", type: "" });

const showNotification = (message, type = "success") => {
  setNotification({ message, type });
  setTimeout(() => setNotification({ message: "", type: "" }), 3000); // Auto-hide after 3 seconds
};


const fetchPage = async (page) => {
  setIsLoading(true);
  try {
    const result = await fetchTodos(page); // Pass the current page number
    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    let allTodos, totalCount;

    if (Array.isArray(result)) {
      allTodos = [...localTodos, ...result];
      totalCount = result.length; 
    } else if (typeof result === 'object' && result !== null) {
      allTodos = [...localTodos, ...result.data];
      totalCount = result.totalCount || allTodos.length;
    } else {
      throw new Error("Unexpected data format from API");
    }

    setTodos(allTodos);
    setTotalPages(Math.ceil(totalCount / 10)); // Assuming 10 todos per page
  } catch (err) {
    console.error("Error fetching todos:", err);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchPage(page);
  }, [page]);

  useEffect(() => {
    let result = todos;

    if (statusFilter === "completed") {
      result = result.filter((todo) => todo.completed);
    } else if (statusFilter === "pending") {
      result = result.filter((todo) => !todo.completed);
    }

    if (search) {
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTodos(result);
  }, [search, todos, statusFilter]);

  const handleCreate = (newTodo) => {
    newTodo.id = `local-${Date.now()}`;
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);

    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = [newTodo, ...localTodos];
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
    showNotification("Todo created successfully!", "success");
  };

  const handleEdit = (updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);

    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = localTodos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
    showNotification("Todo updated successfully!", "success");
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = localTodos.filter((todo) => todo.id !== id);
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
    showNotification("Todo deleted successfully!", "success");
  };

  const toggleStatus = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);

    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = localTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
  };

  return (
    <section className="todos-container">
      <header className="todos-header">
        <h1 className="text"><span>T</span>
          <span>a</span>
          <span>s</span>
           <span>k</span>
          
         <span> L</span>
          <span>i</span>
          <span>s</span>
          <span>t</span></h1>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search todos"
            className="search-input"
          />
          <div className="status-filter">
            <label htmlFor="status-select">Filter:</label>
            <select
              id="status-select"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
              className="status-select"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentTodo(null);
            setIsOpen(true);
          }}
          className="button create-todo-btn"
        >
          Create Todo
        </button>
      </header>

      <div className="todos-content">
        {isLoading ? (
          <LoadingSpinner/>
        ) : (
          <>
            <ul className="todos-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <Link to={`${todo.id}`} className="todo-link">
                    {todo.title}
                  </Link>
                  <div className="todo-status">
                    <span className={`status-indicator ${todo.completed ? 'completed' : 'pending'}`}>
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                   
                  </div>
                </li>
              ))}
            </ul>
            {filteredTodos.length === 0 && <p>No todos found.</p>}
          </>
        )}
      </div>

      <footer className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="button pagination-btn"
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className="button pagination-btn"
        >
          Next
        </button>
      </footer>

      <TodoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(newTodo) => {
          if (currentTodo) handleEdit(newTodo);
          else handleCreate(newTodo);
          setIsOpen(false);
        }}
        initialData={currentTodo || {}}
      />

      <Outlet context={{ handleDelete, handleEdit, toggleStatus }} />

      <Notification
      message={notification.message}
      type={notification.type}
      onClose={() => setNotification({ message: "", type: "" })}
    />
    </section>
  );
};

export default Todos;

