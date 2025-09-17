import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui';
import type { MCPServer, MCPTool } from '../types';

interface MCPServerModalProps {
  isOpen: boolean;
  mcpServer: MCPServer | null;
  onClose: () => void;
  onSave: (mcpServer: MCPServer) => void;
}

export default function MCPServerModal({
  isOpen,
  mcpServer,
  onClose,
  onSave
}: MCPServerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serverUrl: '',
    useable: true,
    tools: [] as MCPTool[]
  });

  useEffect(() => {
    if (mcpServer) {
      setFormData({
        name: mcpServer.name,
        description: mcpServer.description,
        serverUrl: mcpServer.serverUrl,
        useable: mcpServer.useable,
        tools: mcpServer.tools || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        serverUrl: '',
        useable: true,
        tools: []
      });
    }
  }, [mcpServer]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('MCP 서버 이름을 입력해주세요.');
      return;
    }

    if (!formData.serverUrl.trim()) {
      alert('서버 URL을 입력해주세요.');
      return;
    }

    const updatedMCPServer: MCPServer = {
      mcpId: mcpServer?.mcpId || `mcp_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      serverUrl: formData.serverUrl,
      useable: formData.useable,
      tools: formData.tools
    };

    onSave(updatedMCPServer);
    onClose();
  };

  const addTool = () => {
    const newTool: MCPTool = {
      name: '',
      description: '',
      parameter: {}
    };
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, newTool]
    }));
  };

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));
  };

  const updateTool = (index: number, field: keyof MCPTool, value: any) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.map((tool, i) => 
        i === index ? { ...tool, [field]: value } : tool
      )
    }));
  };

  const addParameter = (toolIndex: number) => {
    const tool = formData.tools[toolIndex];
    const newParamName = prompt('새 파라미터 이름을 입력하세요:');
    if (newParamName) {
      updateTool(toolIndex, 'parameter', {
        ...tool.parameter,
        [newParamName]: 'string'
      });
    }
  };

  const removeParameter = (toolIndex: number, paramName: string) => {
    const tool = formData.tools[toolIndex];
    const newParams = { ...tool.parameter };
    delete newParams[paramName];
    updateTool(toolIndex, 'parameter', newParams);
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
              {mcpServer ? 'MCP 서버 수정' : 'MCP 서버 생성'}
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
                    서버 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MCP 서버 이름을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용 가능 여부
                  </label>
                  <select
                    value={formData.useable ? 'true' : 'false'}
                    onChange={(e) => setFormData(prev => ({ ...prev, useable: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">사용 가능</option>
                    <option value="false">사용 불가</option>
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
                  placeholder="MCP 서버 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  서버 URL *
                </label>
                <input
                  type="url"
                  value={formData.serverUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, serverUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://mcp-server.example.com"
                />
              </div>
            </div>

            {/* 도구 관리 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">도구 관리</h3>
                <Button onClick={addTool} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  도구 추가
                </Button>
              </div>

              <div className="space-y-4">
                {formData.tools.map((tool, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">도구 {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTool(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          도구 이름
                        </label>
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateTool(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="도구 이름을 입력하세요"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          도구 설명
                        </label>
                        <input
                          type="text"
                          value={tool.description}
                          onChange={(e) => updateTool(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="도구 설명을 입력하세요"
                        />
                      </div>
                    </div>

                    {/* 파라미터 관리 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          파라미터
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addParameter(index)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          파라미터 추가
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {Object.entries(tool.parameter).map(([paramName, paramType]) => (
                          <div key={paramName} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={paramName}
                              onChange={(e) => {
                                const newParams = { ...tool.parameter };
                                delete newParams[paramName];
                                newParams[e.target.value] = paramType;
                                updateTool(index, 'parameter', newParams);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                              value={paramType}
                              onChange={(e) => {
                                const newParams = { ...tool.parameter };
                                newParams[paramName] = e.target.value;
                                updateTool(index, 'parameter', newParams);
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="string">string</option>
                              <option value="number">number</option>
                              <option value="boolean">boolean</option>
                              <option value="object">object</option>
                            </select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeParameter(index, paramName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {formData.tools.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>등록된 도구가 없습니다.</p>
                    <p className="text-sm">위의 "도구 추가" 버튼을 클릭하여 도구를 추가하세요.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              {mcpServer ? '수정' : '생성'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
