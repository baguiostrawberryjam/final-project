import { Plus } from "lucide-react";
import "./header.css";

function Header({ header, onAddProjectClick }) {
  return (
    <>
      <div className="header-section">
        <span>Hello, {header}</span>
        <button className="add-project-btn" onClick={onAddProjectClick}>
          <Plus size={15} />
          New Project
        </button>
      </div>
    </>
  );
}

export default Header;
