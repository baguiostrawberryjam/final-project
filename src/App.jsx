import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { onValue, ref } from "firebase/database";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/dashboard/Dashboard"
import Login from "./pages/login/Login";
import Register from "./pages/register/Register"
import EditProfile from "./pages/setup/editProfile/EditProfile";
import AddToDo from "./pages/dashboard/todos/addToDo/AddToDo";
import EditToDo from "./pages/dashboard/todos/editToDo/EditToDo";
import './App.css';


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
    <BrowserRouter basename="/final-project">
      <Routes>
        {user && isAdmin && (
          <>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
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
            <Route path="/add-todo" element={<AddToDo />} />
            <Route path="/edit-todo/:id" element={<EditToDo />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;