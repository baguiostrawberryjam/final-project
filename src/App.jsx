import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { onValue, ref } from "firebase/database";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Setup from "./pages/Setup/Setup";
import "./App.css";
import "./components/styles/main.css";
import Profile from "./pages/Profile/Profile";
import AddProject from "./pages/Dashboard/Projects/addProjects/AddProject";
import ViewProject from "./pages/Dashboard/Projects/viewProjects/ViewProject";
import LayoutWrapper from "./components/Layout/LayoutWrapper";
import Tasks from "./pages/Tasks/Tasks";
import Notes from "./pages/Notes/Notes";

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

  // ---------------------------------------------------------
  // LOADING STATE (Replaces "Connecting to server...")
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="skeleton-container">
        <div className="skeleton-card">
          {/* Skeleton Image/Header Area */}
          <div className="skeleton skeleton-img"></div>
          
          {/* Skeleton Text Lines */}
          <div 
            className="skeleton skeleton-text" 
            style={{ width: '80%', height: '2rem', marginBottom: '1.5rem' }}
          ></div>
          
          <div 
            className="skeleton skeleton-text" 
            style={{ width: '100%', height: '1rem' }}
          ></div>
          <div 
            className="skeleton skeleton-text" 
            style={{ width: '90%', height: '1rem' }}
          ></div>
          <div 
            className="skeleton skeleton-text" 
            style={{ width: '60%', height: '1rem' }}
          ></div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN APP ROUTES
  // ---------------------------------------------------------
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
            {/* Main Pages*/}
            <Route
              path="/dashboard"
              element={
                <LayoutWrapper>
                  <Dashboard />
                </LayoutWrapper>
              }
            />
            <Route
              path="/project/"
              element={
                <LayoutWrapper>
                  <ViewProject />
                </LayoutWrapper>
              }
            />
            <Route
              path="/task"
              element={
                <LayoutWrapper>
                  <div style={{ padding: "2rem" }}>
                    <Tasks />
                  </div>
                </LayoutWrapper>
              }
            />
            <Route
              path="/notes"
              element={
                <LayoutWrapper>
                  <div style={{ padding: "2rem" }}>
                    <Notes />
                  </div>
                </LayoutWrapper>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />

            {/* Ibang Components */}
            <Route path="/profile" element={<LayoutWrapper><Profile/></LayoutWrapper>}/>
            <Route
              path="/add-project/:id"
              element={
                <LayoutWrapper>
                  <AddProject />
                </LayoutWrapper>
              }
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;