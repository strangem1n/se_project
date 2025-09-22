import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui';
import type { Agent } from '../types';
import { chatAgentApi, mcpApi, modelApi, documentApi } from '../services/api';

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
    connectedModels: [] as string[],
    connectedMCPServers: [] as string[],
    connectedAdapters: [] as string[]
  });

  const [saving, setSaving] = useState(false);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [availableMCPServers, setAvailableMCPServers] = useState<any[]>([]);
  const [loadingMCPServers, setLoadingMCPServers] = useState(false);
  const [availableAdapters, setAvailableAdapters] = useState<any[]>([]);
  const [loadingAdapters, setLoadingAdapters] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileUsage, setFileUsage] = useState<{[key: string]: {rag: boolean, finetuning: boolean}}>({});
  const [existingDocs, setExistingDocs] = useState<Array<{id: string, name: string}>>([]);
  const [existingDocUsage, setExistingDocUsage] = useState<{[key: string]: {rag: boolean, finetuning: boolean}}>({});

  useEffect(() => {
    if (agent) {
      setFormData({
        id: agent.id,
        serviceName: agent.serviceName,
        state: agent.state,
        connectedModels: agent.connectedModels || [],
        connectedMCPServers: agent.connectedMCPServers || [],
        connectedAdapters: agent.connectedAdapters || []
      });

      // 상세보기 API 호출
      fetchAgentDetail(agent.id);
    } else {
      setFormData({
        id: '',
        serviceName: '',
        state: 'active',
        connectedModels: [],
        connectedMCPServers: [],
        connectedAdapters: []
      });
    }
    
    // 모델, MCP 서버, 어댑터 목록 가져오기
    fetchModels();
    fetchMCPServers();
    if (agent) {
      fetchAdapters(agent.id);
    }
  }, [agent]);

  const fetchAgentDetail = async (agentId: string) => {
    try {
      const response = await chatAgentApi.getAgentDetail(agentId);
      const agentDetail = response.data;
      
      // 기존 문서 목록 설정
      setExistingDocs(agentDetail.docs || []);
      
      // 기존 문서 사용법 초기화 (기본값: 모두 false)
      const initialDocUsage: {[key: string]: {rag: boolean, finetuning: boolean}} = {};
      (agentDetail.docs || []).forEach(doc => {
        initialDocUsage[doc.id] = { rag: false, finetuning: false };
      });
      setExistingDocUsage(initialDocUsage);
      
      // 선택된 모델, MCP 서버, 어댑터 설정
      setFormData(prev => ({
        ...prev,
        connectedModels: agentDetail.embeddingModel ? [agentDetail.embeddingModel.id] : [],
        connectedMCPServers: (agentDetail.mcpServers || [])
          .filter(mcp => mcp.isActive)
          .map(mcp => mcp.id),
        connectedAdapters: [] // 어댑터는 별도 API로 가져옴
      }));
      
    } catch (error) {
      console.error('챗 에이전트 상세보기 조회 실패:', error);
    }
  };

  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const response = await modelApi.getModels();
      setAvailableModels(response.data.models || []);
    } catch (error) {
      console.error('모델 목록 조회 실패:', error);
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
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

  const fetchAdapters = async (chatagentId: string) => {
    setLoadingAdapters(true);
    try {
      const response = await modelApi.getAdapters(chatagentId);
      setAvailableAdapters(response.data.adapters || []);
    } catch (error) {
      console.error('어댑터 목록 조회 실패:', error);
      setAvailableAdapters([]);
    } finally {
      setLoadingAdapters(false);
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

      // 현재 로그인한 사용자 ID (임시로 'admin-1' 사용)
      const currentUserId = 'admin-1';

      // 파일 업로드 처리 (수정 시에만)
      let uploadedDocIds: string[] = [];
      if (agent && uploadedFiles.length > 0) {
        const fileFormData = new FormData();
        uploadedFiles.forEach(file => {
          fileFormData.append('files', file);
        });
        
        const uploadResponse = await documentApi.uploadToAgent(agent.id, fileFormData);
        uploadedDocIds = uploadResponse.data.map((id: number) => id.toString());
      }

      // RAG/파인튜닝용 문서 ID 분류
      const ragDocs: string[] = [];
      const finetuneDocs: string[] = [];
      
      // 새로 업로드한 파일들 처리
      uploadedFiles.forEach((file, index) => {
        const docId = uploadedDocIds[index];
        if (fileUsage[file.name]?.rag) {
          ragDocs.push(docId);
        }
        if (fileUsage[file.name]?.finetuning) {
          finetuneDocs.push(docId);
        }
      });
      
      // 기존 문서들 처리
      existingDocs.forEach(doc => {
        if (existingDocUsage[doc.id]?.rag) {
          ragDocs.push(doc.id);
        }
        if (existingDocUsage[doc.id]?.finetuning) {
          finetuneDocs.push(doc.id);
        }
      });

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
          connectedModels: formData.connectedModels,
          connectedMCPServers: formData.connectedMCPServers,
          connectedAdapters: formData.connectedAdapters
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

  const handleAdapterToggle = (adapterId: string) => {
    setFormData(prev => ({
      ...prev,
      connectedAdapters: prev.connectedAdapters.includes(adapterId)
        ? prev.connectedAdapters.filter(id => id !== adapterId)
        : [...prev.connectedAdapters, adapterId]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // 새 파일들의 사용법 초기화
      const newFileUsage: {[key: string]: {rag: boolean, finetuning: boolean}} = {};
      newFiles.forEach(file => {
        newFileUsage[file.name] = { rag: false, finetuning: false };
      });
      setFileUsage(prev => ({ ...prev, ...newFileUsage }));
    }
  };

  const handleFileRemove = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    setFileUsage(prev => {
      const newUsage = { ...prev };
      delete newUsage[fileName];
      return newUsage;
    });
  };

  const handleUsageToggle = (fileName: string, type: 'rag' | 'finetuning') => {
    setFileUsage(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [type]: !prev[fileName][type]
      }
    }));
  };

  const handleExistingDocUsageToggle = (docId: string, type: 'rag' | 'finetuning') => {
    setExistingDocUsage(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [type]: !prev[docId][type]
      }
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
            {/* 서비스 이름 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">서비스 이름 *</h3>
              
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="서비스 이름을 입력하세요"
              />
            </div>

            {/* 문서 첨부 (수정 시에만) */}
            {agent && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">문서 첨부</h3>
                  <p className="text-sm text-gray-500 mt-1">여러 파일을 선택하여 업로드할 수 있습니다.</p>
                </div>
                
                {/* 파일 업로드 버튼 */}
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    파일 첨부
                  </label>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT, MD 파일 지원</p>
                </div>

                {/* 문서 목록 */}
                {(existingDocs.length > 0 || uploadedFiles.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">문서 목록</h4>
                    
                    {/* 문서 목록 테이블 */}
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              문서명
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              크기/상태
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              RAG 사용
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              파인튜닝 사용
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              삭제
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* 기존 문서들 */}
                          {existingDocs.map((doc) => (
                            <tr key={`existing-${doc.id}`} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                    기존
                                  </span>
                                  {doc.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                등록됨
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={existingDocUsage[doc.id]?.rag || false}
                                  onChange={() => handleExistingDocUsageToggle(doc.id, 'rag')}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={existingDocUsage[doc.id]?.finetuning || false}
                                  onChange={() => handleExistingDocUsageToggle(doc.id, 'finetuning')}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => {
                                    // 기존 문서 삭제 기능 (추후 구현)
                                    console.log('기존 문서 삭제:', doc.id);
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                          
                          {/* 새로 업로드한 파일들 */}
                          {uploadedFiles.map((file) => (
                            <tr key={`new-${file.name}`} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                                    신규
                                  </span>
                                  {file.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={fileUsage[file.name]?.rag || false}
                                  onChange={() => handleUsageToggle(file.name, 'rag')}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={fileUsage[file.name]?.finetuning || false}
                                  onChange={() => handleUsageToggle(file.name, 'finetuning')}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleFileRemove(file.name)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 연결된 모델 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">연결된 모델</h3>
              {loadingModels ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">모델 목록을 불러오는 중...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableModels.map((model) => (
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
              )}
            </div>

            {/* 연결된 어댑터 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">연결된 어댑터</h3>
              
              {loadingAdapters ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">어댑터 목록을 불러오는 중...</span>
                </div>
              ) : availableAdapters.length > 0 ? (
                <div className="space-y-2">
                  {availableAdapters.map((adapter) => (
                    <label key={adapter.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.connectedAdapters.includes(adapter.id)}
                        onChange={() => handleAdapterToggle(adapter.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{adapter.name}</div>
                        <div className="text-xs text-gray-500">{adapter.path}</div>
                        <div className="text-xs text-gray-400">모델: {adapter.modelId}</div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>

            {/* 연결된 MCP 서버 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">연결된 MCP 서버</h3>
              </div>
              
              {loadingMCPServers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">MCP 서버 목록을 불러오는 중...</span>
                </div>
              ) : availableMCPServers.length > 0 ? (
                <div className="space-y-2">
                  {availableMCPServers.map((mcp) => (
                    <label key={mcp.id || mcp.mcpId || mcp.name} className="flex items-center space-x-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.connectedMCPServers.includes(mcp.id || mcp.mcpId || mcp.name || '')}
                        onChange={() => handleMCPServerToggle(mcp.id || mcp.mcpId || mcp.name || '')}
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
                  {availableMCPServers.map((mcp) => (
                    <label key={mcp.id || mcp.mcpId} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.connectedMCPServers.includes(mcp.id || mcp.mcpId || '')}
                        onChange={() => handleMCPServerToggle(mcp.id || mcp.mcpId || '')}
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