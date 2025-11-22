import { Link, useLocation } from "react-router";

function SidebarItem({ to, label, icon, dropdownOpen, toggleDropdown, subItems }) {
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
                <Link to="#">{item}</Link>
              </li>
            ))}
          </ul>
        )}
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