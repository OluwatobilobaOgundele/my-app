import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import ErrorBoundary from "./components/error_boundary";
import LoadingSpinner from "./components/loading";
import "./App.css";

// Update imports to use correct paths and consistent extensions
const Home = lazy(() => import("./components/Home"));
const Todos = lazy(() => import("./components/todos"));
const TodoDetails = lazy(() => import("./components/todo_page"));
const NotFound = lazy(() => import("./components/not_found"));
const ErrorTest = lazy(() => import("./components/error_test"));

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/todos" element={<Todos />}>
                <Route path=":id" element={<TodoDetails />} />
              </Route>
              <Route path="/error-test" element={<ErrorTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;

