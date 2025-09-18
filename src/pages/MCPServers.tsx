import { useState, useEffect } from 'react';
import { 
  Plus, 
  Server, 
  Trash2, 
  Settings,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  User
} from 'lucide-react';
import type { MCPServer } from '../types';
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
import { mockMCPServers } from '../data';
import MCPServerModal from '../components/MCPServerModal';
import { mcpApi } from '../services/api';

export default function MCPServers() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { searchTerm, setSearchTerm, filteredItems: filteredServers } = useSearch(
    servers,
    ['name', 'description']
  );

  const fetchMCPServers = async () => {
    try {
      const response = await mcpApi.getMCPServers();
      setServers(response.data.mcpServers || []);
    } catch (error) {
      console.error('MCP 서버 목록 조회 실패:', error);
      // 에러 시 mock 데이터 사용
      setServers(mockMCPServers);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMCPServers();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMCPServers();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMCPServer, setSelectedMCPServer] = useState<MCPServer | null>(null);

  const handleDelete = async (mcpId: string) => {
    if (confirm('정말로 이 MCP 서버를 삭제하시겠습니까?')) {
      try {
        const response = await mcpApi.delete(mcpId);
        
        if (response.data.result === 'success') {
          alert('MCP 서버가 성공적으로 삭제되었습니다.');
          handleRefresh(); // 목록 새로고침
        } else {
          alert('MCP 서버 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('MCP 서버 삭제 실패:', error);
        alert('MCP 서버 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleToggleUseable = (mcpId: string) => {
    // 실제로는 API 호출
    console.log('Toggle MCP server:', mcpId);
  };


  const handleOpenSettings = (mcpId: string) => {
    const server = servers.find(s => s.mcpId === mcpId);
    setSelectedMCPServer(server || null);
    setIsModalOpen(true);
  };

  const handleCreateServer = () => {
    setSelectedMCPServer(null);
    setIsModalOpen(true);
  };

  const handleSaveServer = (server: MCPServer) => {
    // 실제로는 API 호출
    console.log('Save MCP server:', server);
  };

  const getStatusVariant = (state: string) => {
    return state === 'active' ? 'success' : 'error';
  };

  const getStatusText = (state: string) => {
    return state === 'active' ? '활성' : '비활성';
  };

  const getStatusIcon = (state: string) => {
    return state === 'active' ? CheckCircle : XCircle;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="MCP 서버"
        description="MCP 서버를 관리하고 도구를 확인하세요."
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button onClick={handleCreateServer}>
            <Plus className="h-4 w-4 mr-2" />
            새 서버
          </Button>
        </div>
      </PageHeader>

      {/* 검색 */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <SearchInput
            placeholder="MCP 서버 검색..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* 서버 목록 */}
      <div className="grid grid-cols-1 gap-6">
        {filteredServers.map((server) => {
          const StatusIcon = getStatusIcon(server.state);
          return (
            <Card key={server.mcpId || server.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Server className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {server.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {server.description || '설명 없음'}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <StatusBadge
                        status={getStatusText(server.state)}
                        variant={getStatusVariant(server.state)}
                      />
                      <span className="text-xs text-gray-500">
                        URL: {server.mcpUrl}
                      </span>
                      <span className="text-xs text-gray-500">
                        도구: {server.tools.length}개
                      </span>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          에이전트: {server.chatagentId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={server.state === 'active' ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleUseable(server.mcpId || server.name)}
                  >
                    {server.state === 'active' ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-1" />
                        비활성화
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-1" />
                        활성화
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenSettings(server.mcpId || server.name)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(server.mcpId || server.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredServers.length === 0 && (
        <EmptyState
          icon={Server}
          title="MCP 서버가 없습니다"
          description="새로운 MCP 서버를 추가해보세요."
          actionLabel="새 서버 추가"
          onAction={handleCreateServer}
        />
      )}


      {/* MCP 서버 모달 */}
      <MCPServerModal
        isOpen={isModalOpen}
        mcpServer={selectedMCPServer}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveServer}
        onRefresh={handleRefresh}
      />
    </div>
  );
}