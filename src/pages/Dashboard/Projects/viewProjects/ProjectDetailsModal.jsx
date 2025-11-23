import "./project-details-modal.css";

function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <i className="fa fa-times"></i>
        </button>

        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <span className="breadcrumb-item">Projects</span>
          <i className="fa fa-chevron-right"></i>
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
                {Object.keys(project.todos).map((todoKey) => (
                  <div key={todoKey} className="modal-todo-item">
                    <div className="todo-header">
                      <div className="todo-info">
                        <i className="fa fa-tasks"></i>
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
                      <i className="fa fa-calendar"></i>{" "}
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

          {/* Notes Section */}
          <section className="modal-section">
            <h3 className="section-title">Notes</h3>
            {project.notes && Object.keys(project.notes).length > 0 ? (
              <div className="notes-list">
                {Object.keys(project.notes).map((noteKey) => (
                  <div key={noteKey} className="modal-note-item">
                    <div className="note-header">
                      <i className="fa fa-sticky-note"></i>
                      <span className="note-title">
                        {project.notes[noteKey].title}
                      </span>
                    </div>
                    <p className="note-content">
                      {project.notes[noteKey].content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">
                No notes added to this project yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsModal;
