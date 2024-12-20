import React, { useState, useEffect, useCallback } from "react";
import { Link, Outlet} from "react-router-dom";
import { fetchTodos } from "../api";
import TodoModal from "../components/todo_form";
import LoadingSpinner from "../components/loading";
import "../styles/todos.css";
import Notification from "../components/prompt_message";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const ITEMS_PER_PAGE = 10;

const showNotification = (message, type = "success") => {
  setNotification({ message, type });
  setTimeout(() => setNotification({ message: "", type: "" }), 3000); // Auto-hide after 3 seconds
};

 // Function to get modified API todos from localStorage
 const getModifiedApiTodos = () => {
  return JSON.parse(localStorage.getItem("modifiedApiTodos")) || {};
};

// Function to save modified API todo to localStorage
const saveModifiedApiTodo = (todo) => {
  const modifiedTodos = getModifiedApiTodos();
  modifiedTodos[todo.id] = todo;
  localStorage.setItem("modifiedApiTodos", JSON.stringify(modifiedTodos));
}; 

const fetchPage = useCallback(async (pageNum) => {
  setIsLoading(true);
  try {
    const { data, totalCount } = await fetchTodos(pageNum);
    const modifiedApiTodos = getModifiedApiTodos();
    
    // Apply any modifications to API todos
    const updatedApiTodos = data.map(todo => {
      return modifiedApiTodos[todo.id] || todo;
    });

    return { apiTodos: updatedApiTodos, totalCount };
  } catch (err) {
    console.error("Error fetching todos:", err);
    return { apiTodos: [], totalCount: 0 };
  } finally {
    setIsLoading(false);
  }
}, []);

  const loadTodos = useCallback(async (currentPage) => {
    const { apiTodos, totalCount } = await fetchPage(currentPage);
    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    
    // Calculate total pages including both API and local todos
    const totalItems = totalCount + localTodos.length;
    const calculatedTotalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    setTotalPages(Math.max(1, calculatedTotalPages));

    // Determine which todos to show based on the current page
    let allTodos;
    if (currentPage === 1) {
      // First page shows local todos first, then API todos to fill up to 10 items
      const localTodosForPage = localTodos.slice(0, ITEMS_PER_PAGE);
      const remainingSpace = ITEMS_PER_PAGE - localTodosForPage.length;
      const apiTodosForPage = apiTodos.slice(0, remainingSpace);
      allTodos = [...localTodosForPage, ...apiTodosForPage];
    } else {
      // Calculate offset for API todos based on local todos count
      const localTodosPages = Math.ceil(localTodos.length / ITEMS_PER_PAGE);
      
      if (currentPage <= localTodosPages) {
        // Still showing local todos
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        allTodos = localTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      } else {
        // Showing API todos
        const apiPage = currentPage - localTodosPages;
        allTodos = apiTodos;
      }
    }

    setTodos(allTodos);
  }, [fetchPage]);

  useEffect(() => {
    loadTodos(page);
  }, [page, loadTodos]);

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
    
    // Add the new todo to localStorage
    const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
    const updatedLocalTodos = [newTodo, ...localTodos];
    localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));

    // If we're on page 1, update the current view
    if (page === 1) {
      setTodos(prev => [newTodo, ...prev].slice(0, ITEMS_PER_PAGE));
    } else {
      // Navigate to page 1 to see the new todo
      setPage(1);
    }

    showNotification("Todo created successfully!", "success");
  };

  const handleEdit = (updatedTodo) => {
    // Update the todos state
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);

    if (updatedTodo.id.startsWith('local-')) {
      // Handle local todo
      const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
      const updatedLocalTodos = localTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
    } else {
      // Handle API todo
      saveModifiedApiTodo(updatedTodo);
    }

    showNotification("Todo updated successfully!", "success");
  };

  const handleDelete = async (id) => {
    if (id.startsWith('local-')) {
      // Handle local todo deletion
      const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
      const updatedLocalTodos = localTodos.filter((todo) => todo.id !== id);
      localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
    } else {
      // Handle API todo deletion
      const modifiedApiTodos = getModifiedApiTodos();
      modifiedApiTodos[id] = { ...modifiedApiTodos[id], deleted: true };
      localStorage.setItem("modifiedApiTodos", JSON.stringify(modifiedApiTodos));
    }

    // Reload current page
    await loadTodos(page);
    showNotification("Todo deleted successfully!", "success");
  };

  const toggleStatus = (id) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;

    const updatedTodo = { 
      ...todoToToggle, 
      completed: !todoToToggle.completed 
    };

    if (id.startsWith('local-')) {
      // Handle local todo
      const localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];
      const updatedLocalTodos = localTodos.map((todo) =>
        todo.id === id ? updatedTodo : todo
      );
      localStorage.setItem("localTodos", JSON.stringify(updatedLocalTodos));
    } else {
      // Handle API todo
      saveModifiedApiTodo(updatedTodo);
    }

    // Update the todos state
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
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
          <span>t</span>
          </h1>
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
</div>
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

