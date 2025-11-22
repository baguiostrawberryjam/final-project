// LayoutWrapper.jsx
import { useState } from "react";
import SidebarContainer from "../Sidebar/SidebarContainer";
import MainContent from "./MainContent";
import "./layout-wrapper.css"; // Your layout styling
import Topbar from "../../components/Topbar/Topbar";

function LayoutWrapper({ children, user, userData, logOut }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout-wrapper">
      <SidebarContainer isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="main-content-container">
        <Topbar user={user} userData={userData} logOut={logOut} />
        <MainContent>{children}</MainContent>
      </div>
      
    </div>
  );
}

export default LayoutWrapper;