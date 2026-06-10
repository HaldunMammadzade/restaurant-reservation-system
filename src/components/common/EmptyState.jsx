import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'Məlumat tapılmadı', 
  description = '',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
