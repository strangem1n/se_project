import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  Server,
  Calendar,
  Download
} from 'lucide-react';
import { 
  PageHeader, 
  Card, 
  Button, 
  LoadingPage 
} from '../components/ui';
import { useAsyncData } from '../hooks';
import { mockStatData, type StatData } from '../data';

export default function Statistics() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [selectedMetric, setSelectedMetric] = useState<'chat' | 'document' | 'mcp'>('chat');

  const { data, loading } = useAsyncData<StatData>(() => mockStatData);

  const getMetricStats = () => {
    if (!data) return { total: 0, byAgent: {}, icon: BarChart3, color: 'bg-gray-500' };

    switch (selectedMetric) {
      case 'chat':
        return {
          total: data.chatUsage.length,
          byAgent: data.chatUsage.reduce((acc, usage) => {
            acc[usage.chatagentsId] = (acc[usage.chatagentsId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          icon: MessageSquare,
          color: 'bg-blue-500',
        };
      case 'document':
        return {
          total: data.documentUsage.length,
          byAgent: data.documentUsage.reduce((acc, usage) => {
            acc[usage.documentId] = (acc[usage.documentId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          icon: FileText,
          color: 'bg-green-500',
        };
      case 'mcp':
        return {
          total: data.mcpUsage.length,
          byAgent: data.mcpUsage.reduce((acc, usage) => {
            acc[usage.serviceId] = (acc[usage.serviceId] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          icon: Server,
          color: 'bg-purple-500',
        };
      default:
        return { total: 0, byAgent: {}, icon: BarChart3, color: 'bg-gray-500' };
    }
  };

  const stats = getMetricStats();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="통계"
        description="시스템 사용량과 성능 지표를 확인하세요."
      >
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          리포트 다운로드
        </Button>
      </PageHeader>

      {/* 필터 및 날짜 범위 */}
      <Card>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">지표 선택</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as 'chat' | 'document' | 'mcp')}
              className="input"
            >
              <option value="chat">챗 에이전트 사용량</option>
              <option value="document">문서 사용량</option>
              <option value="mcp">MCP 서버 호출량</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
            <input
              type="date"
              className="input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
            <input
              type="date"
              className="input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </Card>

      {/* 요약 통계 */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className={`p-3 rounded-md ${stats.color}`}>
              <stats.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">총 사용량</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-green-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">이번 주</p>
              <p className="text-2xl font-semibold text-gray-900">+12%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-yellow-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">이번 달</p>
              <p className="text-2xl font-semibold text-gray-900">+8%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-red-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">평균 응답시간</p>
              <p className="text-2xl font-semibold text-gray-900">1.2s</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 사용량 분포 */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedMetric === 'chat' && '챗 에이전트별 사용량'}
            {selectedMetric === 'document' && '문서별 사용량'}
            {selectedMetric === 'mcp' && '서비스별 MCP 호출량'}
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.byAgent).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{key}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(value / Math.max(...Object.values(stats.byAgent))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-4">
            {selectedMetric === 'chat' && data?.chatUsage.slice(0, 5).map((usage) => (
              <div key={usage.chatUsageId} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">챗 에이전트 {usage.chatagentsId} 사용</p>
                  <p className="text-xs text-gray-500">{usage.createdAt}</p>
                </div>
              </div>
            ))}
            {selectedMetric === 'document' && data?.documentUsage.slice(0, 5).map((usage) => (
              <div key={usage.documentUsageId} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">문서 {usage.documentId} 사용</p>
                  <p className="text-xs text-gray-500">{usage.createdAt}</p>
                </div>
              </div>
            ))}
            {selectedMetric === 'mcp' && data?.mcpUsage.slice(0, 5).map((usage) => (
              <div key={usage.mcpUsageId} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${usage.isComplete ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">MCP 서버 {usage.serviceId} 호출</p>
                  <p className="text-xs text-gray-500">{usage.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 상세 데이터 테이블 */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">상세 데이터</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectedMetric === 'chat' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">에이전트 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">히스토리 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                  </>
                )}
                {selectedMetric === 'document' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">문서 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                  </>
                )}
                {selectedMetric === 'mcp' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스 ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">완료 여부</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedMetric === 'chat' && data?.chatUsage.map((usage) => (
                <tr key={usage.chatUsageId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.chatUsageId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.chatagentsId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.historyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.createdAt}</td>
                </tr>
              ))}
              {selectedMetric === 'document' && data?.documentUsage.map((usage) => (
                <tr key={usage.documentUsageId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.documentUsageId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.documentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.createdAt}</td>
                </tr>
              ))}
              {selectedMetric === 'mcp' && data?.mcpUsage.map((usage) => (
                <tr key={usage.mcpUsageId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.mcpUsageId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.memberId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.serviceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      usage.isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {usage.isComplete ? '완료' : '진행중'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usage.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}