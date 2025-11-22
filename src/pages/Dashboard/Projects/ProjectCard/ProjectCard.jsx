import "./project-card.css"

export default function ProjectCard({ project, today }) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <i
          className="fa fa-folder"
          style={{
            color: project.folderColor || '#3b82f6',
            fontSize: '2rem'
          }}
        />
        <h3>
          {project.title}{" "}
          {project.targetDate < today && (
            <span className="overdue-text">(Overdue)</span>
          )}
        </h3>
      </div>

      <p className="project-description">{project.description}</p>
      <p className="project-date">Created: {project.createdAt}</p>
    </div>
  );
}