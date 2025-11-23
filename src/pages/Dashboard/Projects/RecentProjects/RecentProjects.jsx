import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { NavLink } from "react-router";
import "./recent-projects.css";
import ProjectDetailsModal from "../../Projects/viewProjects/ProjectDetailsModal";

function RecentProjects() {
  const [projects, setProjects] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onValue(ref(db, `users/${user.uid}/projects`), (snapshot) => {
          setProjects(snapshot.val());

          // Fetch task counts for each project
          const projectsData = snapshot.val();
          if (projectsData) {
            const counts = {};
            Object.keys(projectsData).forEach((projectKey) => {
              onValue(
                ref(db, `users/${user.uid}/projects/${projectKey}/todos`),
                (taskSnapshot) => {
                  counts[projectKey] = taskSnapshot.exists()
                    ? Object.keys(taskSnapshot.val()).length
                    : 0;
                  setTaskCounts({ ...counts });
                }
              );
            });
          }
        });
      }
    });
  }, []);

  return (
    <>
      <div className="project-section">
        <div className="project-container">
          <div className="project-header">
            <h2>Recent Projects</h2>
            <NavLink to={`/project`}>
              <button className="view-all-btn">View All</button>
            </NavLink>
          </div>

          <div className="project-grid">
            {projects ? (
              Object.keys(projects)
                .filter((key) => projects[key].status !== "completed")
                .slice(0, 3)
                .map((key) => (
                  <div
                    key={key}
                    className="project-card"
                    onClick={() => setSelectedProject(projects[key])}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="project-card-header">
                      <div
                        className="project-color-line"
                        style={{
                          backgroundColor:
                            projects[key].folderColor || "#3b82f6",
                        }}
                      />
                      <div className="title-container">
                        <h3>
                          {projects[key].title}{" "}
                          {projects[key].targetDate < today && (
                            <span className="overdue-text">(Overdue)</span>
                          )}
                        </h3>
                        <p className="project-description">
                          {projects[key].description}
                        </p>
                      </div>
                    </div>

                    <div className="project-footer">
                      <p className="project-date">
                        Due Date: {projects[key].targetDate}
                      </p>
                      <p className="project-task-count">
                        {taskCounts[key] || 0} Tasks
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <p className="empty-state">
                No projects found. Add a new project!
              </p>
            )}
          </div>
        </div>
      </div>
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

export default RecentProjects;
