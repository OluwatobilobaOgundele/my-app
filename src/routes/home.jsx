import React from "react";
import "../styles/home.css"
import LoadingSpinner from "../components/loading";

const Home = () => {
  
  return (
    <section>
      <div>
        <img src="../assets/t3.png" alt="Todo image" />
      </div>
    <section className="container">
      <h1>Welcome to the Todo App</h1>
      <p>Manage your tasks efficiently!</p>
      <LoadingSpinner/>
    </section>
    </section>
  );
};

export default Home;


