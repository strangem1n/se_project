import { useState } from 'react';
import { 
  Brain, 
  Play, 
  Settings, 
  Database,
  FileText,
  Zap
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

export default function Models() {
  const [activeTab, setActiveTab] = useState<'models' | 'adaptors' | 'finetune'>('models');

  const { data: models = [], loading: modelsLoading } = useAsyncData<Model[]>(() => mockModels);

  const { data: adaptors = [], loading: adaptorsLoading } = useAsyncData<Adaptor[]>(() => mockAdaptors);

  const loading = modelsLoading || adaptorsLoading;

  const handleFinetune = () => {
    // 파인튜닝 로직
    console.log('Starting finetune...');
  };

  const handleVectorSave = () => {
    // 벡터 DB 저장 로직
    console.log('Saving to vector DB...');
  };

  const handleChunking = () => {
    // 문서 청킹 로직
    console.log('Starting chunking...');
  };

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
            { id: 'finetune', name: '파인튜닝', icon: Zap },
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
                      <h3 className="text-lg font-medium text-gray-900">
                        {model.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        경로: {model.path}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          ID: {model.id}
                        </span>
                        {model.parentEmbeddingModelId && (
                          <span className="text-xs text-gray-500 ml-4">
                            부모 모델: {model.parentEmbeddingModelId}
                          </span>
                        )}
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
          </div>
        </div>
      )}

      {/* 어댑터 탭 */}
      {activeTab === 'adaptors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {adaptors.map((adaptor) => (
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
          </div>
        </div>
      )}

      {/* 파인튜닝 탭 */}
      {activeTab === 'finetune' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 파인튜닝 */}
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">파인튜닝</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                선택한 문서를 통해 임베딩 모델을 파인튜닝합니다.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">서비스 ID</label>
                  <input
                    type="text"
                    className="input mt-1"
                    placeholder="서비스 ID를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">문서 선택</label>
                  <select className="input mt-1" multiple>
                    <option value="1">고객 서비스 FAQ</option>
                    <option value="2">제품 사용 가이드</option>
                    <option value="3">기술 지원 FAQ</option>
                  </select>
                </div>
                <Button onClick={handleFinetune} className="w-full">
                  파인튜닝 시작
                </Button>
              </div>
            </Card>

            {/* 벡터 DB 저장 */}
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">벡터 DB 저장</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                문서를 벡터화하여 벡터 DB에 저장합니다.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">서비스 ID</label>
                  <input
                    type="text"
                    className="input mt-1"
                    placeholder="서비스 ID를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">문서 선택</label>
                  <select className="input mt-1" multiple>
                    <option value="1">고객 서비스 FAQ</option>
                    <option value="2">제품 사용 가이드</option>
                    <option value="3">기술 지원 FAQ</option>
                  </select>
                </div>
                <Button onClick={handleVectorSave} className="w-full">
                  벡터 DB 저장
                </Button>
              </div>
            </Card>

            {/* 문서 청킹 */}
            <Card>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">문서 청킹</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                문서를 적절한 크기로 분할합니다.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">서비스 ID</label>
                  <input
                    type="text"
                    className="input mt-1"
                    placeholder="서비스 ID를 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">청크 크기</label>
                  <input
                    type="number"
                    className="input mt-1"
                    placeholder="1000"
                    defaultValue={1000}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">문서 선택</label>
                  <select className="input mt-1" multiple>
                    <option value="1">고객 서비스 FAQ</option>
                    <option value="2">제품 사용 가이드</option>
                    <option value="3">기술 지원 FAQ</option>
                  </select>
                </div>
                <Button onClick={handleChunking} className="w-full">
                  청킹 시작
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}