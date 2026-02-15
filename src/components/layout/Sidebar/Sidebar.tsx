import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Bell } from 'lucide-react';

import { ROUTES } from '@/helpers/constants';
import { TEXT_CONTENT } from '@/helpers/constants';

const NAV_ITEMS = [
  {
    to: ROUTES.DASHBOARD,
    label: TEXT_CONTENT.NAV.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    to: ROUTES.PORTFOLIO,
    label: TEXT_CONTENT.NAV.PORTFOLIO,
    icon: Briefcase,
  },
  {
    to: ROUTES.ALERTS,
    label: TEXT_CONTENT.NAV.ALERTS,
    icon: Bell,
  },
] as const;

const Sidebar = (): React.JSX.Element => {
  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-border md:bg-surface">
      <nav className="flex flex-1 flex-col gap-1 p-3 pt-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
