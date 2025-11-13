import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { onValue, ref } from "firebase/database";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import EditProfile from "./pages/Setup/editProfile/EditProfile";
import Setup from "./pages/Setup/Setup";
import "./App.css";
import "./components/styles/main.css";
import Profile from "./pages/Profile/Profile";
import AddProject from "./pages/Dashboard/Projects/addProjects/AddProject";
import ViewProject from "./pages/Dashboard/Projects/viewProjects/ViewProject";
import VPAddTodo from "./pages/Dashboard/Projects/viewProjects/vpAddToDo/VPAddToDo";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);

        // Check if user is admin
        const adminCheck = u.email === "admin@gmail.com";
        setIsAdmin(adminCheck);

        // Check if the user has complete info in Realtime DB
        const userRef = ref(db, `/users/${u.uid}`);
        onValue(userRef, (snapshot) => {
          setHasData(snapshot.exists());
          setLoading(false); // Set loading to false after DB check completes
        });
      } else {
        setUser(null);
        setIsAdmin(false);
        setHasData(false);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <h1>Connecting to server...</h1>;
  }

  return (
    <BrowserRouter basename="/final-project/">
      <Routes>
        {user && isAdmin && (
          <>
            {/* Admin Routes */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<AdminDashboard />} />
          </>
        )}

        {!user && (
          <>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {user && !isAdmin && !hasData && (
          <>
            {/* User setup routes */}
            <Route path="/setup" element={<Setup />} />
            <Route path="*" element={<Navigate to="/setup" />} />
          </>
        )}

        {user && !isAdmin && hasData && (
          <>
            {/* User dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-project/:id" element={<AddProject />} />
            <Route path="/view-project/" element={<ViewProject />} />
            <Route path="/view-project/add-todo/:projectKey"element={<VPAddTodo />}/>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
