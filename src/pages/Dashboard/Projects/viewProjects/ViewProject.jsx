import { useEffect, useState } from "react";
import "./view-project.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase-config";
import { onValue, ref, update } from "firebase/database";
import { NavLink } from "react-router";
import AddProject from "../addProjects/AddProject";
import VPAddTodo from "./vpAddToDo/VPAddToDo";

function ViewProject() {
  const [projects, setProjects] = useState(null);
  const [user, setUser] = useState(null);
  const [openTodos, setOpenTodos] = useState({}); // Track which project's todos are open]
  
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        // Gets the projects info from database
        onValue(ref(db, `users/${u.uid}/projects`), (snapshot) => {
          setProjects(snapshot.val());
        });
      }
    });


  }, []);

  // Toggle todos dropdown for a specific project
  const toggleTodos = (projectKey) => {
    setOpenTodos((prev) => ({
      ...prev,
      [projectKey]: !prev[projectKey],
    }));
  };

  function handleStatus(projectKey) {
    update(ref(db, `users/${user.uid}/projects/${projectKey}`), {status: 'completed'})
      .then(() => {
        alert("Project marked as done!");
      })
      .catch((error) => {
        console.log("Error updating project status: " + error.message);
      });
  }

  return (
    <div className="project-container">

      <NavLink to="/dashboard"><button className="back-btn"><i className="fa fa-chevron-left"></i> Return</button></NavLink>

      <div className="project-header">

        <div>
          <h1>Your Projects</h1>
        </div>

        <div>
          {user && <AddProject />}
        </div>

      </div>
      <div className="project-list">

        {projects ? ( Object.keys(projects).filter(key => projects[key].status !== "completed").map((key) => (
            <div key={key} className="project-item">

              <div className="project-icon">

                <div className="project-header">
                  
                  <div>
                    <h3>{projects[key].title} {projects[key].targetDate < today && (<span className="overdue-text">(Overdue)</span>)}</h3>
                  </div>
                  <div>
                    <button onClick={()=>handleStatus(key)}><i className="fa fa-check"></i> Mark as Done</button>
                    {user && <VPAddTodo />}
                  </div>

                </div>
                <i className="fa fa-folder" style={{color: projects[key].folderColor || "#888", fontSize: "3rem"}}></i>
              </div>

                <p>Description: {projects[key].description}</p>
                <p>Date Created: {projects[key].createdAt}</p>
                <p>Target Date: {projects[key].targetDate}</p>
                <p>Status: <span className={`status-${projects[key].status}`}> {projects[key].status.charAt(0).toUpperCase() + projects[key].status.slice(1)}</span></p>

              {/* Todos Dropdown Button */}
              <div className="todos-section">
                <button className="todos-toggle-btn" onClick={() => toggleTodos(key)}>Tasks<i className={`fa fa-chevron-${openTodos[key] ? "up" : "down" }`}></i></button>

                {/* Todos List - only shows when open */}
                {openTodos[key] && (
                  <div className="todos-list">
                    {projects[key].todos ? (Object.keys(projects[key].todos).map((todoKey) => (

                        <div key={todoKey} className="todo-item">
                            <p> - {projects[key].todos[todoKey].title} {projects[key].todos[todoKey].due < today && projects[key].todos[todoKey].status !== "completed" && (<span className="overdue-text">(Overdue)</span>)} <i className="fa fa-calendar"></i> {projects[key].todos[todoKey].due} Status:
                            <span className={`status-${projects[key].todos[todoKey].status}`}> {projects[key].todos[todoKey].status.charAt(0).toUpperCase() + projects[key].todos[todoKey].status.slice(1)}</span></p>
                        </div>
                      ))
                    ) : (<p className="no-todos">No tasks yet for this project.</p> )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (<p>No projects found. Add a new project!</p>)}
      </div>
    </div>
  );
}

export default ViewProject;