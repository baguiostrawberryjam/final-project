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
  const [openTodos, setOpenTodos] = useState({}); // Track which project's todos are open
  const [selectedTodo, setSelectedTodo] = useState(null); // Track selected todo for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  // Open modal with selected todo
  const openTodoModal = (projectKey, todoKey, todo) => {
    setSelectedTodo({
      projectKey,
      todoKey,
      ...todo
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  // Update todo status
  const updateTodoStatus = (newStatus) => {
    if (!selectedTodo) return;

    update(ref(db, `users/${user.uid}/projects/${selectedTodo.projectKey}/todos/${selectedTodo.todoKey}`), {
      status: newStatus
    })
      .then(() => {
        alert(`Task status updated to ${newStatus}!`);
        closeModal();
      })
      .catch((error) => {
        console.log("Error updating task status: " + error.message);
      });
  };

  // Delete todo (archive it)
  const deleteTodo = () => {
    if (!selectedTodo) return;

    if (window.confirm("Are you sure you want to archive this task?")) {
      update(ref(db, `users/${user.uid}/projects/${selectedTodo.projectKey}/todos/${selectedTodo.todoKey}`), {
        status: 'archived'
      })
        .then(() => {
          alert("Task archived successfully!");
          closeModal();
        })
        .catch((error) => {
          console.log("Error archiving task: " + error.message);
        });
    }
  };

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

              {/* Top section with icon, title and buttons */}
              <div className="project-top">
                <i className="fa fa-folder" style={{color: projects[key].folderColor || "#888"}}></i>
                
                <div className="project-info">
                  <div className="project-title-section">
                    <h3>{projects[key].title} {projects[key].targetDate < today && (<span className="overdue-text">(Overdue)</span>)}</h3>
                    <p>{projects[key].description}</p>
                  </div>
                  
                  <div className="project-actions">
                    <button onClick={()=>handleStatus(key)}><i className="fa fa-check"></i> Mark as Done</button>
                    {user && <VPAddTodo />}
                  </div>
                </div>
              </div>

              {/* Project details */}
              <div className="project-details">
                <p><strong>Created:</strong> <span>{projects[key].createdAt}</span></p>
                <p><strong>Target Date:</strong> <span>{projects[key].targetDate}</span></p>
                <p><strong>Status:</strong> <span className={`status-${projects[key].status}`}>{projects[key].status.charAt(0).toUpperCase() + projects[key].status.slice(1)}</span></p>
              </div>

              {/* Todos Dropdown Button */}
              <div className="todos-section">
                <button className="todos-toggle-btn" onClick={() => toggleTodos(key)}>Tasks<i className={`fa fa-chevron-${openTodos[key] ? "up" : "down" }`}></i></button>

                {/* Todos List - only shows when open */}
                {openTodos[key] && (
                  <div className="todos-list">
                    {projects[key].todos ? (Object.keys(projects[key].todos)
                      .filter(todoKey => projects[key].todos[todoKey].status !== "archived") // Filter out archived todos
                      .map((todoKey) => (
                        <div 
                          key={todoKey} 
                          className="todo-item clickable"
                          onClick={() => openTodoModal(key, todoKey, projects[key].todos[todoKey])}
                        >
                            <p><i className="fa fa-check-square"></i> {projects[key].todos[todoKey].title} {projects[key].todos[todoKey].due < today && projects[key].todos[todoKey].status !== "completed" && (<span className="overdue-text">(Overdue)</span>)}</p>
                            <p><i className="fa fa-calendar"></i> {projects[key].todos[todoKey].due} | Status:
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

      {/* Modal for editing todo */}
      {isModalOpen && selectedTodo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="modal-close" onClick={closeModal}><i className="fa fa-times"></i></button>
            </div>

            <div className="modal-body">
              <div className="modal-field">
                <label><strong>Task:</strong></label>
                <p>{selectedTodo.title}</p>
              </div>

              <div className="modal-field">
                <label><strong>Due Date:</strong></label>
                <p>{selectedTodo.due}</p>
              </div>

              <div className="modal-field">
                <label><strong>Current Status:</strong></label>
                <p className={`status-${selectedTodo.status}`}>
                  {selectedTodo.status.charAt(0).toUpperCase() + selectedTodo.status.slice(1)}
                </p>
              </div>

              <div className="modal-field">
                <label><strong>Change Status:</strong></label>
                <div className="status-buttons">
                  <button 
                    className="status-btn pending-btn"
                    onClick={() => updateTodoStatus('pending')}
                    disabled={selectedTodo.status === 'pending'}
                  >
                    Pending
                  </button>
                  <button 
                    className="status-btn in-progress-btn"
                    onClick={() => updateTodoStatus('in-progress')}
                    disabled={selectedTodo.status === 'in-progress'}
                  >
                    In Progress
                  </button>
                  <button 
                    className="status-btn completed-btn"
                    onClick={() => updateTodoStatus('completed')}
                    disabled={selectedTodo.status === 'completed'}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="delete-btn" onClick={deleteTodo}>
                <i className="fa fa-trash"></i> Archive Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProject;