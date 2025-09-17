import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, User } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* 왼쪽: NetAgent 로고 */}
          <div className="flex items-center">
            <button
              onClick={handleHomeClick}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 relative group cursor-pointer"
            >
              NetAgent
              {/* 툴팁 - 아래 방향 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                홈으로
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
              </div>
            </button>
          </div>

          {/* 오른쪽: 아이콘들 */}
          <div className="flex items-center space-x-4">
            {/* Admin 아이콘 */}
            <button 
              onClick={handleAdminClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative group cursor-pointer"
            >
              <Settings className="h-5 w-5" />
              {/* 툴팁 - 아래 방향 */}
              <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Admin
                <div className="absolute bottom-full right-2 border-4 border-transparent border-b-gray-800"></div>
              </div>
            </button>

            {/* Help 아이콘 */}
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative group">
              <HelpCircle className="h-5 w-5" />
              {/* 툴팁 - 아래 방향 */}
              <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Help
                <div className="absolute bottom-full right-2 border-4 border-transparent border-b-gray-800"></div>
              </div>
            </button>

            {/* User 아이콘 */}
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative group">
              <User className="h-5 w-5" />
              {/* 툴팁 - 아래 방향 */}
              <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Username
                <div className="absolute bottom-full right-2 border-4 border-transparent border-b-gray-800"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
