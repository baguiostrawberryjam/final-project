import { useState } from "react";
import SidebarSection from "./SidebarSection";
import "./sidebar.css";
import {FaTachometerAlt, FaProjectDiagram, FaTasks,FaStickyNote,FaAngleDoubleLeft} from "react-icons/fa";
import logoSidebar from "../../assets/images/atom-logo.png";

function SidebarContainer({ isOpen, toggleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className={`sidebar ${isOpen ? "" : "close"}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logoSidebar} alt="Atom-Logo"  className="logo-img"/>
          <span className="logo">Atom</span>
        </div>

        <button onClick={toggleSidebar} className="toggle-btn"><FaAngleDoubleLeft/></button>
      </div>

      {/* Menu Section */}
      <SidebarSection
      
        title="Menu"
        items={[
          { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt/> },
          { to: "/project", label: "Projects", icon: <FaProjectDiagram/> },
          { to: "/task", label: "Tasks", icon: <FaTasks/> },
          { to: "/notes", label: "Notes", icon: <FaStickyNote/> },
        ]}
        
      />

      {/* Project Section */}
      <SidebarSection
        title="Projects"
        items={[
          {
            label: "Rawr",
            icon: "📁",
            subItems: ["Folder", "Document", "Project"],
            dropdownOpen: openDropdown === "create",
            toggleDropdown: () => toggleDropdown("create"),
          },
        ]}
      />

      {/* Favorite Section */}
      <SidebarSection
        title="Favorites"
        items={[
          {
            label: "Whats",
            icon: "⭐",
            subItems: ["Work", "Private", "Coding", "Gardening", "School"],
            dropdownOpen: openDropdown === "todo",
            toggleDropdown: () => toggleDropdown("todo"),
          },
        ]}
      />

      {/* Profile Section
      <SidebarSection
        title="Account"
        items={[
          { to: "/profile", label: "Profile", icon: "👤" },
        ]}
      /> */}
    </nav>
  );
}

export default SidebarContainer;