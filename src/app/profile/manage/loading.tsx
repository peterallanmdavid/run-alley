import LoadingSpinner from '@/components/LoadingSpinner';

export default function ManageGroupLoading() {
  return (
    <div className="py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="animate-pulse">
          {/* Header */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          </div>
          
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="space-y-6">
              {/* Success/Error Messages */}
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              
              {/* Form Fields */}
              <div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
              
              <div>
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="h-12 bg-gray-200 rounded-lg w-full sm:w-32"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-full sm:w-32"></div>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 