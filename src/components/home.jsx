import React, { useState, useEffect } from "react";
import "../styles/home.css";
import LoadingSpinner from "../components/loading";
import { useNavigate } from "react-router-dom";
import t3Image from "../assets/t4.png";
import t2Image from "../assets/t2.png";
import t1Image from "../assets/t1.png";
import t5Image from "../assets/t5.png";


const Home = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="home">
    {showContent ? (
      <>
        <div className="images-container">
          <img src={t3Image} alt="Todo image" className="todo-image" />
          <img src={t2Image} alt="Todo image" className="todo-image" />
          <img src={t5Image} alt="Todo image" className="todo-image" />
          <img src={t1Image} alt="Todo image" className="todo-image" />
        </div>
        <section className="container">
          <h1>Welcome to the Todo App</h1>
          <p>Manage your tasks efficiently!</p>
        </section>
        <section className="quote">
          <strong>
           "A goal not written is merely a wish."<button onClick={() => navigate("/todos")} className="button">
            Go to Todos
          </button> Start jotting down your task and plans! 😊
          </strong>
         
        </section>
      </>
    ) : (
      <LoadingSpinner />
    )}
  </section>
  );
};

export default Home;
