import { Link } from "react-router";

function SidebarItem({
  to,
  label,
  icon,
  dropdownOpen,
  toggleDropdown,
  subItems,
  onClick,
}) {
  if (subItems) {
    return (
      <li>
        <button className="dropdown-btn" onClick={toggleDropdown}>
          <span>{icon}</span>
          <span>{label}</span>
        </button>
        {dropdownOpen && (
          <ul className="sub-menu">
            {subItems.map((item) => (
              <li key={item}>
                <Link to="#">{item}</Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  // For project items with onClick handler
  if (onClick) {
    return (
      <li>
        <button onClick={onClick} className="sidebar-item-btn">
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link to={to}>
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default SidebarItem;
