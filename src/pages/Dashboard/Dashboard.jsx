import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { onValue, ref } from "firebase/database";
import { NavLink } from "react-router";
import "./dashboard.css";
import Notes from "./Notes/Notes";
import Tasks from "./ToDos/Tasks";
import Header from "../../components/Header/Header";
import Cards from "./Cards/Cards";
import Projects from "./Projects/project/Project";

function Dashboard() {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [completedProjects, setCompletedProjects] = useState(0);

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

        {
          /* Gets projects */
        }
        onValue(ref(db, `users/${u.uid}/projects`), (snapshot) => {
          const projectsData = snapshot.val();
          setProjects(projectsData ? Object.values(projectsData) : []);

          {
            /* Count completed projects */
          }
          if (projectsData) {
            const completed = Object.values(projectsData).filter(
              (p) => p.status === "completed" || p.completed === true
            ).length;
            setCompletedProjects(completed);
          }
        });

        {
          /* Gets tasks */
        }
        onValue(ref(db, `users/${u.uid}/todos`), (snapshot) => {
          const tasksData = snapshot.val();
          setTasks(tasksData ? Object.values(tasksData) : []);
        });

        {
          /* Gets notes */
        }
        onValue(ref(db, `users/${u.uid}/notes`), (snapshot) => {
          const notesData = snapshot.val();
          setNotes(notesData ? Object.values(notesData) : []);
        });
      }
    });
  }, []);

  const fName = userData ? userData.firstName : "";

  return (
    <>
      {user && userData && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-content">
            {/* Row 1: Dashboard Header (Full Width) */}
            <div className="header-wrapper">
              <Header header={fName} />
            </div>

            {/* Row 1: Dashboard Header (Full Width) */}
            <div className="cards-wrapper">
              <Cards
                totalProjects={projects.length}
                totalNotes={notes.length}
                totalTasks={tasks.length}
                completedProjects={completedProjects}
              />
            </div>

            {/* Row 2: Projects (Full Width) */}
            <div className="projects-wrapper">
              <Projects />
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
        </>
      )}
    </>
  );
}

export default Dashboard;
