import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import ErrorBoundary from "./components/error_boundary";
import LoadingSpinner from "./components/loading";

const Home = lazy(() => import("./routes/Home"));
const Todos = lazy(() => import("./routes/todos"));
const TodoDetails = lazy(() => import("./routes/todo_page"));
const NotFound = lazy(() => import("./routes/not_found"));
const ErrorTest = lazy(() => import("./routes/error_test"));

function App() {
  return (
    <>
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
    </>
  );
}

export default App;

