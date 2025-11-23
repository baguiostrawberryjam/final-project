import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { onValue, ref } from "firebase/database";
import "./notes-page.css";
import Notes from "../Dashboard/Notes/Notes";
import Header from "../../components/Header/Header";

function NotesPage() {
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
          <div className="notes-page-content">
            {/* Header */}
            <div className="notes-header-wrapper">
              <Header header={fName} />
            </div>

            {/* Notes Section */}
            <div className="notes-page-wrapper">
              <Notes />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default NotesPage;
