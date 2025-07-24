'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components';

export default function Home() {
  const router = useRouter();

  const handleCreateGroup = () => {
    router.push('/groups/create');
  };

  const handleViewGroups = () => {
    router.push('/groups');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Run-Alley</h1>
            <p className="text-gray-600">Connect with runners in your area</p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleCreateGroup}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Create A Run Group
            </Button>
            
            <Button
              onClick={handleViewGroups}
              variant="success"
              size="lg"
              className="w-full"
            >
              View Run Groups
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Find your perfect running community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
