'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components';
import { getCurrentUser, logout } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; description: string; role: 'Admin' | 'GroupOwner' } | null>(null);
  

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await getCurrentUser();
        if (result && result.group) {
          setIsLoggedIn(true);
          setCurrentUser(result.group);
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } catch {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Run-Alley</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link 
              href="/groups" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Groups
            </Link>
            <Link 
              href="/events" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Events
            </Link>
            
            { isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {currentUser?.name || 'User'}
                </span>
                <Button 
                  onClick={handleLogout}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" className="text-sm px-3 py-1">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}; 