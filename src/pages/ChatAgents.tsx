import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  MessageSquare,
  Settings,
  FileText,
  Brain,
  Server
} from 'lucide-react';
import type { ChatAgent, Agent } from '../types';
import { 
  PageHeader, 
  Card, 
  Button, 
  SearchInput, 
  StatusBadge, 
  EmptyState,
  LoadingPage 
} from '../components/ui';
import { useSearch } from '../hooks';
import { mockChatAgents } from '../data';

export default function ChatAgents() {
  const navigate = useNavigate();
  const [chatAgents, setChatAgents] = useState<ChatAgent[]>(mockChatAgents);
  const [loading, setLoading] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems: filteredAgents } = useSearch(
    chatAgents,
    ['agents.0.name', 'agents.0.description']
  );

  const handleDelete = (chatagentsId: string) => {
    if (confirm('정말로 이 챗 에이전트를 삭제하시겠습니까?')) {
      setChatAgents(prev => prev.filter(agent => agent.chatagentsId !== chatagentsId));
    }
  };

  const handleToggleState = (chatagentsId: string) => {
    setChatAgents(prev => prev.map(agent => 
      agent.chatagentsId === chatagentsId 
        ? { ...agent, state: agent.state === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  const handleOpenSettings = (agent: Agent) => {
    navigate(`/admin/chat-agents/edit/${agent.agentId}`);
  };

  const getStateVariant = (state: string) => {
    switch (state) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStateText = (state: string) => {
    switch (state) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'error':
        return '오류';
      default:
        return '알 수 없음';
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="챗 에이전트"
        description="챗봇 에이전트를 관리하고 모니터링하세요."
      >
        <Button onClick={() => navigate('/admin/chat-agents/create')}>
          <Plus className="h-4 w-4 mr-2" />
          새 에이전트
        </Button>
      </PageHeader>

      {/* 검색 */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchInput
            placeholder="에이전트 검색..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* 에이전트 목록 */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.chatagentsId}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {agent.agents[0]?.name || '이름 없음'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {agent.agents[0]?.description || '설명 없음'}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <StatusBadge
                      status={getStateText(agent.state)}
                      variant={getStateVariant(agent.state)}
                    />
                    <span className="text-xs text-gray-500">
                      ID: {agent.chatagentsId}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to={`/chat/${agent.serviceId}`}>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    채팅
                  </Button>
                </Link>
                <Button
                  variant={agent.state === 'active' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleState(agent.chatagentsId)}
                >
                  {agent.state === 'active' ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      일시정지
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      시작
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenSettings(agent.agents[0])}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(agent.chatagentsId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* 에이전트 상세 정보 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">프롬프트</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {agent.agents[0]?.prompt || '프롬프트 없음'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">API URL</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {agent.agents[0]?.apiUrl || 'URL 없음'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">메서드</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {agent.agents[0]?.method || '메서드 없음'}
                  </dd>
                </div>
              </div>
              
              {/* 연결된 리소스 */}
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    연결된 문서 ({agent.agents[0]?.connectedDocuments?.length || 0}개)
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {agent.agents[0]?.connectedDocuments?.length ? 
                      agent.agents[0].connectedDocuments.join(', ') : 
                      '연결된 문서 없음'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    연결된 모델 ({agent.agents[0]?.connectedModels?.length || 0}개)
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {agent.agents[0]?.connectedModels?.length ? 
                      agent.agents[0].connectedModels.join(', ') : 
                      '연결된 모델 없음'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Server className="h-4 w-4 mr-1" />
                    연결된 MCP 서버 ({agent.agents[0]?.connectedMCPServers?.length || 0}개)
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {agent.agents[0]?.connectedMCPServers?.length ? 
                      agent.agents[0].connectedMCPServers.join(', ') : 
                      '연결된 MCP 서버 없음'
                    }
                  </dd>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <EmptyState
          icon={MessageSquare}
          title="에이전트가 없습니다"
          description="새로운 챗 에이전트를 생성해보세요."
          actionLabel="새 에이전트 생성"
          onAction={() => navigate('/admin/chat-agents/create')}
        />
      )}
    </div>
  );
}