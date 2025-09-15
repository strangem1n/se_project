import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { PageHeader, Card, Button, Input } from '../components/ui';
import type { MCPServer } from '../types';
import { mockMCPServers } from '../data';

export default function MCPServerEdit() {
  const navigate = useNavigate();
  const { mcpId } = useParams<{ mcpId: string }>();
  
  const [mcpServer, setMcpServer] = useState<MCPServer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    host: '',
    port: '',
    protocol: 'http',
  });
  
  const [functions, setFunctions] = useState<Array<{
    name: string;
    description: string;
    parameter: Record<string, string>;
  }>>([]);

  useEffect(() => {
    // MCP 서버 찾기
    const foundServer = mockMCPServers.find(server => server.mcpId === mcpId);
    
    if (foundServer) {
      setMcpServer(foundServer);
      setFormData({
        name: foundServer.name,
        description: foundServer.description,
        host: foundServer.host,
        port: foundServer.port.toString(),
        protocol: foundServer.protocol,
      });
      setFunctions(foundServer.functions || []);
    }
  }, [mcpId]);

  const handleSave = () => {
    if (!mcpServer) return;
    
    // 실제로는 API 호출
    console.log('Updating MCP server:', {
      ...mcpServer,
      ...formData,
      functions,
    });
    
    // 목록 페이지로 돌아가기
    navigate('/admin/mcp-servers');
  };

  const addFunction = () => {
    setFunctions(prev => [...prev, {
      name: '',
      description: '',
      parameter: {},
    }]);
  };

  const removeFunction = (index: number) => {
    setFunctions(prev => prev.filter((_, i) => i !== index));
  };

  const updateFunction = (index: number, field: string, value: string) => {
    setFunctions(prev => prev.map((func, i) => 
      i === index ? { ...func, [field]: value } : func
    ));
  };

  const addParameter = (funcIndex: number) => {
    setFunctions(prev => prev.map((func, i) => 
      i === funcIndex 
        ? { ...func, parameter: { ...func.parameter, '': '' } }
        : func
    ));
  };

  const removeParameter = (funcIndex: number, paramKey: string) => {
    setFunctions(prev => prev.map((func, i) => 
      i === funcIndex 
        ? { 
            ...func, 
            parameter: Object.fromEntries(
              Object.entries(func.parameter).filter(([key]) => key !== paramKey)
            )
          }
        : func
    ));
  };

  const updateParameter = (funcIndex: number, oldKey: string, newKey: string, value: string) => {
    setFunctions(prev => prev.map((func, i) => 
      i === funcIndex 
        ? { 
            ...func, 
            parameter: {
              ...Object.fromEntries(
                Object.entries(func.parameter).filter(([key]) => key !== oldKey)
              ),
              [newKey]: value
            }
          }
        : func
    ));
  };

  if (!mcpServer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">MCP 서버를 찾을 수 없습니다</h3>
          <p className="text-gray-500 mt-2">요청하신 MCP 서버가 존재하지 않습니다.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/admin/mcp-servers')}
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${mcpServer.name} 수정`}
        description="MCP 서버 설정을 수정하세요."
      >
        <Button variant="outline" onClick={() => navigate('/admin/mcp-servers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <div>
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">서버 이름</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="MCP 서버 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <input
                  type="text"
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="MCP 서버 설명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">호스트</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.host}
                    onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="localhost"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">포트</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.port}
                    onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                    placeholder="8080"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">프로토콜</label>
                <select
                  className="input"
                  value={formData.protocol}
                  onChange={(e) => setFormData(prev => ({ ...prev, protocol: e.target.value }))}
                >
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="ws">WebSocket</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* 함수 목록 */}
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">함수 목록</h3>
              <Button onClick={addFunction} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                함수 추가
              </Button>
            </div>
            
            <div className="space-y-4">
              {functions.map((func, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">함수 {index + 1}</h4>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => removeFunction(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">함수명</label>
                      <input
                        type="text"
                        className="input"
                        value={func.name}
                        onChange={(e) => updateFunction(index, 'name', e.target.value)}
                        placeholder="함수명을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                      <input
                        type="text"
                        className="input"
                        value={func.description}
                        onChange={(e) => updateFunction(index, 'description', e.target.value)}
                        placeholder="함수 설명을 입력하세요"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">매개변수</label>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addParameter(index)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          추가
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(func.parameter).map(([key, value], paramIndex) => (
                          <div key={paramIndex} className="flex space-x-2">
                            <input
                              type="text"
                              className="input flex-1"
                              value={key}
                              onChange={(e) => updateParameter(index, key, e.target.value, value)}
                              placeholder="매개변수명"
                            />
                            <input
                              type="text"
                              className="input flex-1"
                              value={value}
                              onChange={(e) => updateParameter(index, key, key, e.target.value)}
                              placeholder="타입"
                            />
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => removeParameter(index, key)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {functions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>아직 함수가 없습니다.</p>
                  <p className="text-sm">"함수 추가" 버튼을 클릭하여 함수를 추가하세요.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => navigate('/admin/mcp-servers')}>
          취소
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          저장
        </Button>
      </div>
    </div>
  );
}
