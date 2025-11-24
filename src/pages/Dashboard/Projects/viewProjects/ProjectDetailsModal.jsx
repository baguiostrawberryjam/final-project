import "./project-details-modal.css";
import { X, ChevronRight, ListChecks, Calendar } from "lucide-react";
import { FaFolder } from "react-icons/fa";
function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <span className="breadcrumb-item">Projects</span>
          <ChevronRight size={14} style={{margin: "0 4px"}} />
          <span className="breadcrumb-item active">{project.title}</span>
        </nav>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <i
              className="fa fa-folder"
              style={{ color: project.folderColor || "#888" }}
            ></i>
            <div>
              <h2>
                {project.title}{" "}
                {project.targetDate < today && (
                  <span className="overdue-badge">(Overdue)</span>
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Description */}
          <section className="modal-section">
            <h3 className="section-title">Description</h3>
            <p className="section-content">{project.description}</p>
          </section>

          {/* Project Details */}
          <section className="modal-section">
            <h3 className="section-title">Project Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${project.status}`}>
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created Date:</span>
                <span className="detail-value">{project.createdAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Target Date:</span>
                <span className="detail-value">{project.targetDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Days Remaining:</span>
                <span className="detail-value">
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(project.targetDate) - new Date(today)) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{" "}
                  days
                </span>
              </div>
            </div>
          </section>

          {/* Tasks Section */}
          <section className="modal-section">
            <h3 className="section-title">Tasks</h3>
            {project.todos && Object.keys(project.todos).length > 0 ? (
              <div className="tasks-list">
                {Object.keys(project.todos)
                .filter((todoKey) => project.todos[todoKey].status !== "archived")
                .map((todoKey) => (
                  <div key={todoKey} className="modal-todo-item">
                    <div className="todo-header">
                      <div className="todo-info">
                        <ListChecks size={16} style={{marginRight: 4}} />
                        <span className="todo-title">
                          {project.todos[todoKey].title}
                        </span>
                        {project.todos[todoKey].due < today &&
                          project.todos[todoKey].status !== "completed" && (
                            <span className="overdue-badge">(Overdue)</span>
                          )}
                      </div>
                      <span
                        className={`status-badge status-${project.todos[todoKey].status}`}
                      >
                        {project.todos[todoKey].status.charAt(0).toUpperCase() +
                          project.todos[todoKey].status.slice(1)}
                      </span>
                    </div>
                    <div className="todo-date">
                      <Calendar size={14} style={{marginRight: 4}} />
                      {project.todos[todoKey].due}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">
                No tasks added to this project yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsModal;
