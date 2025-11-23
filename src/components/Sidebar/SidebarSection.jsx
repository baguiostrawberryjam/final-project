import SidebarItem from "./SidebarItem";
import { ChevronDown } from "lucide-react";

export default function SidebarSection({ title, items, isCollapsed, onToggleCollapse }) {
  return (
    <div className="sidebar-section">
      {title && (
        <div
          className="section-header"
          onClick={onToggleCollapse}
          style={{ cursor: onToggleCollapse ? "pointer" : "default" }}
        >
          <div className="section-title-container">
            <h4 className="section-title">{title}</h4>
          </div>
          <div className="section-toggle-container">
            {onToggleCollapse && (
              <button
                className="section-collapse-btn"
                aria-label="Toggle section"
                tabIndex={-1}
                style={{ pointerEvents: "none", background: "none", border: "none" }}
              >
                <ChevronDown size={20} className={isCollapsed ? "collapsed" : ""} />
              </button>
            )}
          </div>
        </div>
      )}
      {!isCollapsed && (
        <ul>
          {items.map((item) => (
            <SidebarItem
              key={item.label}
              to={item.to}
              label={item.label}
              icon={item.icon}
              subItems={item.subItems}
              dropdownOpen={item.dropdownOpen}
              toggleDropdown={item.toggleDropdown}
              onClick={item.onClick}
              isClickable={item.isClickable}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
