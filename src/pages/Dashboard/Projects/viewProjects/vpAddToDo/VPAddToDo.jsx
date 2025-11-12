import { useEffect, useState } from "react";
import { ref, push, onValue } from "firebase/database";
import "./vp-add-to-do.css";
import { auth, db } from "../../../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

function VPAddTodo() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [due, setDue] = useState("");
  const [project, setProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        {
          /* Retrieve projects from the database */
        }
        onValue(ref(db, `users/${u.uid}/projects`), (snapshot) => {
          setProject(snapshot.val());
        });
      }
    });
  }, []);

  function handleSubmit() {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to add a task");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!selectedProject) {
      alert("Please select a project before adding a task");
      return;
    }

    const getDate = new Date().toISOString().split("T")[0];

    push(ref(db, `users/${user.uid}/projects/${selectedProject}/todos`), {
      title: title.trim(),
      status: status,
      due: due || null,
      createdAt: getDate,
    })
      .then(() => {
        alert("Task added successfully!");
        handleCancel();
      })
      .catch((error) => {
        console.log("Error adding task: " + error.message);
        alert("Failed to add task. Please try again.");
      });
  }

  function handleCancel() {
    setTitle("");
    setStatus("pending");
    setDue("");
    setSelectedProject("");
    setShowModal(false);
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="add-task-btn">
        <i className="fa fa-plus"></i>
        Add Task
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Task</h3>

            <div className="form-container">
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Add task description" rows={3} />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
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
                <label>Select Project</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  required
                >
                  <option value="">-- Select project --</option>
                  {project &&
                    Object.keys(project)
                      .filter((key) => project[key].status !== "completed")
                      .map((key) => (
                        <option key={key} value={key}>
                          {project[key].title}
                        </option>
                      ))}
                </select>
              </div>

              <div className="modal-actions">
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="save-btn">
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VPAddTodo;
