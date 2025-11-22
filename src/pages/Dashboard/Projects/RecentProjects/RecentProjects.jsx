import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { NavLink } from "react-router";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./recent-projects.css"

function RecentProjects() {
  const [projects, setProjects] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onValue(ref(db, `users/${user.uid}/projects`), (snapshot) => {
          setProjects(snapshot.val());
        });
      }
    });
  }, []);

  return (
    <div className='project-section'>
      <div className='project-container'>
        <div className='project-header'>
          <h2>Recent Projects</h2>
          <NavLink to={`/project`}>
            <button className="view-all-btn">View All Projects</button>
          </NavLink>
        </div>

        <div className="project-grid">
          {projects ? (
            Object.keys(projects)
              .filter(key => projects[key].status !== "completed")
              .map(key => (
                <ProjectCard
                  key={key}
                  project={projects[key]}
                  today={today}
                />
              ))
          ) : (
            <p className="empty-state">No projects found. Add a new project!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentProjects;
