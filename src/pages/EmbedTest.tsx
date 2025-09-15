import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code, Copy, Check } from 'lucide-react';
import { PageHeader, Card, Button } from '../components/ui';

export default function EmbedTest() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('service1');
  const [copied, setCopied] = useState(false);

  const services = [
    { id: 'service1', name: '고객 서비스 봇', description: '고객 문의를 처리하는 챗봇' },
    { id: 'service2', name: '기술 지원 봇', description: '기술적 문제를 해결하는 챗봇' },
    { id: 'service3', name: '영업 상담 봇', description: '제품 상담을 담당하는 챗봇' },
  ];

  const iframeCode = `<iframe 
    src="${window.location.origin}/embed/chat/${selectedService}" 
    width="100%" 
    height="600px" 
    frameborder="0"
    title="챗봇"
></iframe>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const currentUrl = `${window.location.origin}/embed/chat/${selectedService}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                관리자로
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">임베드 테스트</h1>
                <p className="text-sm text-gray-500">챗봇이 외부 사이트에서 어떻게 보이는지 테스트하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 설정 패널 */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">테스트 설정</h3>
              
              {/* 서비스 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  테스트할 서비스 선택
                </label>
                <div className="space-y-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedService === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={selectedService === service.id}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-500">{service.description}</p>
                        </div>
                        {selectedService === service.id && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 현재 URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  임베드 URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentUrl}
                    readOnly
                    className="flex-1 input rounded-r-none"
                  />
                  <Button
                    variant="outline"
                    onClick={() => window.open(currentUrl, '_blank')}
                    className="rounded-l-none border-l-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* iframe 코드 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    iframe 코드
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        복사
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                  <code>{iframeCode}</code>
                </pre>
              </div>
            </Card>

            {/* 사용 가이드 */}
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">사용 가이드</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <p>위의 iframe 코드를 복사하여 외부 웹사이트에 붙여넣으세요</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <p>width와 height 값을 원하는 크기로 조정하세요</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <p>오른쪽 미리보기에서 실제 모습을 확인하세요</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 미리보기 패널 */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">실시간 미리보기</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>실시간</span>
                </div>
              </div>
              
              {/* iframe 미리보기 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={`/embed/chat/${selectedService}`}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  title="챗봇 미리보기"
                  className="block"
                />
              </div>
            </Card>

            {/* 반응형 테스트 */}
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">반응형 테스트</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.style.width = '100%';
                        iframe.style.height = '400px';
                      }
                    }}
                  >
                    모바일
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.style.width = '100%';
                        iframe.style.height = '500px';
                      }
                    }}
                  >
                    태블릿
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe) {
                        iframe.style.width = '100%';
                        iframe.style.height = '600px';
                      }
                    }}
                  >
                    데스크톱
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  버튼을 클릭하여 다양한 화면 크기에서의 모습을 확인하세요
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
