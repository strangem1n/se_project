import { 
  MessageSquare, 
  FileText, 
  Users, 
  Server, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { PageHeader, Card, LoadingPage } from '../components/ui';
import { useAsyncData } from '../hooks';
import { mockDashboardStats, type DashboardStats } from '../data';

export default function Dashboard() {
  const { data: stats, loading } = useAsyncData<DashboardStats>(() => mockDashboardStats);

  if (loading) {
    return <LoadingPage />;
  }

  const statCards = [
    {
      name: '총 챗 에이전트',
      value: stats?.totalChatAgents || 0,
      icon: MessageSquare,
      color: 'bg-blue-500',
      change: '+2',
    },
    {
      name: '활성 챗 에이전트',
      value: stats?.activeChatAgents || 0,
      icon: Activity,
      color: 'bg-green-500',
      change: '+1',
    },
    {
      name: '총 문서',
      value: stats?.totalDocuments || 0,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+5',
    },
    {
      name: '총 사용자',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-orange-500',
      change: '+3',
    },
    {
      name: 'MCP 서버',
      value: stats?.totalMCPServers || 0,
      icon: Server,
      color: 'bg-indigo-500',
      change: '+1',
    },
    {
      name: '활성 MCP 서버',
      value: stats?.activeMCPServers || 0,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: '+2',
    },
    {
      name: '오늘 메시지',
      value: stats?.todayMessages || 0,
      icon: Clock,
      color: 'bg-rose-500',
      change: '+12%',
    },
    {
      name: '총 메시지',
      value: stats?.totalMessages?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'bg-cyan-500',
      change: '+8%',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="챗봇 관리 시스템의 전체 현황을 확인하세요."
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Card key={stat.name}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">새로운 챗 에이전트가 생성되었습니다</p>
                <p className="text-xs text-gray-500">2분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">문서가 업로드되었습니다</p>
                <p className="text-xs text-gray-500">15분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">MCP 서버 상태가 변경되었습니다</p>
                <p className="text-xs text-gray-500">1시간 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">사용자 권한이 수정되었습니다</p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">시스템 상태</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API 서버</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                정상
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">데이터베이스</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                정상
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">벡터 DB</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                정상
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">MCP 서버</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                일부 오류
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}