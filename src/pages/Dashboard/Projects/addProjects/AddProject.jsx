import { useState } from "react";
import "./add-project.css";
import { push, ref } from "firebase/database";
import { auth, db } from "../../../../firebase-config";
import { NavLink } from "react-router";

function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [folderColor, setFolderColor] = useState("#000000");

  function handleAddProject() {
    const user = auth.currentUser; 
    if (!user) {
      alert("You must be logged in to add a project");
      return;
    }

    const getDate = new Date().toISOString().split("T")[0];

    push(ref(db, `users/${user.uid}/projects`), {
      title: title,
      description: description,
      targetDate: targetDate,
      folderColor: folderColor,
      createdAt: getDate,
    })
      .then(() => {
        alert("Project added successfully!");
        setTitle("");
        setDescription("");
        setTargetDate("");
        setFolderColor("#000000");
        window.location.href = `/final-project/view-project`;
      })
      .catch((error) => {
        console.log("Error adding project: " + error.message);
      });
  }

  const user = auth.currentUser; // for Return button link

  return (
    <div className="add-project-container">
      <div className="add-project-card">
        <h2>Add New Project</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Target Date to finish the project: </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />

        <label>Folder Color: </label>
        <input
          type="color"
          value={folderColor}
          onChange={(e) => setFolderColor(e.target.value)}
        />

        <button onClick={handleAddProject}>Add Project</button>

        {user && (
          <NavLink to={`/view-project`}>
            <button className="return-btn">Return to Projects</button>
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default AddProject;
