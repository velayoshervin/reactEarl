import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function DropdownNavLink({ label, icon: Icon, links = [] }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpened(!opened)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} />}
          <span>{label}</span>
        </div>
        {links.length > 0 &&
          (opened ? (
            <IconChevronDown size={18} />
          ) : (
            <IconChevronRight size={18} />
          ))}
      </button>

      {opened && links.length > 0 && (
        <div className="ml-6 mt-1 flex flex-col border-l border-gray-300 dark:border-gray-700">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
