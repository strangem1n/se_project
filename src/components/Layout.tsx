import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Users,
  Server,
  BarChart3,
  Monitor
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: '대시보드', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: '챗 에이전트', href: '/admin/chat-agents', icon: MessageSquare },
  { name: '모델 관리', href: '/admin/models', icon: Brain },
  { name: 'MCP 서버', href: '/admin/mcp-servers', icon: Server },
  { name: '사용자 관리', href: '/admin/users', icon: Users },
  { name: '통계', href: '/admin/statistics', icon: BarChart3 },
  { name: '임베드 테스트', href: '/admin/embed-test', icon: Monitor },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  // 관리자 페이지인지 확인
  const isAdminPage = location.pathname.startsWith('/admin');

  if (!isAdminPage) {
    // 일반 사용자 페이지는 Header와 Footer만 포함
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="relative z-50">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 데스크톱 사이드바 */}
        <div className="w-64 flex flex-col bg-white border-r border-gray-200">
          <div className="flex flex-col flex-grow">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">챗봇 관리</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto custom-scrollbar">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 페이지 콘텐츠 */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6">
            <div className="mx-auto max-w-7xl px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}