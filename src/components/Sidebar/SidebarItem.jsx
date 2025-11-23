import { Link, useLocation } from "react-router";

function SidebarItem({
  to,
  label,
  icon,
  dropdownOpen,
  toggleDropdown,
  subItems,
  onClick,
  isClickable,
}) {
  const location = useLocation();
  const isActive = to && location.pathname === to;

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
                <Link to="#">
                  <span>{item}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  // If clickable (for projects), render as button
  if (isClickable && onClick) {
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
      <Link to={to} className={isActive ? "active" : ""}>
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default SidebarItem;
