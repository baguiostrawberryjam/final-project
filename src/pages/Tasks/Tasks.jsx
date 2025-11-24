import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { NavLink } from "react-router";
import "./tasks.css";
import { onValue, push, ref, update } from "firebase/database";
import { auth, db } from "../../firebase-config";

function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [due, setDue] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const user = auth.currentUser;

  useEffect(() => {
    onValue(ref(db, `users/${user.uid}/todos`), (snapshot) => {
      setTasks(snapshot.val());
    });
  }, [user.uid]);

  useEffect(() => {
    onValue(ref(db, `users/${user.uid}/projects`), (snapshot) => {
      const projectsData = snapshot.val();
      setProjects(projectsData ? projectsData : {});
    });
  }, [user.uid]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownOpen && !event.target.closest(".filter-container")) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterDropdownOpen]);

  function checkTitle(e) {
    let title = e.target.value;
    setTitle(title);

    if (title.trim().length > 0 && title.trim().length <= 3) {
      setTitleError("Title must be more than 3 characters long");
    } else if (title.trim().length >= 100) {
      setTitleError("Title cannot exceed 100 characters");
    } else {
      setTitleError("");
    }
  }

  function handleSubmit() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status: status,
      due: due || null,
      dateCreated: today,
      deletedAt: "",
    };

    const taskPath = projectId
      ? `users/${user.uid}/projects/${projectId}/todos`
      : `users/${user.uid}/todos`;

    push(ref(db, taskPath), taskData)
      .then(() => {
        alert("Task added successfully!");
        setTitle("");
        setDescription("");
        setStatus("pending");
        setDue("");
        setProjectId("");
        setShowModal(false);
      })
      .catch((error) => {
        console.log("Error adding task: " + error.message);
        alert("Failed to add task. Please try again.");
      });
  }

  function handleEdit(taskKey) {
    const task = tasks[taskKey];
    setEditingTaskId(taskKey);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setDue(task.due || "");
    setProjectId(task.projectId || "");
    setShowEditModal(true);
  }

  function handleUpdate() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const updateData = {
      title: title.trim(),
      description: description.trim(),
      status: status,
      due: due || null,
    };

    const updatePath = projectId
      ? `users/${user.uid}/projects/${projectId}/todos/${editingTaskId}`
      : `users/${user.uid}/todos/${editingTaskId}`;

    update(ref(db, updatePath), updateData)
      .then(() => {
        alert("Task updated successfully!");
        setTitle("");
        setDescription("");
        setStatus("pending");
        setDue("");
        setProjectId("");
        setEditingTaskId(null);
        setShowEditModal(false);
      })
      .catch((error) => {
        console.log("Error updating task: " + error.message);
        alert("Failed to update task. Please try again.");
      });
  }

  function handleCancel() {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDue("");
    setProjectId("");
    setShowModal(false);
  }

  function handleEditCancel() {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDue("");
    setProjectId("");
    setEditingTaskId(null);
    setShowEditModal(false);
  }

  function handleDelete(todoId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      update(ref(db, `users/${user.uid}/todos/${todoId}`), {
        status: "deleted",
        deletedAt: new Date().toISOString(),
      })
        .then(() => {
          alert("Task item deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          alert("Failed to delete task. Please try again.");
        });
    }
  }

  return (
    

    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Priority Tasks</h2>

        <div className="button-container">
          <div className="filter-container">
            <button
              className="filter-btn"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <Filter size={16} />
              Filter by Status
              <ChevronDown
                size={16}
                className={filterDropdownOpen ? "open" : ""}
              />
            </button>
            {filterDropdownOpen && (
              <div className="filter-dropdown">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setFilterDropdownOpen(false);
                  }}
                  className={statusFilter === "all" ? "active" : ""}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("complete");
                    setFilterDropdownOpen(false);
                  }}
                  className={statusFilter === "complete" ? "active" : ""}
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("pending");
                    setFilterDropdownOpen(false);
                  }}
                  className={statusFilter === "pending" ? "active" : ""}
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("ongoing");
                    setFilterDropdownOpen(false);
                  }}
                  className={statusFilter === "ongoing" ? "active" : ""}
                >
                  On-going
                </button>
              </div>
            )}
          </div>
          <button onClick={() => setShowModal(true)} className="add-note-btn">
            <Plus size={15} />
            New Task
          </button>
        </div>
      </div>
      <div className="tasks-wrapper">
      <div className="tasks-scroll-wrapper">
        <div className="tasks-grid">
          {tasks ? (
            Object.keys(tasks)
              .filter((taskKey) => tasks[taskKey].status !== "deleted")
              .filter(
                (taskKey) =>
                  statusFilter === "all" ||
                  tasks[taskKey].status === statusFilter
              )
              .map((taskKey) => {
                const task = tasks[taskKey];
                const isOverdue = task.due && task.due < today;
                const statusDisplay = task.status === "ongoing"
                  ? "On-going" 
                  : task.status.charAt(0).toUpperCase() + task.status.slice(1);

                return (
                  <div
                    key={taskKey}
                    className="tasks-card"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="task-content-left">
                      <div className="task-title">{task.title}</div>
                      <div
                        className="task-description"
                        title={task.description || ""}
                      >
                        {task.description
                          ? task.description.length > 60
                            ? task.description.substring(0, 60) + "..."
                            : task.description
                          : "-"}
                      </div>
                      <div className="overdue-badge-container">
                        {isOverdue && (
                          <div className="overdue-badge">Overdue</div>
                        )}
                      </div>
                      <div className={`status-badge status-${task.status}`}>
                        {statusDisplay}
                      </div>
                      <div className="task-due-date-container">
                        {task.due && (
                          <div className="task-due-date">
                            <Calendar size={14} />
                            {task.due}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="actions-cell">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(taskKey);
                        }}
                        className="edit-btn"
                        title="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(taskKey);
                        }}
                        className="delete-btn"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="empty-state">
              No tasks yet. Click the + button to add one!
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="tasks-modal-overlay">
          <div className="tasks-modal-content">
            <h3>Create New Task</h3>
            <div className="form-container">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => checkTitle(e)}
                  placeholder="Enter Task Title"
                  minLength={3}
                  maxLength={100}
                  required
                />
                {titleError && <p className="error-message">{titleError}</p>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Enter Task Description"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="ongoing">On-going</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  min={today}
                />
              </div>
              <div className="form-group">
                <label>Project (Optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">No Project</option>
                  {projects &&
                    Object.keys(projects)
                      .filter((key) => projects[key].status !== "completed")
                      .map((key) => (
                        <option key={key} value={key}>
                          {projects[key].title}
                        </option>
                      ))}
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleCancel} className="tasks-cancel-btn">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="tasks-save-btn">
                  Save Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div
          className="tasks-detail-modal-overlay"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="tasks-detail-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="tasks-detail-modal-close-btn"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-title-section">
                <i className="fa fa-check-square"></i>
                <h2>{selectedTask.title}</h2>
                {selectedTask.due < today && (
                  <span className="overdue-badge">Overdue</span>
                )}
              </div>
            </div>

            <div className="modal-body">
              {selectedTask.description && (
                <div className="modal-section">
                  <h3 className="section-title">Description</h3>
                  <p className="section-content">{selectedTask.description}</p>
                </div>
              )}

              <div className="modal-section">
                <h3 className="section-title">Task Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span
                      className={`status-badge status-${selectedTask.status}`}
                    >
                      {selectedTask.status === "ongoing"
                        ? "On-going"
                        : selectedTask.status.charAt(0).toUpperCase() +
                          selectedTask.status.slice(1)}
                    </span>
                  </div>
                  {selectedTask.due && (
                    <div className="detail-item">
                      <span className="detail-label">Due Date</span>
                      <span className="detail-value">{selectedTask.due}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Created Date</span>
                    <span className="detail-value">
                      {selectedTask.dateCreated}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="tasks-modal-overlay">
          <div className="tasks-modal-content">
            <h3>Edit Task</h3>
            <div className="form-container">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => checkTitle(e)}
                  placeholder="Enter Task Title"
                  required
                />
                {titleError && <p className="error-message">{titleError}</p>}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Enter Task Description"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="ongoing">On-going</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Project (Optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">No Project</option>
                  {projects &&
                    Object.keys(projects)
                      .filter((key) => projects[key].status !== "completed")
                      .map((key) => (
                        <option key={key} value={key}>
                          {projects[key].title}
                        </option>
                      ))}
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleEditCancel} className="tasks-cancel-btn">
                  Cancel
                </button>
                <button onClick={handleUpdate} className="tasks-save-btn">
                  Update Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
