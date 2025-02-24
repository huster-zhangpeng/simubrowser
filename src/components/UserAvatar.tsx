import React, { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { UserType } from '../types';

interface UserAvatarProps {
  currentUser?: UserType;
  onLogout?: () => void;
  onSettings?: () => void;
}

export function UserAvatar({ currentUser, onLogout, onSettings }: UserAvatarProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={togglePopup}
        className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition-colors duration-200"
      >
        {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
      </button>

      {isPopupOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/5 backdrop-blur-sm z-[100]"
            onClick={() => setIsPopupOpen(false)}
          />
          <div 
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {currentUser?.name || 'Guest User'}
                </div>
                <div className="text-sm text-gray-500">
                  {currentUser?.email || 'Not signed in'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={onSettings}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}