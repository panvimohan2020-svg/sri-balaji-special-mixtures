import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Truck, ShoppingBag, User } from 'lucide-react';
import { useCartStore, type CartState } from '../../store/useCartStore';

export const MobileBottomNav: React.FC = () => {
  const getItemCount = useCartStore((state: CartState) => state.getItemCount);
  const itemCount = getItemCount();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Catalogue', path: '/catalog', icon: Grid },
    { label: 'Track', path: '/track', icon: Truck },
    { label: 'Bag', path: '/cart', icon: ShoppingBag, badge: itemCount },
    { label: 'Account', path: '/account', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#190D2B]/95 backdrop-blur-lg border-t border-gold/40 shadow-royal safe-bottom"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-sans font-semibold transition-all touch-target ${
                  isActive
                    ? 'text-gold font-extrabold scale-105'
                    : 'text-ivory/70 hover:text-gold'
                }`
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5] text-gold' : 'stroke-2 text-ivory/70'}`} />
                    {item.badge && item.badge > 0 ? (
                      <span className="absolute -top-1.5 -right-2 bg-gold text-imperial text-[10px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-gold">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[11px] leading-tight tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-5 h-0.5 bg-gold rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
