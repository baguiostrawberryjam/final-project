import { useEffect, useState } from "react";
import "./view-project.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase-config";
import { onValue, ref } from "firebase/database";
import { NavLink } from "react-router";

function ViewProject() {
  const [projects, setProjects] = useState(null);
  const [user, setUser] = useState(null);
  const [openTodos, setOpenTodos] = useState({}); // Track which project's todos are open

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

  return (
    <div className="project-container">

      <NavLink to="/dashboard"><button className="back-btn"><i className="fa fa-chevron-left"></i> Return</button></NavLink>

      <div className="project-header">

        <div>
          <h1>Your Projects</h1>
        </div>

        <div>
          {user && (
            <NavLink to={`/add-project/${user.uid}`}><button><i className="fa fa-plus"></i></button></NavLink>
          )}
        </div>

      </div>
      <div className="project-list">

        {projects ? ( Object.keys(projects).map((key) => (

            <div key={key} className="project-item">

              <div className="project-icon">

                <div className="project-header">

                  <h3>{projects[key].title}</h3>
                  <NavLink to={`/view-project/add-todo/${key}`}> <button><i className="fa fa-plus"></i> Add Task</button></NavLink>

                </div>
                <i className="fa fa-folder" style={{color: projects[key].folderColor || "#888", fontSize: "3rem"}}></i>
              </div>

              <div>
                <p>Description: {projects[key].description}</p>
              </div>
              <div>
                <p>Date Created: {projects[key].createdAt}</p>
              </div>

              {/* Todos Dropdown Button */}
              <div className="todos-section">
                <button className="todos-toggle-btn" onClick={() => toggleTodos(key)}>Tasks<i className={`fa fa-chevron-${openTodos[key] ? "up" : "down" }`}></i></button>

                {/* Todos List - only shows when open */}
                {openTodos[key] && (
                  <div className="todos-list">
                    {projects[key].todos ? (Object.keys(projects[key].todos).map((todoKey) => (

                        <div key={todoKey} className="todo-item">
                            <p> - {projects[key].todos[todoKey].title} <i className="fa fa-calendar"></i> {projects[key].todos[todoKey].due} Status: {projects[key].todos[todoKey].status}</p>
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