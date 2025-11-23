import { useEffect, useState } from "react";
import SidebarSection from "./SidebarSection";
import "./sidebar.css";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaStickyNote,
  FaAngleDoubleLeft,
} from "react-icons/fa";
import logoSidebar from "../../assets/images/atom-logo.png";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../../firebase-config";
import ProjectDetailsModal from "../../pages/Dashboard/Projects/viewProjects/ProjectDetailsModal";

function SidebarContainer({ isOpen, toggleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    onValue(ref(db, `users/${auth.currentUser.uid}/projects`), (snapshot) => {
      const projectsData = snapshot.val();
      setProjects(projectsData ? projectsData : {});
    });
  }, []);

  return (
    <nav className={`sidebar ${isOpen ? "" : "close"}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logoSidebar} alt="Atom-Logo" className="logo-img" />
          <span className="logo">atom</span>
        </div>

        <button onClick={toggleSidebar} className="toggle-btn">
          <FaAngleDoubleLeft />
        </button>
      </div>

      {/* Menu Section */}
      <SidebarSection
        title="Menu"
        items={[
          { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
          { to: "/project", label: "Projects", icon: <FaProjectDiagram /> },
          { to: "/task", label: "Tasks", icon: <FaTasks /> },
          { to: "/notes", label: "Notes", icon: <FaStickyNote /> },
        ]}
      />

      {/* Project Section */}
      <SidebarSection
        title="Projects"
        items={
          projects && typeof projects === "object"
            ? Object.entries(projects)
                .slice(0, 4)
                .filter(([, project]) => project.status !== "completed")
                .map(([key, project]) => ({
                  label:
                    typeof project === "object"
                      ? project.title || key
                      : project,
                  icon: (
                    <i
                      className="fa fa-folder"
                      style={{
                        color: project.folderColor || "#3b82f6",
                        fontSize: "2rem",
                      }}
                    />
                  ),
                  onClick: () => setSelectedProject(project),
                }))
            : []
        }
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

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </nav>
  );
}

export default SidebarContainer;
