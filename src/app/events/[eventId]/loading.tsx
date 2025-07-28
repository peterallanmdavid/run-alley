import { ContainerCard, Button } from '@/components';

export default function EventDetailsLoading() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="animate-pulse">
          {/* Back Button */}
          <div className="mb-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Event Details */}
            <ContainerCard>
              <div className="p-4 sm:p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 mt-0.5"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ContainerCard>

            {/* Participants */}
            <ContainerCard>
              <div className="p-4 sm:p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ContainerCard>
          </div>
        </div>
      </div>
    </div>
  );
} 