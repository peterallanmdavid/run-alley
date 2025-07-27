'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { getCurrentUser, logout } from '@/lib/api';
import { useEffect, useState } from 'react';

interface User {
  group: {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'GroupOwner';
  };
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinkClass = (active: boolean) => {
    const baseClass = "text-sm font-medium transition-colors duration-200 hover:text-blue-600";
    return active 
      ? `${baseClass} text-blue-600 border-b-2 border-blue-600 pb-1` 
      : `${baseClass} text-gray-600`;
  };

  const mobileNavLinkClass = (active: boolean) => {
    const baseClass = "block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200";
    return active 
      ? `${baseClass} text-blue-600 bg-blue-50 border-l-4 border-blue-600` 
      : `${baseClass} text-gray-600 hover:text-blue-600 hover:bg-gray-50`;
  };

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Run Alley
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Run Alley
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            { isLoggedIn ? (
              <nav className="flex items-center space-x-6">
                <Link href="/my-members" className={navLinkClass(isActive('/my-members'))}>
                  My Members
                </Link>
                <Link href="/my-events" className={navLinkClass(isActive('/my-events'))}>
                  My Events
                </Link>
                <Link href="/profile">
                  <span className="text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                    {currentUser?.group?.name || 'My Group'}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </nav>
            ) : (
              <nav className="flex items-center space-x-6">
                <Link href="/groups" className={navLinkClass(isActive('/groups'))}>
                  Groups
                </Link>
                <Link href="/events" className={navLinkClass(isActive('/events'))}>
                  Events
                </Link>
                <Link href="/login">
                  <Button variant="default" className="text-sm px-4 py-2">
                    Login
                  </Button>
                </Link>
              </nav>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isLoggedIn ? (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.group?.name?.charAt(0) || 'U'}
                </div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="px-4 py-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link href="/my-members" className={mobileNavLinkClass(isActive('/my-members'))}>
                    My Members
                  </Link>
                  <Link href="/my-events" className={mobileNavLinkClass(isActive('/my-events'))}>
                    My Events
                  </Link>
                  <Link href="/profile" className={mobileNavLinkClass(false)}>
                    <div className="flex items-center justify-between">
                      <span>My Group</span>
                      <span className="text-sm px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded text-xs">
                        {currentUser?.group?.name || 'Group'}
                      </span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/groups" className={mobileNavLinkClass(isActive('/groups'))}>
                    Groups
                  </Link>
                  <Link href="/events" className={mobileNavLinkClass(isActive('/events'))}>
                    Events
                  </Link>
                  <Link href="/login" className="block w-full text-left px-4 py-3">
                    <Button variant="default" className="w-full">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 