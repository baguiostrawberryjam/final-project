import { useEffect, useState } from "react";
import {
  Check,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Calendar,
  Plus,
} from "lucide-react";
import "./view-project.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase-config";
import { onValue, ref, update, push } from "firebase/database";
import AddProject from "../addProjects/AddProject";

function ViewProject() {
  const [projects, setProjects] = useState(null);
  const [user, setUser] = useState(null);
  const [openTodos, setOpenTodos] = useState({}); // Track which project's todos are open
  const [selectedTodo, setSelectedTodo] = useState(null); // Track selected todo for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProjectKey, setSelectedProjectKey] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("pending");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [taskTitleError, setTaskTitleError] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

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

  // Open add task modal
  const openAddTaskModal = (projectKey) => {
    setSelectedProjectKey(projectKey);
    setShowAddTaskModal(true);
  };

  // Close add task modal
  const closeAddTaskModal = () => {
    setShowAddTaskModal(false);
    setSelectedProjectKey(null);
    setNewTaskTitle("");
    setNewTaskStatus("pending");
    setNewTaskDue("");
    setTaskTitleError("");
  };

  // Check task title validation
  const checkTaskTitle = (value) => {
    setNewTaskTitle(value);
    if (value.trim().length > 0 && value.trim().length <= 3) {
      setTaskTitleError("Title must be more than 3 characters long");
    } else if (value.trim().length >= 100) {
      setTaskTitleError("Title cannot exceed 100 characters");
    } else {
      setTaskTitleError("");
    }
  };

  // Handle add task submission
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (taskTitleError) {
      alert("Please fix the title error");
      return;
    }

    if (!selectedProjectKey) {
      alert("Project is missing");
      return;
    }

    setIsAddingTask(true);
    const createdDate = new Date().toISOString().split("T")[0];

    push(ref(db, `users/${user.uid}/projects/${selectedProjectKey}/todos`), {
      title: newTaskTitle.trim(),
      status: newTaskStatus,
      due: newTaskDue || null,
      createdAt: createdDate,
    })
      .then(() => {
        alert("Task added successfully!");
        closeAddTaskModal();
      })
      .catch((error) => {
        console.log("Error adding task: " + error.message);
        alert("Failed to add task. Please try again.");
      })
      .finally(() => {
        setIsAddingTask(false);
      });
  };

  // Open modal with selected todo
  const openTodoModal = (projectKey, todoKey, todo) => {
    setSelectedTodo({
      projectKey,
      todoKey,
      ...todo,
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

    update(
      ref(
        db,
        `users/${user.uid}/projects/${selectedTodo.projectKey}/todos/${selectedTodo.todoKey}`
      ),
      {
        status: newStatus,
      }
    )
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
      update(
        ref(
          db,
          `users/${user.uid}/projects/${selectedTodo.projectKey}/todos/${selectedTodo.todoKey}`
        ),
        {
          status: "archived",
        }
      )
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
    <div className="view-project-container">
      <div className="project-header">
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
                {/* Top section with icon, title and buttons */}
                <div className="project-top">
                  <i
                    className="fa fa-folder"
                    style={{ color: projects[key].folderColor || "#888" }}
                  ></i>

                  <div className="project-info">
                    <div className="project-title-section">
                      <h3>
                        {projects[key].title}{" "}
                        {projects[key].targetDate < today && (
                          <span className="overdue-text">(Overdue)</span>
                        )}
                      </h3>
                      <p>{projects[key].description}</p>
                    </div>

                    <div className="project-actions">
                      <button
                        className="primary-action"
                        onClick={() => handleStatus(key)}
                      >
                        <Check size={16} style={{ marginRight: 4 }} /> Mark as
                        Done
                      </button>
                      <button
                        className="secondary-action"
                        onClick={() => openAddTaskModal(key)}
                      >
                        <Plus size={16} style={{ marginRight: 4 }} /> Add Task
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project details */}
                <div className="project-details">
                  <p>
                    <strong>Created:</strong>{" "}
                    <span>{projects[key].createdAt}</span>
                  </p>
                  <p>
                    <strong>Target Date:</strong>{" "}
                    <span>{projects[key].targetDate}</span>
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-${projects[key].status}`}>
                      {projects[key].status.charAt(0).toUpperCase() +
                        projects[key].status.slice(1)}
                    </span>
                  </p>
                </div>

                {/* Todos Dropdown Button */}
                <div className="todos-section">
                  <button
                    className="todos-toggle-btn"
                    onClick={() => toggleTodos(key)}
                  >
                    Tasks
                    {openTodos[key] ? (
                      <ChevronUp size={16} style={{ marginLeft: 4 }} />
                    ) : (
                      <ChevronDown size={16} style={{ marginLeft: 4 }} />
                    )}
                  </button>

                  {/* Todos List - only shows when open */}
                  {openTodos[key] && (
                    <div className="todos-list">
                      {projects[key].todos ? (
                        Object.keys(projects[key].todos)
                          .filter(
                            (todoKey) =>
                              projects[key].todos[todoKey].status !== "archived"
                          )
                          .map((todoKey) => (
                            <div
                              key={todoKey}
                              className="todo-item"
                              onClick={() =>
                                openTodoModal(
                                  key,
                                  todoKey,
                                  projects[key].todos[todoKey]
                                )
                              }
                            >
                              <p>
                                <CheckSquare
                                  size={16}
                                  style={{ marginRight: 4 }}
                                />{" "}
                                {projects[key].todos[todoKey].title}{" "}
                                {projects[key].todos[todoKey].due < today &&
                                  projects[key].todos[todoKey].status !==
                                    "completed" && (
                                    <span className="overdue-text">
                                      (Overdue)
                                    </span>
                                  )}
                              </p>
                              <p>
                                <Calendar
                                  size={16}
                                  style={{ marginRight: 4 }}
                                />{" "}
                                {projects[key].todos[todoKey].due} | Status:
                                <span
                                  className={`status-${projects[key].todos[todoKey].status}`}
                                >
                                  {" "}
                                  {projects[key].todos[todoKey].status
                                    .charAt(0)
                                    .toUpperCase() +
                                    projects[key].todos[todoKey].status.slice(
                                      1
                                    )}
                                </span>
                              </p>
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
          <p>No projects found. Add a new project!</p>
        )}
      </div>

      {/* Modal for adding new task */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={closeAddTaskModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="modal-close" onClick={closeAddTaskModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="task-title">Task Title *</label>
                <input
                  id="task-title"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => checkTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
                {taskTitleError && (
                  <p className="error-message">{taskTitleError}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  min={today}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={closeAddTaskModal}
                disabled={isAddingTask}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={handleAddTask}
                disabled={isAddingTask}
              >
                {isAddingTask ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing todo */}
      {isModalOpen && selectedTodo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-field">
                <label>
                  <strong>Task:</strong>
                </label>
                <p>{selectedTodo.title}</p>
              </div>

              <div className="modal-field">
                <label>
                  <strong>Due Date:</strong>
                </label>
                <p>{selectedTodo.due}</p>
              </div>

              <div className="modal-field">
                <label>
                  <strong>Current Status:</strong>
                </label>
                <p className={`status-${selectedTodo.status}`}>
                  {selectedTodo.status.charAt(0).toUpperCase() +
                    selectedTodo.status.slice(1)}
                </p>
              </div>

              <div className="modal-field">
                <label>
                  <strong>Change Status:</strong>
                </label>
                <div className="status-buttons">
                  <button
                    className="status-btn pending-btn"
                    onClick={() => updateTodoStatus("pending")}
                    disabled={selectedTodo.status === "pending"}
                  >
                    Pending
                  </button>
                  <button
                    className="status-btn in-progress-btn"
                    onClick={() => updateTodoStatus("in-progress")}
                    disabled={selectedTodo.status === "in-progress"}
                  >
                    In Progress
                  </button>
                  <button
                    className="status-btn completed-btn"
                    onClick={() => updateTodoStatus("completed")}
                    disabled={selectedTodo.status === "completed"}
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
