"use client";

import { cn } from "@/lib/utils";
import { Award, Home, Target, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
}

// Optimized NavItem component to prevent unnecessary re-renders
const NavItemComponent = React.memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: NavItem;
    isActive: boolean;
    onClick: (href: string, e: React.MouseEvent) => void;
  }) => {
    return (
      <button
        onClick={(e) => onClick(item.href, e)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
          isActive
            ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.label}</span>
      </button>
    );
  }
);

NavItemComponent.displayName = "NavItemComponent";

// Optimized Mobile NavItem component
const MobileNavItemComponent = React.memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: NavItem;
    isActive: boolean;
    onClick: (href: string, e: React.MouseEvent) => void;
  }) => {
    return (
      <button
        onClick={(e) => onClick(item.href, e)}
        className={cn(
          "flex flex-col items-center justify-center space-y-1 text-xs transition-colors cursor-pointer relative",
          isActive
            ? "text-primary-600 dark:text-primary-400"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <item.icon
          className={cn(
            "h-5 w-5",
            isActive ? "text-primary-600 dark:text-primary-400" : ""
          )}
        />
        <span
          className={cn(
            "font-medium",
            isActive ? "text-primary-600 dark:text-primary-400" : ""
          )}
        >
          {item.label}
        </span>
        {isActive && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-b-lg" />
        )}
      </button>
    );
  }
);

MobileNavItemComponent.displayName = "MobileNavItemComponent";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/nft", label: "NFTs", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
  // ...(process.env.NODE_ENV === "development"
  //   ? [{ href: "/debug", label: "Debug", icon: Bug }]
  //   : []),
];

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Memoize the active state function to prevent unnecessary re-renders
  const isItemActive = useCallback(
    (itemHref: string) => {
      if (itemHref === "/missions") {
        // Missions tab is active for /missions and mission-related pages
        return pathname === "/missions" || pathname.startsWith("/missions/");
      }
      return pathname === itemHref;
    },
    [pathname]
  );

  // Memoize navigation items to prevent recreation on every render
  const navigationItems = useMemo(() => navItems, []);

  // Optimized click handler for programmatic navigation
  const handleNavClick = useCallback(
    (href: string, e: React.MouseEvent) => {
      e.preventDefault();
      // Use router.push for faster navigation
      router.push(href);
    },
    [router]
  );

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:flex bg-card max-w-xl bg-dark-bg/60 backdrop-blur-2xl border border-primary-800/20 rounded-2xl mx-auto shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between space-x-8 h-16">
            {navigationItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                isActive={isItemActive(item.href)}
                onClick={handleNavClick}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => (
            <MobileNavItemComponent
              key={item.href}
              item={item}
              isActive={isItemActive(item.href)}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
