import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { onValue, ref } from "firebase/database";
import "./tasks-page.css";
import Tasks from "../Dashboard/ToDos/Tasks";
import Header from "../../components/Header/Header";

function TasksPage() {
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

  const fName = userData ? userData.firstName : "";

  return (
    <>
      {user && userData && (
        <>
          <div className="tasks-page-content">
            {/* Header */}
            <div className="tasks-header-wrapper">
              <Header header={fName} />
            </div>

            {/* Tasks Section */}
            <div className="tasks-page-wrapper">
              <Tasks />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default TasksPage;
