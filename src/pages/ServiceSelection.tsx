import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Users, BarChart3 } from 'lucide-react';
import { PageHeader, Card, Button, SearchInput, StatusBadge, EmptyState } from '../components/ui';
import { useSearch } from '../hooks';
import { mockChatAgents } from '../data';

export default function ServiceSelection() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // 서비스 목록 생성 (챗 에이전트에서 추출)
  const services = mockChatAgents.map(chatAgent => ({
    serviceId: chatAgent.serviceId,
    name: chatAgent.agents[0]?.name || '서비스',
    description: chatAgent.agents[0]?.description || '챗봇 서비스',
    status: chatAgent.state,
    agentCount: chatAgent.agents.length,
    lastActive: '방금 전',
  }));

  const { searchTerm, setSearchTerm, filteredItems: filteredServices } = useSearch(
    services,
    ['name', 'description']
  );

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    // 챗봇 인터페이스로 이동
    navigate(`/chat/${serviceId}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '운영중';
      case 'inactive':
        return '중지됨';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="bg-gray-50">
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 검색 */}
        <div className="mb-8">
          <div className="max-w-md">
            <SearchInput
              placeholder="서비스 검색..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>

        {/* 서비스 목록 */}
        <div className="grid grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card 
              key={service.serviceId}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedService === service.serviceId 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleServiceSelect(service.serviceId)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={getStatusText(service.status)}
                    variant={getStatusVariant(service.status)}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>에이전트 {service.agentCount}개</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span>마지막 활동: {service.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    클릭하여 시작
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredServices.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="사용 가능한 서비스가 없습니다"
            description="현재 운영 중인 챗봇 서비스가 없습니다."
          />
        )}
      </div>
    </div>
  );
}
