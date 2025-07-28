import { ContainerCard } from '@/components';

export default function EditMemberLoading() {
  return (
    <div className="py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-32"></div>
            
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 