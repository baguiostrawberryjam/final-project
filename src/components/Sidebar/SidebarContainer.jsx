import { useEffect, useState } from "react";
import SidebarSection from "./SidebarSection";
import "./sidebar.css";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  BookOpen,
  Star,
  PanelRight,
} from "lucide-react";
import logoSidebar from "../../assets/images/atom-logo.png";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../../firebase-config";
import ProjectDetailsModal from "../../pages/Dashboard/Projects/viewProjects/ProjectDetailsModal";

function SidebarContainer({ isOpen, toggleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [projects, setProjects] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    if (auth.currentUser) {
      onValue(ref(db, `users/${auth.currentUser.uid}/projects`),(snapshot) => {
          if (snapshot.exists()) {
            setProjects(snapshot.val());
          } else {
            setProjects(null);
          }
        }
      );
    }
  }, []);

  return (
    <nav className={`sidebar ${isOpen ? "" : "close"}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logoSidebar} alt="Atom-Logo" className="logo-img" />
          <span className="logo">atom</span>
        </div>

        <button onClick={toggleSidebar} className="toggle-btn">
          <PanelRight />
        </button>
      </div>

      {/* Menu Section */}
      <SidebarSection
        title="Menu"
        items={[
          { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
          { to: "/project", label: "Projects", icon: <FolderOpen /> },
          { to: "/task", label: "Tasks", icon: <CheckSquare /> },
          { to: "/notes", label: "Notes", icon: <BookOpen /> },
        ]}
      />

      {/* Project Section */}
      <SidebarSection
        title="Projects"
        items={
          projects && typeof projects === "object"
            ? Object.entries(projects)
                .filter(([, project]) => project.status !== "completed")
                .map(([key, project]) => ({
                  label:
                    typeof project === "object"
                      ? project.title || key
                      : project,
                  icon: <FolderOpen size={20} />,
                  onClick: () => setSelectedProject(project),
                  isClickable: true,
                }))
            : []
        }
        onItemClick={(project) => setSelectedProject(project)}
      />

      {/* Favorite Section */}
      <SidebarSection
        title="Favorites"
        items={[
          {
            label: "Whats",
            icon: <Star size={20} />,
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
