import React, { useEffect, useState } from "react";
import "./tasks.css";
import { onValue, push, ref, update } from "firebase/database";
import { auth, db } from "../../../firebase-config";

function Tasks() {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("pending");
    const [due, setDue] = useState("");
    const [description, setDescription] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [titleError, setTitleError] = useState('');
    const today = new Date().toISOString().split("T")[0];
    const user = auth.currentUser;

    useEffect(() => {
        onValue(ref(db, `users/${user.uid}/todos`), (snapshot) => {
            setTasks(snapshot.val());
        });
    }, [user.uid]);

    function checkTitle(e) {
        let title = e.target.value;
        setTitle(title);

        if (title.trim().length > 0 && title.trim().length <= 3) {
            setTitleError("Title must be more than 3 characters long");
        } else if (title.trim().length >= 100) {
            setTitleError("Title cannot exceed 100 characters");
        } else {
            setTitleError('');
        }
    }

    function handleSubmit() {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        push(ref(db, `users/${user.uid}/todos`), {
            title: title.trim(),
            description: description.trim(),
            status: status,
            due: due || null,
            dateCreated: today,
            deletedAt: "",
        })
        .then(() => {
            alert("Task added successfully!");
            setTitle("");
            setDescription("");
            setStatus("pending");
            setDue("");
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
        setShowEditModal(true);
    }

    function handleUpdate() {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        update(ref(db, `users/${user.uid}/todos/${editingTaskId}`), {
            title: title.trim(),
            description: description.trim(),
            status: status,
            due: due || null,
        })
        .then(() => {
            alert("Task updated successfully!");
            setTitle("");
            setDescription("");
            setStatus("pending");
            setDue("");
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
        setShowModal(false);
    }

    function handleEditCancel() {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setDue("");
        setEditingTaskId(null);
        setShowEditModal(false);
    }

    function handleDelete(todoId) {
        if (window.confirm('Are you sure you want to delete this task?')) {
            update(ref(db, `users/${user.uid}/todos/${todoId}`), {
                status: 'deleted',
                deletedAt: new Date().toISOString()
            })
            .then(() => {
                alert('Task item deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            });
        }
    }

    return (
        <div className="tasks-page">
            <div className="tasks-container">
                <div className="tasks-header">
                    <h2>Tasks List</h2>
                    <button onClick={() => setShowModal(true)} className="add-note-btn">
                        <i className="fa fa-plus"></i>Add Task
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
                    {tasks ? (
                        Object.keys(tasks)
                        .filter((taskKey) => tasks[taskKey].status !== "deleted") 
                        .filter((taskKey) => statusFilter === "all" || tasks[taskKey].status === statusFilter)
                        .map((taskKey) => (
                            <div key={taskKey} className="tasks-card">
                                <div className="card-header">
                                    <h3>{tasks[taskKey].title}</h3>
                                    <div className="card-actions">
                                        <button onClick={() => handleEdit(taskKey)} className="edit-btn" title="Edit task">
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(taskKey)} className="delete-btn" title="Delete task">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <p className="tasks-description">{tasks[taskKey].description}</p>
                                <p>Status:{" "} 
                                    <span className={`status-${tasks[taskKey].status}`}>
                                        {" "}{tasks[taskKey].status.charAt(0).toUpperCase() + tasks[taskKey].status.slice(1)}
                                    </span>
                                </p>
                                {tasks[taskKey].due && (<p className="tasks-due">Due: {tasks[taskKey].due}</p>)}
                                <p className="tasks-date">Created: {tasks[taskKey].dateCreated}</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty-state">No tasks yet. Click the + button to add one!</p>
                    )}
                </div>
            </div>

            {/* Add Task Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Task</h3>
                        <div className="form-container">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={title} onChange={(e) => checkTitle(e)} placeholder="Enter Task Title" minLength={3} maxLength={100} required/>
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
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleCancel} className="cancel-btn">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="save-btn">
                                    Save Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Task</h3>
                        <div className="form-container">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" value={title} onChange={(e) => checkTitle(e)} placeholder="Enter Task Title"  required/>
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
                                />
                            </div>
                            <div className="modal-actions">
                                <button onClick={handleEditCancel} className="cancel-btn">
                                    Cancel
                                </button>
                                <button onClick={handleUpdate} className="save-btn">
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