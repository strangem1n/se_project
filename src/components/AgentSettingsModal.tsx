import { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileText, Brain, Server } from 'lucide-react';
import { Button, Card, StatusBadge } from './ui';
import type { Agent, Document, Model, MCPServer } from '../types';
import { mockDocuments, mockModels, mockMCPServers } from '../data';

interface AgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onSave: (updatedAgent: Agent) => void;
}

export default function AgentSettingsModal({ isOpen, onClose, agent, onSave }: AgentSettingsModalProps) {
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

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        prompt: agent.prompt,
        apiUrl: agent.apiUrl,
        method: agent.method,
      });
      setConnectedDocuments(agent.connectedDocuments || []);
      setConnectedModels(agent.connectedModels || []);
      setConnectedMCPServers(agent.connectedMCPServers || []);
    }
  }, [agent]);

  // 디버깅용 로그
  console.log('AgentSettingsModal render:', { isOpen, agent });

  const handleSave = () => {
    if (!agent) {
      console.error('No agent selected');
      return;
    }
    
    const updatedAgent: Agent = {
      ...agent,
      ...formData,
      connectedDocuments,
      connectedModels,
      connectedMCPServers,
    };
    
    onSave(updatedAgent);
    onClose();
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

  const getDocumentName = (docId: string) => {
    const doc = mockDocuments.find(d => d.docsId === docId);
    return doc ? doc.documentName : `문서 ${docId}`;
  };

  const getModelName = (modelId: string) => {
    const model = mockModels.find(m => m.id === modelId);
    return model ? model.name : `모델 ${modelId}`;
  };

  const getMCPServerName = (mcpId: string) => {
    const server = mockMCPServers.find(s => s.mcpId === mcpId);
    return server ? server.name : `MCP 서버 ${mcpId}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">챗 에이전트 설정</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center py-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {agent ? `${agent.name} 설정` : '에이전트 설정'}
                </h4>
                <p className="text-gray-500">
                  {agent ? `에이전트 ID: ${agent.agentId}` : '에이전트를 선택해주세요.'}
                </p>
              </div>
              
              {agent && (
                <>
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">에이전트 이름</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
            <input
              type="text"
              className="input"
              value={formData.apiUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <input
              type="text"
              className="input"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">프롬프트</label>
            <textarea
              className="input"
              rows={3}
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            />
          </div>
        </div>

        {/* 연결된 문서 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            연결된 문서
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockDocuments.map((doc) => (
              <Card
                key={doc.docsId}
                padding="sm"
                className={`cursor-pointer transition-colors ${
                  connectedDocuments.includes(doc.docsId)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
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
              </Card>
            ))}
          </div>
        </div>

        {/* 연결된 모델 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            연결된 모델
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockModels.map((model) => (
              <Card
                key={model.id}
                padding="sm"
                className={`cursor-pointer transition-colors ${
                  connectedModels.includes(model.id)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
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
              </Card>
            ))}
          </div>
        </div>

        {/* 연결된 MCP 서버 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Server className="h-5 w-5 mr-2" />
            연결된 MCP 서버
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockMCPServers.map((server) => (
              <Card
                key={server.mcpId}
                padding="sm"
                className={`cursor-pointer transition-colors ${
                  connectedMCPServers.includes(server.mcpId)
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
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
              </Card>
            ))}
          </div>
        </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
