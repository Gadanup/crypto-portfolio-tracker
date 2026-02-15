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

const MobileNav = (): React.JSX.Element => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-surface md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              isActive
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <item.icon size={20} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
