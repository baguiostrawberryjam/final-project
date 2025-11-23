import { useEffect, useState } from "react";
import "./view-project.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase-config";
import { onValue, ref, update } from "firebase/database";
import { NavLink } from "react-router";
import AddProject from "../addProjects/AddProject";
import VPAddTodo from "./vpAddToDo/VPAddToDo";
import ProjectDetailsModal from "./ProjectDetailsModal";

function ViewProject() {
  const [projects, setProjects] = useState(null);
  const [user, setUser] = useState(null);
  const [openTodos, setOpenTodos] = useState({}); // Track which project's todos are open
  const [selectedProject, setSelectedProject] = useState(null); // Track which project is selected for modal

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
    update(ref(db, `users/${user.uid}/projects/${projectKey}`), {
      status: "completed",
    })
      .then(() => {
        alert("Project marked as done!");
      })
      .catch((error) => {
        console.log("Error updating project status: " + error.message);
      });
  }

  return (
    <div className="view-project-container">
      <div className="view-projects-header">
        <div>
          <h1>Your Projects</h1>
        </div>
        <div>{user && <AddProject />}</div>
      </div>

      <div className="project-list">
        {projects ? (
          Object.keys(projects)
            .filter((key) => projects[key].status !== "completed")
            .map((key) => (
              <div key={key} className="project-item">
                <div className="project-item-header">
                  <div className="project-title-section">
                    <i
                      className="fa fa-folder"
                      style={{ color: projects[key].folderColor || "#888" }}
                    ></i>
                    <div>
                      <h3>
                        {projects[key].title}{" "}
                        {projects[key].targetDate < today && (
                          <span className="overdue-badge">(Overdue)</span>
                        )}
                      </h3>
                      <p className="project-description">
                        {projects[key].description}
                      </p>
                    </div>
                  </div>
                  <div className="project-item-actions">
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedProject(projects[key])}
                    >
                      <i className="fa fa-eye"></i> View Details
                    </button>
                    <button
                      className="mark-done-btn"
                      onClick={() => handleStatus(key)}
                    >
                      <i className="fa fa-check"></i> Mark as Done
                    </button>
                    {user && <VPAddTodo />}
                  </div>
                </div>

                <div className="project-item-details">
                  <div className="detail-row">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {projects[key].createdAt}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Target Date:</span>
                    <span className="detail-value">
                      {projects[key].targetDate}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`status-badge status-${projects[key].status}`}
                    >
                      {projects[key].status.charAt(0).toUpperCase() +
                        projects[key].status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="todos-section">
                  <button
                    className="todos-toggle-btn"
                    onClick={() => toggleTodos(key)}
                  >
                    <span>Tasks</span>
                    <i
                      className={`fa fa-chevron-${
                        openTodos[key] ? "up" : "down"
                      }`}
                    ></i>
                  </button>

                  {openTodos[key] && (
                    <div className="todos-list">
                      {projects[key].todos ? (
                        Object.keys(projects[key].todos).map((todoKey) => (
                          <div key={todoKey} className="todo-item">
                            <div className="todo-content">
                              <div className="todo-title">
                                <i className="fa fa-tasks"></i>
                                <span>
                                  {projects[key].todos[todoKey].title}
                                </span>
                                {projects[key].todos[todoKey].due < today &&
                                  projects[key].todos[todoKey].status !==
                                    "completed" && (
                                    <span className="overdue-badge">
                                      (Overdue)
                                    </span>
                                  )}
                              </div>
                              <div className="todo-meta">
                                <span className="todo-date">
                                  <i className="fa fa-calendar"></i>{" "}
                                  {projects[key].todos[todoKey].due}
                                </span>
                                <span
                                  className={`status-badge status-${projects[key].todos[todoKey].status}`}
                                >
                                  {projects[key].todos[todoKey].status
                                    .charAt(0)
                                    .toUpperCase() +
                                    projects[key].todos[todoKey].status.slice(
                                      1
                                    )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-todos">
                          No tasks yet for this project.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p className="no-projects">No projects found. Add a new project!</p>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

export default ViewProject;
