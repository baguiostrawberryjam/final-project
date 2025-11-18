import { useState } from "react";
import "./add-project.css";
import { push, ref } from "firebase/database";
import { auth, db } from "../../../../firebase-config";

function AddProject() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [folderColor, setFolderColor] = useState("#3b82f6");
  const [titleError, setTitleError] = useState('');

  const today = new Date().toISOString().split("T")[0];

  function handleAddProject() {
    const user = auth.currentUser;
    
    if (!user) {
      alert("You must be logged in to add a project");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a project title");
      return;
    }

    const getDate = new Date().toISOString().split("T")[0];

    push(ref(db, `users/${user.uid}/projects`), {
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate || null,
      folderColor: folderColor,
      createdAt: getDate,
      status: 'pending',
    })
      .then(() => {
        alert("Project added successfully!");
        handleCancel();
      })
      .catch((error) => {
        console.log("Error adding project: " + error.message);
        alert("Failed to add project. Please try again.");
      });
  }

  function handleCancel() {
    setTitle("");
    setDescription("");
    setTargetDate("");
    setFolderColor("#3b82f6");
    setShowModal(false);
  }

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

  return (
    <>
      <button onClick={() => setShowModal(true)} className="add-project-btn">
        <i className="fa fa-plus"></i>
        Add Project
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Project</h3>
            
            <div className="form-container">
              <div className="form-group">
                <label>Project Title</label>
                <input type="text" placeholder="Enter project title" value={title} onChange={(e) => checkTitle(e)} required />
                {titleError && <p className="error-message">{titleError}</p>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Enter project description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
              </div>

              <div className="form-group">
                <label>Target Completion Date</label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} min={today} />
              </div>

              <div className="form-group">
                <label>Folder Color</label>
                <div className="color-picker-wrapper">
                  <input type="color" value={folderColor}onChange={(e) => setFolderColor(e.target.value)}className="color-picker" />
                  <span className="color-preview" style={{ backgroundColor: folderColor }}> {folderColor} </span>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={handleCancel} className="cancel-btn"> Cancel </button>
                <button onClick={handleAddProject} className="save-btn"> Add Project </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProject;