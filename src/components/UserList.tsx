import React from 'react';
import { User } from '../types/chat';
import { Users, Circle } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUserId?: string | null;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Users size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">
            Online ({users.length})
          </h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No users online
          </div>
        ) : (
          <div className="p-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  user.id === currentUserId
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <Circle
                    size={8}
                    className="absolute -bottom-1 -right-1 text-green-500 fill-current"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.username}
                    </span>
                    {user.id === currentUserId && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};