import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, FileText } from 'lucide-react';
import { Button } from './ui';
import type { Agent, Document } from '../types';
import { mockModels, mockMCPServers } from '../data';

interface AgentSettingsModalProps {
  isOpen: boolean;
  agent: Agent | null;
  onClose: () => void;
  onSave: (agent: Agent) => void;
}

export default function AgentSettingsModal({
  isOpen,
  agent,
  onClose,
  onSave
}: AgentSettingsModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    apiUrl: '',
    method: 'POST',
    documents: [] as Document[],
    connectedModels: [] as string[],
    connectedMCPServers: [] as string[]
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        description: agent.description,
        prompt: agent.prompt,
        apiUrl: agent.apiUrl,
        method: agent.method,
        documents: [], // 기존 문서는 별도로 관리
        connectedModels: agent.connectedModels || [],
        connectedMCPServers: agent.connectedMCPServers || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        prompt: '',
        apiUrl: '',
        method: 'POST',
        documents: [],
        connectedModels: [],
        connectedMCPServers: []
      });
    }
  }, [agent]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('에이전트 이름을 입력해주세요.');
      return;
    }

    if (formData.documents.length === 0) {
      alert('최소 하나의 문서를 첨부해주세요.');
      return;
    }

    const updatedAgent: Agent = {
      agentId: agent?.agentId || `agent_${Date.now()}`,
      state: agent?.state || 'active',
      name: formData.name,
      description: formData.description,
      prompt: formData.prompt,
      apiUrl: formData.apiUrl,
      method: formData.method,
      isConfirmed: true,
      connectedDocuments: formData.documents.map(doc => doc.docsId),
      connectedModels: formData.connectedModels,
      connectedMCPServers: formData.connectedMCPServers
    };

    onSave(updatedAgent);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocuments: Document[] = Array.from(files).map(file => ({
        docsId: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        documentName: file.name,
        type: 'faq' as 'faq' | 'guide',
        file: file,
        uploadedAt: new Date()
      }));

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    }
  };

  const handleDocumentTypeChange = (docId: string, type: 'faq' | 'guide') => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.docsId === docId ? { ...doc, type } : doc
      )
    }));
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.docsId !== docId)
    }));
  };

  const handleModelToggle = (modelId: string) => {
    setFormData(prev => ({
      ...prev,
      connectedModels: prev.connectedModels.includes(modelId)
        ? prev.connectedModels.filter(id => id !== modelId)
        : [...prev.connectedModels, modelId]
    }));
  };

  const handleMCPServerToggle = (mcpId: string) => {
    setFormData(prev => ({
      ...prev,
      connectedMCPServers: prev.connectedMCPServers.includes(mcpId)
        ? prev.connectedMCPServers.filter(id => id !== mcpId)
        : [...prev.connectedMCPServers, mcpId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {agent ? '챗 에이전트 수정' : '챗 에이전트 생성'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">기본 정보</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    에이전트 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="에이전트 이름을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API 메소드
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="에이전트 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  프롬프트
                </label>
                <textarea
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="AI 프롬프트를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API URL
                </label>
                <input
                  type="url"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.example.com/chat"
                />
              </div>
            </div>

            {/* 문서 첨부 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">문서 첨부 *</h3>
              
              {/* 파일 업로드 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>파일 선택</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt,.md"
                        multiple
                      />
                    </label>
                    <p className="pl-1 text-gray-600">또는 드래그 앤 드롭</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, TXT, MD 파일 지원 (여러 파일 선택 가능)
                  </p>
                </div>
              </div>

              {/* 첨부된 문서 목록 */}
              {formData.documents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">첨부된 문서</h4>
                  {formData.documents.map((doc) => (
                    <div key={doc.docsId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.documentName}</div>
                          <div className="text-xs text-gray-500">
                            {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={doc.type}
                          onChange={(e) => handleDocumentTypeChange(doc.docsId, e.target.value as 'faq' | 'guide')}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="faq">FAQ</option>
                          <option value="guide">가이드</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.docsId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 연결된 모델 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">연결된 모델</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockModels.map((model) => (
                  <label key={model.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.connectedModels.includes(model.id)}
                      onChange={() => handleModelToggle(model.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.path}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 연결된 MCP 서버 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">연결된 MCP 서버</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockMCPServers.map((mcp) => (
                  <label key={mcp.mcpId} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.connectedMCPServers.includes(mcp.mcpId)}
                      onChange={() => handleMCPServerToggle(mcp.mcpId)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{mcp.name}</div>
                      <div className="text-xs text-gray-500">{mcp.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              {agent ? '수정' : '생성'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}