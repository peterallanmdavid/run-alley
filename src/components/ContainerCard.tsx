import React from 'react';

interface ContainerCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContainerCard({ children, className = '', }: ContainerCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 ${className}`}>
      {children}
    </div>
  );
} 