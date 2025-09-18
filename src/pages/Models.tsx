import { useState, useEffect } from 'react';
import { 
  Brain, 
  Play, 
  Settings, 
  RefreshCw
} from 'lucide-react';
import type { Model, Adaptor } from '../types';
import { 
  PageHeader, 
  Card, 
  Button, 
  LoadingPage 
} from '../components/ui';
import { useAsyncData } from '../hooks';
import { mockModels, mockAdaptors } from '../data';
import { modelApi } from '../services/api';

export default function Models() {
  const [activeTab, setActiveTab] = useState<'models' | 'adaptors'>('models');
  const [models, setModels] = useState<Model[]>([]);
  const [adapters, setAdapters] = useState<Adaptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChatAgent, setSelectedChatAgent] = useState<string>('');

  const fetchModels = async () => {
    try {
      const response = await modelApi.getModels();
      setModels(response.data.models || []);
    } catch (error) {
      console.error('모델 목록 조회 실패:', error);
      // 에러 시 mock 데이터 사용
      setModels(mockModels);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'models') {
      await fetchModels();
    } else if (activeTab === 'adaptors' && selectedChatAgent) {
      await fetchAdapters(selectedChatAgent);
    }
  };

  const fetchAdapters = async (chatagentId: string) => {
    try {
      const response = await modelApi.getAdapters(chatagentId);
      setAdapters(response.data.adapters || []);
    } catch (error) {
      console.error('어댑터 목록 조회 실패:', error);
      // 에러 시 mock 데이터 사용
      setAdapters(mockAdaptors);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleChatAgentChange = async (chatagentId: string) => {
    setSelectedChatAgent(chatagentId);
    if (chatagentId) {
      setLoading(true);
      await fetchAdapters(chatagentId);
    } else {
      setAdapters([]);
    }
  };

  // 파인튜닝 관련 함수들 - 준비 중
  // const handleFinetune = () => {
  //   console.log('Starting finetune...');
  // };

  // const handleVectorSave = () => {
  //   console.log('Saving to vector DB...');
  // };

  // const handleChunking = () => {
  //   console.log('Starting chunking...');
  // };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="모델 관리"
        description="임베딩 모델과 어댑터를 관리하고 파인튜닝을 수행하세요."
      />

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'models', name: '모델', icon: Brain },
            { id: 'adaptors', name: '어댑터', icon: Settings },
            // { id: 'finetune', name: '파인튜닝', icon: Zap }, // 준비 중
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 모델 탭 */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">모델 목록</h2>
              <p className="text-sm text-gray-500">총 {models.length}개의 모델</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Brain className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {model.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          model.state === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {model.state === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          ID: {model.id}
                        </span>
                        {model.path && (
                          <span className="text-xs text-gray-500 ml-4">
                            경로: {model.path}
                          </span>
                        )}
                        {model.parentEmbeddingModelId && (
                          <span className="text-xs text-gray-500 ml-4">
                            부모 모델: {model.parentEmbeddingModelId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={model.state === 'active' ? 'text-green-600' : 'text-red-600'}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {model.state === 'active' ? '비활성화' : '활성화'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {models.length === 0 && (
            <div className="text-center py-12">
              <Brain className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">모델이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">새로운 모델을 추가해보세요.</p>
            </div>
          )}
        </div>
      )}

      {/* 어댑터 탭 */}
      {activeTab === 'adaptors' && (
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">어댑터 목록</h2>
              <p className="text-sm text-gray-500">총 {adapters.length}개의 어댑터</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedChatAgent}
                onChange={(e) => handleChatAgentChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">챗 에이전트를 선택하세요</option>
                <option value="agent-1">고객 서비스</option>
                <option value="agent-2">기술 지원</option>
                <option value="agent-3">영업 상담</option>
                <option value="agent-4">제품 문의</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing || !selectedChatAgent}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>
          </div>

          {!selectedChatAgent ? (
            <div className="text-center py-12">
              <Settings className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">챗 에이전트를 선택하세요</h3>
              <p className="mt-1 text-sm text-gray-500">어댑터를 조회하려면 먼저 챗 에이전트를 선택해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {adapters.map((adaptor) => (
                <Card key={adaptor.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Settings className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {adaptor.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          경로: {adaptor.path}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            ID: {adaptor.id}
                          </span>
                          <span className="text-xs text-gray-500 ml-4">
                            모델 ID: {adaptor.modelId}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        활성화
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {adapters.length === 0 && selectedChatAgent && (
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">어댑터가 없습니다</h3>
                  <p className="mt-1 text-sm text-gray-500">선택한 챗 에이전트에 연결된 어댑터가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 파인튜닝 탭 - 준비 중으로 숨김 처리 */}
    </div>
  );
}