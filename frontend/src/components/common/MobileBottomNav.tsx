import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, ShoppingBag, Store } from 'lucide-react';
import { useCartStore, type CartState } from '../../store/useCartStore';

export const MobileBottomNav: React.FC = () => {
  const getItemCount = useCartStore((state: CartState) => state.getItemCount);
  const itemCount = getItemCount();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Catalog', path: '/catalog', icon: Grid },
    { label: 'Search', path: '/catalog?focus=search', icon: Search },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: itemCount },
    { label: 'Wholesale', path: '/wholesale', icon: Store },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream-warm/95 backdrop-blur-lg border-t border-cream-border safe-bottom shadow-elevated"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-crimson-800 scale-105'
                    : 'text-spice-muted hover:text-crimson-700'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-crimson-700 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] leading-tight tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
