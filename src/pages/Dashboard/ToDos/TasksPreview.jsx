import React, { useEffect, useState } from "react";
import "./tasks.css";
import { onValue, ref, update } from "firebase/database";
import { auth, db } from "../../../firebase-config";
import { useNavigate } from "react-router";

function TasksPreview() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      onValue(ref(db, `users/${user.uid}/todos`), (snapshot) => {
        setTasks(snapshot.val());
      });
    }
  }, [user]);

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

  const filteredTasks = tasks
    ? Object.keys(tasks)
        .filter((taskKey) => tasks[taskKey].status !== "deleted")
        .filter(
          (taskKey) =>
            statusFilter === "all" || tasks[taskKey].status === statusFilter
        )
        .slice(0, 5) // Show only 5 tasks in preview
    : [];

  return (
    <div className="tasks-preview">
      <div className="preview-header">
        <h2>Tasks List</h2>
        <button onClick={() => navigate("/task")} className="view-all-btn">
          View All Tasks
        </button>
      </div>
      <div className="filter-container">
        <label>Filter by Status: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="complete">Completed</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
        </select>
      </div>
      <div className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((taskKey) => (
            <div key={taskKey} className="tasks-card">
              <div className="card-header">
                <h3>
                  {tasks[taskKey].title}{" "}
                  {tasks[taskKey].due < today && (
                    <span className="overdue-text">(Overdue)</span>
                  )}
                </h3>
                <div className="card-actions">
                  <button
                    onClick={() => handleDelete(taskKey)}
                    className="delete-btn"
                    title="Delete task"
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
              <p className="tasks-description">{tasks[taskKey].description}</p>
              <p>
                Status:{" "}
                <span className={`status-${tasks[taskKey].status}`}>
                  {" "}
                  {tasks[taskKey].status.charAt(0).toUpperCase() +
                    tasks[taskKey].status.slice(1)}
                </span>
              </p>
              {tasks[taskKey].due && (
                <p className="tasks-due">Due: {tasks[taskKey].due}</p>
              )}
              <p className="tasks-date">
                Created: {tasks[taskKey].dateCreated}
              </p>
            </div>
          ))
        ) : (
          <p className="empty-state">No tasks yet.</p>
        )}
      </div>
    </div>
  );
}

export default TasksPreview;
