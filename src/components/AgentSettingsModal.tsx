import React, { useState, useEffect } from 'react';
import { X, Trash2, FileText, Image } from 'lucide-react';
import { Button } from './ui';
import type { Agent, Document, AgentDetail } from '../types';
import { mockModels, mockMCPServers } from '../data';
import { documentApi, chatAgentApi, mcpApi } from '../services/api';

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
    id: '',
    serviceName: '',
    state: 'active',
    logoUrl: '',
    documents: [] as Document[],
    connectedModels: [] as string[],
    connectedMCPServers: [] as string[]
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [agentDetail, setAgentDetail] = useState<AgentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [availableMCPServers, setAvailableMCPServers] = useState<any[]>([]);
  const [loadingMCPServers, setLoadingMCPServers] = useState(false);
  const [savingMCPServers, setSavingMCPServers] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({
        id: agent.id,
        serviceName: agent.serviceName,
        state: agent.state,
        logoUrl: agent.logoUrl || '',
        documents: agent.documents || [],
        connectedModels: agent.connectedModels || [],
        connectedMCPServers: agent.connectedMCPServers || []
      });

      // 상세보기 API 호출
      fetchAgentDetail(agent.id);
    } else {
      setFormData({
        id: '',
        serviceName: '',
        state: 'active',
        logoUrl: '',
        documents: [],
        connectedModels: [],
        connectedMCPServers: []
      });
      setAgentDetail(null);
    }
    
    // MCP 서버 목록 가져오기
    fetchMCPServers();
  }, [agent]);

  const fetchAgentDetail = async (agentId: string) => {
    setLoadingDetail(true);
    try {
      const response = await chatAgentApi.getAgentDetail(agentId);
      setAgentDetail(response.data);
    } catch (error) {
      console.error('챗 에이전트 상세보기 조회 실패:', error);
      setAgentDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchMCPServers = async () => {
    setLoadingMCPServers(true);
    try {
      const response = await mcpApi.getMCPServers();
      setAvailableMCPServers(response.data.mcpServers || []);
    } catch (error) {
      console.error('MCP 서버 목록 조회 실패:', error);
    } finally {
      setLoadingMCPServers(false);
    }
  };

  const handleSave = async () => {
    if (!formData.serviceName.trim()) {
      alert('서비스 이름을 입력해주세요.');
      return;
    }

    // 임베딩 모델이 선택되지 않은 경우
    if (formData.connectedModels.length === 0) {
      alert('최소 하나의 임베딩 모델을 선택해주세요.');
      return;
    }

    setSaving(true);
    try {
      // 문서에서 RAG와 파인튜닝용 문서 ID 분리
      const ragDocs = formData.documents
        .filter(doc => doc.useForRAG)
        .map(doc => doc.docsId);
      
      const finetuneDocs = formData.documents
        .filter(doc => doc.useForFinetuning)
        .map(doc => doc.docsId);

      // 현재 로그인한 사용자 ID (임시로 'admin-1' 사용)
      const currentUserId = 'admin-1';

      // API 호출 데이터 준비
      const apiData = {
        devServiceName: formData.serviceName,
        userId: currentUserId, // 현재 로그인한 사용자 ID 사용
        embeddingModelId: formData.connectedModels[0], // 첫 번째 모델 사용
        mcpIds: formData.connectedMCPServers,
        finetuneDocs: finetuneDocs,
        ragDocs: ragDocs
      };

      // 실제 API 호출
      const response = await chatAgentApi.createAgent(apiData);
      
      if (response.data.result === 'success') {
        // 성공 시 로컬 상태 업데이트
        const updatedAgent: Agent = {
          id: formData.id || `agent_${Date.now()}`,
          serviceName: formData.serviceName,
          state: formData.state,
          userId: currentUserId, // 현재 로그인한 사용자 ID 사용
          logoUrl: formData.logoUrl,
          documents: formData.documents,
          connectedModels: formData.connectedModels,
          connectedMCPServers: formData.connectedMCPServers
        };

        onSave(updatedAgent);
        onClose();
        alert('챗 에이전트가 성공적으로 생성되었습니다.');
      } else {
        alert('챗 에이전트 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('챗 에이전트 생성 실패:', error);
      alert('챗 에이전트 생성 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const fileFormData = new FormData();
      Array.from(files).forEach(file => {
        fileFormData.append('files', file);
      });

      // API 호출
      const response = await documentApi.uploadToAgent(formData.id || 'temp', fileFormData);
      
      // 응답에서 docsId 배열 받기
      const docsIds: number[] = response.data;
      
      // 업로드된 문서 정보 저장
      // 업로드된 문서 정보는 formData.documents에 저장됨
      
      // 로컬 문서 목록에도 추가 (체크박스용)
      const newDocuments: Document[] = Array.from(files).map((file, index) => ({
        docsId: docsIds[index].toString(),
        documentName: file.name,
        type: 'faq' as 'faq' | 'guide',
        file: file,
        uploadedAt: new Date(),
        useForRAG: false,
        useForFinetuning: false
      }));

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
      
    } catch (error) {
      console.error('문서 업로드 실패:', error);
      alert('문서 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      // 파일 입력 초기화
      e.target.value = '';
    }
  };


  const handleRemoveDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.docsId !== docId)
    }));
    
    // 업로드된 문서 목록에서도 제거
    // 업로드된 문서 목록에서 제거 (필요시 구현)
  };

  const handleRAGToggle = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.docsId === docId ? { ...doc, useForRAG: !doc.useForRAG } : doc
      )
    }));
  };

  const handleFinetuningToggle = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.docsId === docId ? { ...doc, useForFinetuning: !doc.useForFinetuning } : doc
      )
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // FileReader를 사용하여 이미지를 base64로 변환
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData(prev => ({
        ...prev,
        logoUrl: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logoUrl: ''
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

  const handleSaveMCPServers = async () => {
    if (!agent?.id) return;
    
    setSavingMCPServers(true);
    try {
      const mcpIds = availableMCPServers.map(mcp => ({
        mcpId: mcp.mcpId || mcp.name || '',
        isUsing: formData.connectedMCPServers.includes(mcp.mcpId || mcp.name || '')
      }));

      const response = await mcpApi.selectForAgent(agent.id, { mcpIds });
      
      if (response.data.result === 'success') {
        alert('MCP 서버 선택이 성공적으로 저장되었습니다.');
        fetchAgentDetail(agent.id); // 상세 정보 새로고침
      } else {
        alert('MCP 서버 선택 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('MCP 서버 선택 저장 실패:', error);
      alert('MCP 서버 선택 저장 중 오류가 발생했습니다.');
    } finally {
      setSavingMCPServers(false);
    }
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
              <h3 className="text-lg font-medium text-gray-900">필수 정보</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  서비스 이름 *
                </label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="서비스 이름을 입력하세요"
                />
              </div>

              {/* 로고 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  서비스 로고
                </label>
                <div className="space-y-3">
                  {formData.logoUrl ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={formData.logoUrl}
                          alt="서비스 로고"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span className="text-sm">변경</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="sr-only"
                          />
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          제거
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Image className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <label className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>로고 이미지 선택</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="sr-only"
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, SVG 파일 지원 (최대 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* 문서 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">문서 첨부</h3>
              
              {/* 파일 업로드 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>{uploading ? '업로드 중...' : '파일 선택'}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt,.md"
                        multiple
                        disabled={uploading}
                      />
                    </label>
                    <p className="pl-1 text-gray-600">또는 드래그 앤 드롭</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, TXT, MD 파일 지원 (여러 파일 선택 가능)
                  </p>
                </div>
              </div>

              {/* 업로드된 문서 목록 */}
              {formData.documents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">업로드된 문서</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            파일명
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Docs ID
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            RAG 사용
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            파인튜닝 사용
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            액션
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.documents.map((doc) => (
                          <tr key={doc.docsId}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{doc.documentName}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {doc.docsId}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <input
                                type="checkbox"
                                checked={doc.useForRAG || false}
                                onChange={() => handleRAGToggle(doc.docsId)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <input
                                type="checkbox"
                                checked={doc.useForFinetuning || false}
                                onChange={() => handleFinetuningToggle(doc.docsId)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveDocument(doc.docsId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 로딩 상태 표시 */}
            {agent && loadingDetail && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">상세 정보를 불러오는 중...</span>
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">연결된 MCP 서버</h3>
                {agent && (
                  <Button
                    onClick={handleSaveMCPServers}
                    disabled={savingMCPServers}
                    size="sm"
                  >
                    {savingMCPServers ? '저장 중...' : 'MCP 서버 선택 저장'}
                  </Button>
                )}
              </div>
              
              {loadingMCPServers ? (
                <div className="text-center py-4 text-gray-500">
                  <p>MCP 서버 목록을 불러오는 중...</p>
                </div>
              ) : availableMCPServers.length > 0 ? (
                <div className="space-y-2">
                  {availableMCPServers.map((mcp) => (
                    <label key={mcp.mcpId || mcp.name} className="flex items-center space-x-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.connectedMCPServers.includes(mcp.mcpId || mcp.name || '')}
                        onChange={() => handleMCPServerToggle(mcp.mcpId || mcp.name || '')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{mcp.name}</div>
                        <div className="text-xs text-gray-500">{mcp.mcpUrl || mcp.serverUrl}</div>
                        <div className="text-xs text-gray-400">상태: {mcp.state}</div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {mockMCPServers.map((mcp) => (
                    <label key={mcp.mcpId} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.connectedMCPServers.includes(mcp.mcpId || '')}
                        onChange={() => handleMCPServerToggle(mcp.mcpId || '')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{mcp.name}</div>
                        <div className="text-xs text-gray-500">{mcp.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '처리 중...' : (agent ? '수정' : '생성')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}