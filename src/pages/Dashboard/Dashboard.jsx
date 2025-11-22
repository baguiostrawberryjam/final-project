import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { onValue, ref } from "firebase/database";
import { NavLink } from "react-router";
import "./dashboard.css";
import NotesPreview from "./Notes/NotesPreview";
import TasksPreview from "./ToDos/TasksPreview";
import Projects from "./Projects/project/Project";

function Dashboard() {
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();

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

  return (
    <>
      {user && userData && (
        <>
          {/* Main Dashboard Content */}
          <div className="dashboard-content">
            {/* Row 1: Projects (Full Width) */}
            <div className="projects-wrapper">
              <Projects />
            </div>

            {/* Row 2: Tasks & Notes (2/3 and 1/3 Columns) */}
            <div className="bottom-row">
              <div className="tasks-section">
                <TasksPreview />
              </div>
              <div className="notes-section">
                <NotesPreview />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
