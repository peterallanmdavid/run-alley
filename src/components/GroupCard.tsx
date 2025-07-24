import React from 'react';
import { Button } from './Button';
import { RunGroup } from '@/lib/data';

interface GroupCardProps {
  group: RunGroup;
  memberCount?: number;
  eventCount?: number;
  onClick?: () => void;
  onView?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, memberCount, eventCount, onClick, onView }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
        {group.description && (
          <p className="text-gray-600 text-sm mb-3">{group.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Created {formatDate(group.createdAt)}</span>
        <span>👥 {typeof memberCount === 'number' ? memberCount : group.members?.length ?? 0} members</span>
        <span>📅 {typeof eventCount === 'number' ? eventCount : group.events?.length ?? 0} events</span>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          onClick={onView}
          variant="primary"
          size="sm"
        >
          View
        </Button>
      </div>
    </div>
  );
}; 