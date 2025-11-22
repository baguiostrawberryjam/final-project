import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { NavLink } from "react-router";
import "./project.css"

function Projects() {
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
          <h2>Projects</h2>
          <NavLink to={`/project`}>
            <button className="view-all-btn">View All Projects</button>
          </NavLink>
        </div>

        <div className='project-grid'>
          {projects ? Object.keys(projects)
            .filter(key => projects[key].status !== 'completed')
            .map((key) => (
              <div key={key} className='project-card'>
                <div className="project-card-header">
                  <i
                    className="fa fa-folder"
                    style={{ color: projects[key].folderColor || '#3b82f6', fontSize: '2rem' }}
                  />
                  <h3>{projects[key].title} {projects[key].targetDate < today && (<span className="overdue-text">(Overdue)</span>)}</h3>
                </div>
                <p className="project-description">{projects[key].description}</p>
                <p className="project-date">Created: {projects[key].createdAt}</p>
              </div>
            )) : <p className="empty-state">No projects found. Add a new project!</p>}
        </div>
      </div>
    </div>
  )
}

export default Projects;
