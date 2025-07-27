'use client';

import { useState } from 'react';
import { Button } from '@/components';
import { GenderDropdown } from '@/components/GenderDropdown';

interface JoinEventFormProps {
  secretCode: string;
  eventName: string;
  onSubmit: (formData: { name: string; age: string; gender: string; email?: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function JoinEventForm({ secretCode, eventName, onSubmit, loading, error }: JoinEventFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age *
        </label>
        <input
          type="number"
          required
          min="1"
          max="120"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your age"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender *
        </label>
        <GenderDropdown gender={formData.gender} setGender={(value: string) => handleInputChange('gender', value)} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email (Optional)
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your email address"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Joining...' : 'Join Event'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={() => window.location.href = '/events'}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 