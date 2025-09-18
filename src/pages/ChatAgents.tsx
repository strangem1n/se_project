import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  MessageSquare,
  Settings
} from 'lucide-react';
import type { Agent } from '../types';
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
import { mockAgents } from '../data/chatAgents';
import AgentSettingsModal from '../components/AgentSettingsModal';
import { chatAgentApi } from '../services/api';

export default function ChatAgents() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [togglingStates, setTogglingStates] = useState<Set<string>>(new Set());
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);

  const { searchTerm, setSearchTerm, filteredItems: filteredAgents } = useSearch(
    agents,
    ['id', 'serviceName']
  );

  // 챗 에이전트 목록 조회
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        // 현재 로그인한 사용자 ID (임시로 'admin-1' 사용)
        const currentUserId = 'admin-1';
        
        const response = await chatAgentApi.getAgents({
          userId: currentUserId,
          state: stateFilter // 상태 필터 적용
        });

        if (response.data.agents) {
          setAgents(response.data.agents);
        }
      } catch (error) {
        console.error('챗 에이전트 목록 조회 실패:', error);
        // 에러 시 목업 데이터 사용
        setAgents(mockAgents);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [stateFilter]);

  const handleDelete = (agentId: string) => {
    if (confirm('정말로 이 챗 에이전트를 삭제하시겠습니까?')) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    }
  };

  const handleToggleState = async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const newState = agent.state === 'active' ? 'inactive' : 'active';
    
    // 로딩 상태 추가
    setTogglingStates(prev => new Set(prev).add(agentId));
    
    try {
      const response = await chatAgentApi.updateState({
        chatAgentId: agentId,
        state: newState
      });

      if (response.data.result === 'success') {
        // 성공 시 로컬 상태 업데이트
        setAgents(prev => prev.map(a => 
          a.id === agentId 
            ? { ...a, state: newState }
            : a
        ));
        
        const statusText = newState === 'active' ? '활성화' : '비활성화';
        alert(`챗 에이전트가 ${statusText}되었습니다.`);
      } else {
        alert('챗 에이전트 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('챗 에이전트 상태 변경 실패:', error);
      alert('챗 에이전트 상태 변경 중 오류가 발생했습니다.');
    } finally {
      // 로딩 상태 제거
      setTogglingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  const handleOpenSettings = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setIsModalOpen(true);
  };

  const handleSaveAgent = (agent: Agent) => {
    if (selectedAgent) {
      // 수정
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? agent : a
      ));
    } else {
      // 생성
      const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        serviceName: agent.serviceName,
        state: 'active',
        userId: agent.userId,
        ...agent
      };
      setAgents(prev => [...prev, newAgent]);
    }
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
        <Button onClick={handleCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
          새 에이전트
        </Button>
      </PageHeader>

      {/* 검색 및 필터 */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchInput
            placeholder="에이전트 검색..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={stateFilter === undefined ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStateFilter(undefined)}
          >
            전체
          </Button>
          <Button
            variant={stateFilter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStateFilter('active')}
          >
            활성
          </Button>
          <Button
            variant={stateFilter === 'inactive' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStateFilter('inactive')}
          >
            비활성
          </Button>
        </div>
      </div>

      {/* 에이전트 목록 */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {agent.serviceName}
                  </h3>
                  <div className="mt-2 flex items-center space-x-4">
                    <StatusBadge
                      status={getStateText(agent.state)}
                      variant={getStateVariant(agent.state)}
                    />
                    <span className="text-xs text-gray-500">
                      ID: {agent.id}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={agent.state === 'active' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleState(agent.id)}
                  disabled={togglingStates.has(agent.id)}
                >
                  {togglingStates.has(agent.id) ? (
                    <>
                      <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                      처리 중...
                    </>
                  ) : agent.state === 'active' ? (
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
                  onClick={() => handleOpenSettings(agent)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  설정
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(agent.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          onAction={handleCreateAgent}
        />
      )}

      {/* 에이전트 설정 모달 */}
      <AgentSettingsModal
        isOpen={isModalOpen}
        agent={selectedAgent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAgent}
      />
    </div>
  );
}