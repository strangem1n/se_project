import { useState } from 'react';
import { 
  Plus, 
  Server, 
  Trash2, 
  Settings,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  Wrench
} from 'lucide-react';
import type { MCPServer, MCPTool } from '../types';
import { 
  PageHeader, 
  Card, 
  Button, 
  SearchInput, 
  StatusBadge, 
  EmptyState,
  LoadingPage,
  Modal,
  ModalFooter
} from '../components/ui';
import { useAsyncData, useSearch, useModal } from '../hooks';
import { mockMCPServers } from '../data';
import MCPServerModal from '../components/MCPServerModal';

export default function MCPServers() {
  const { data: servers = [], loading } = useAsyncData<MCPServer[]>(() => mockMCPServers);

  const { searchTerm, setSearchTerm, filteredItems: filteredServers } = useSearch(
    servers,
    ['name', 'description']
  );

  const toolsModal = useModal();
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMCPServer, setSelectedMCPServer] = useState<MCPServer | null>(null);

  const handleDelete = (mcpId: string) => {
    if (confirm('정말로 이 MCP 서버를 삭제하시겠습니까?')) {
      // 실제로는 API 호출
      console.log('Delete MCP server:', mcpId);
    }
  };

  const handleToggleUseable = (mcpId: string) => {
    // 실제로는 API 호출
    console.log('Toggle MCP server:', mcpId);
  };

  const handleShowTools = (server: MCPServer) => {
    setSelectedServer(server);
    toolsModal.open();
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

  const getStatusVariant = (useable: boolean) => {
    return useable ? 'success' : 'error';
  };

  const getStatusText = (useable: boolean) => {
    return useable ? '활성' : '비활성';
  };

  const getStatusIcon = (useable: boolean) => {
    return useable ? CheckCircle : XCircle;
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
        <Button onClick={handleCreateServer}>
          <Plus className="h-4 w-4 mr-2" />
          새 서버
        </Button>
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
          const StatusIcon = getStatusIcon(server.useable);
          return (
            <Card key={server.mcpId}>
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
                      {server.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <StatusBadge
                        status={getStatusText(server.useable)}
                        variant={getStatusVariant(server.useable)}
                      />
                      <span className="text-xs text-gray-500">
                        URL: {server.serverUrl}
                      </span>
                      <span className="text-xs text-gray-500">
                        도구: {server.tools.length}개
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShowTools(server)}
                  >
                    <Wrench className="h-4 w-4 mr-1" />
                    도구 보기
                  </Button>
                  <Button
                    variant={server.useable ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleUseable(server.mcpId)}
                  >
                    {server.useable ? (
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
                    onClick={() => handleOpenSettings(server.mcpId)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(server.mcpId)}
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

      {/* 도구 모달 */}
      <Modal
        isOpen={toolsModal.isOpen}
        onClose={toolsModal.close}
        title={selectedServer ? `${selectedServer.name} - 도구 목록` : '도구 목록'}
        size="lg"
        footer={
          <ModalFooter>
            <Button variant="secondary" onClick={toolsModal.close}>
              닫기
            </Button>
          </ModalFooter>
        }
      >
        {selectedServer && (
          <div className="space-y-4">
            {selectedServer.tools.map((tool, index) => (
              <Card key={index} padding="sm">
                <h4 className="font-medium text-gray-900">{tool.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-700">매개변수:</span>
                  <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    {JSON.stringify(tool.parameter, null, 2)}
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>

      {/* MCP 서버 모달 */}
      <MCPServerModal
        isOpen={isModalOpen}
        mcpServer={selectedMCPServer}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveServer}
      />
    </div>
  );
}