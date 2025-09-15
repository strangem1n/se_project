import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { PageHeader, Card, Button, StatusBadge } from '../components/ui';
import type { Agent } from '../types';
import { mockDocuments, mockModels, mockMCPServers } from '../data';

export default function AgentCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    apiUrl: '',
    method: 'POST',
  });
  
  const [connectedDocuments, setConnectedDocuments] = useState<string[]>([]);
  const [connectedModels, setConnectedModels] = useState<string[]>([]);
  const [connectedMCPServers, setConnectedMCPServers] = useState<string[]>([]);

  const handleSave = () => {
    // 실제로는 API 호출
    console.log('Creating agent:', {
      ...formData,
      connectedDocuments,
      connectedModels,
      connectedMCPServers,
    });
    
    // 목록 페이지로 돌아가기
    navigate('/admin/chat-agents');
  };

  const toggleDocument = (docId: string) => {
    setConnectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const toggleModel = (modelId: string) => {
    setConnectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const toggleMCPServer = (mcpId: string) => {
    setConnectedMCPServers(prev => 
      prev.includes(mcpId) 
        ? prev.filter(id => id !== mcpId)
        : [...prev, mcpId]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="새 챗 에이전트 생성"
        description="새로운 챗 에이전트를 생성하고 설정하세요."
      >
        <Button variant="outline" onClick={() => navigate('/admin/chat-agents')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 기본 정보 */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">에이전트 이름</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="에이전트 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <input
                  type="text"
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="에이전트 설명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
                <input
                  type="text"
                  className="input"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                  placeholder="/api/chat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">프롬프트</label>
                <textarea
                  className="input"
                  rows={4}
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="에이전트 프롬프트를 입력하세요"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* 연결된 리소스 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 연결된 문서 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">연결된 문서</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.docsId}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    connectedDocuments.includes(doc.docsId)
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => toggleDocument(doc.docsId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.documentName}</h4>
                      <p className="text-sm text-gray-500">{doc.type === 'faq' ? 'FAQ' : '가이드'}</p>
                    </div>
                    <StatusBadge
                      status={connectedDocuments.includes(doc.docsId) ? '연결됨' : '미연결'}
                      variant={connectedDocuments.includes(doc.docsId) ? 'success' : 'default'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 연결된 모델 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">연결된 모델</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    connectedModels.includes(model.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => toggleModel(model.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      <p className="text-sm text-gray-500">{model.path}</p>
                    </div>
                    <StatusBadge
                      status={connectedModels.includes(model.id) ? '연결됨' : '미연결'}
                      variant={connectedModels.includes(model.id) ? 'success' : 'default'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 연결된 MCP 서버 */}
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">연결된 MCP 서버</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockMCPServers.map((server) => (
                <div
                  key={server.mcpId}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    connectedMCPServers.includes(server.mcpId)
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => toggleMCPServer(server.mcpId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{server.name}</h4>
                      <p className="text-sm text-gray-500">{server.description}</p>
                    </div>
                    <StatusBadge
                      status={connectedMCPServers.includes(server.mcpId) ? '연결됨' : '미연결'}
                      variant={connectedMCPServers.includes(server.mcpId) ? 'success' : 'default'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => navigate('/admin/chat-agents')}>
          취소
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          생성
        </Button>
      </div>
    </div>
  );
}
