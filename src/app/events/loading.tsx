import { ContainerCard } from '@/components';

export default function EventsLoading() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-48"></div>
          
          <ContainerCard>
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-4 sm:px-6 py-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 mb-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0 mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </ContainerCard>
        </div>
      </div>
    </div>
  );
} 