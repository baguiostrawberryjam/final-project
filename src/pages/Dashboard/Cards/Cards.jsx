import "./cards.css";

function Cards({
  totalProjects = 0,
  totalNotes = 0,
  totalTasks = 0,
  completedProjects = 0,
}) {
  return (
    <>
      <div className="cards-section">
        <div className="card">
          <div className="card-icon"></div>
          <div className="card-header">Total Projects</div>
          <div className="card-info">{totalProjects}</div>
          <div className="card-subtitle">all projects</div>
        </div>

        <div className="card">
          <div className="card-icon"></div>
          <div className="card-header">Total Notes</div>
          <div className="card-info">{totalNotes}</div>
          <div className="card-subtitle">all notes</div>
        </div>

        <div className="card">
          <div className="card-icon"></div>
          <div className="card-header">Total Tasks</div>
          <div className="card-info">{totalTasks}</div>
          <div className="card-subtitle">all tasks</div>
        </div>

        <div className="card">
          <div className="card-icon"></div>
          <div className="card-header">Completed Projects</div>
          <div className="card-info">{completedProjects}</div>
          <div className="card-subtitle">finished projects</div>
        </div>
      </div>
    </>
  );
}

export default Cards;
