import SidebarItem from "./SidebarItem";

export default function SidebarSection({ title, items, onItemClick }) {
  return (
    <div className="sidebar-section">
      {title && <h4 className="section-title">{title}</h4>}
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
          />
        ))}
      </ul>
    </div>
  );
}
