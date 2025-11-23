import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { onValue, ref, push } from "firebase/database";
import { NavLink } from "react-router";
import "./dashboard.css";
import Notes from "./Notes/Notes";
import Tasks from "./ToDos/Tasks";
import Header from "../../components/Header/Header";
import Cards from "./Cards/Cards";
import RecentProjects from "./Projects/RecentProjects/RecentProjects";

function Dashboard() {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTargetDate, setProjectTargetDate] = useState("");
  const [projectFolderColor, setProjectFolderColor] = useState("#3b82f6");
  const [projectTitleError, setProjectTitleError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);

        {
          /* Gets the user info from database */
        }
        onValue(ref(db, `users/${u.uid}`), (snapshot) => {
          setUserData(snapshot.val());
        });
      }
    });
  }, []);

  function checkProjectTitle(e) {
    let title = e.target.value;
    setProjectTitle(title);

    if (title.trim().length > 0 && title.trim().length <= 3) {
      setProjectTitleError("Title must be more than 3 characters long");
    } else if (title.trim().length >= 100) {
      setProjectTitleError("Title cannot exceed 100 characters");
    } else {
      setProjectTitleError("");
    }
  }

  function handleAddProject() {
    if (!projectTitle.trim()) {
      alert("Please enter a project title");
      return;
    }

    const getDate = new Date().toISOString().split("T")[0];

    push(ref(db, `users/${user.uid}/projects`), {
      title: projectTitle.trim(),
      description: projectDescription.trim(),
      targetDate: projectTargetDate || null,
      folderColor: projectFolderColor,
      createdAt: getDate,
      status: "pending",
    })
      .then(() => {
        alert("Project added successfully!");
        handleCancelAddProject();
      })
      .catch((error) => {
        console.log("Error adding project: " + error.message);
        alert("Failed to add project. Please try again.");
      });
  }

  function handleCancelAddProject() {
    setProjectTitle("");
    setProjectDescription("");
    setProjectTargetDate("");
    setProjectFolderColor("#3b82f6");
    setProjectTitleError("");
    setShowAddProjectModal(false);
  }

  return (
    <>
      {user && userData && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-content">
            {/* Row 1: Dashboard Header (Full Width) */}
            <div className="header-wrapper">
              <Header
                header={userData?.firstName || user?.displayName || "User"}
                onAddProjectClick={() => setShowAddProjectModal(true)}
              />
            </div>

            {/* Row 1: Dashboard Header (Full Width) */}
            <div className="cards-wrapper">
              <Cards />
            </div>

            {/* Row 2: Projects (Full Width) */}
            <div className="projects-wrapper">
              <RecentProjects />
            </div>

            {/* Row 2: Tasks & Notes (2 Columns) */}
            <div className="bottom-row">
              <div className="tasks-wrapper">
                <Tasks />
              </div>

              <div className="notes-wrapper">
                <Notes />
              </div>
            </div>
          </div>

          {/* Add Project Modal */}
          {showAddProjectModal && (
            <div className="modal-overlay" onClick={handleCancelAddProject}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Add New Project</h3>

                <div className="form-container">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      placeholder="Enter project title"
                      value={projectTitle}
                      onChange={(e) => checkProjectTitle(e)}
                      required
                    />
                    {projectTitleError && (
                      <p className="error-message">{projectTitleError}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter project description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Completion Date</label>
                    <input
                      type="date"
                      value={projectTargetDate}
                      onChange={(e) => setProjectTargetDate(e.target.value)}
                      min={today}
                    />
                  </div>

                  <div className="form-group">
                    <label>Folder Color</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={projectFolderColor}
                        onChange={(e) => setProjectFolderColor(e.target.value)}
                        className="color-picker"
                      />
                      <span
                        className="color-preview"
                        style={{ backgroundColor: projectFolderColor }}
                      >
                        {" "}
                        {projectFolderColor}{" "}
                      </span>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      onClick={handleCancelAddProject}
                      className="cancel-btn"
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                    <button onClick={handleAddProject} className="save-btn">
                      {" "}
                      Add Project{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Dashboard;
