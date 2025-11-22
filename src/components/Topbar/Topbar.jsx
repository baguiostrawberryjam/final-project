import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { auth, db } from '../../firebase-config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import "./topbar.css";

function Topbar() {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u) {
        onValue(ref(db, `users/${u.uid}`), (snapshot) => {
          setUserData(snapshot.val());
        });
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = () => signOut(auth);

  // ⛔ FIX 1: Wait until Firebase loads
  if (user === undefined) {
    return (
      <header className="topbar">
        <div className="topbar-right">
          <div className="topbar-user-profile loading-skeleton"></div>
        </div>
      </header>
    );
  }

  // ⛔ FIX 2: No user = nothing to show
  if (!user) return null;

  // User is loaded → safe to use fields
  const firstName = userData?.firstName || "User";
  const lastName = userData?.lastName || "";
  const email = user?.email || "loading…";

  const avatarURL =
    userData?.profileURL ||
    `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}&background=1F2937&color=F9FAFB`;

  return (
    <header className="topbar">
      <div className="topbar-left"></div>

      <div className="topbar-right">
        <NavLink to="/profile" className="topbar-user-profile">
          <div className="topbar-avatar-wrapper">
            <img className="topbar-avatar" src={avatarURL} alt="" />
          </div>

          <div className="topbar-user-info">
            <span className="topbar-user-name">
              {firstName} {lastName}
            </span>

            {/* ⛔ FIX 3: This will NOT crash now */}
            <span className="topbar-user-email">{email}</span>
          </div>
        </NavLink>

        <button onClick={logOut} className="topbar-logout-btn">Sign Out</button>
      </div>
    </header>
  );
}

export default Topbar;
