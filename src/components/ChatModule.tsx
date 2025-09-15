import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Settings, Minimize2, Maximize2, ArrowLeft, RotateCcw, Trash2, History, X, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui';
import type { ChatMessage } from '../types';

interface ChatModuleProps {
  serviceId: string;
  isEmbedded?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

export default function ChatModule({ 
  serviceId, 
  isEmbedded = false, 
  onMinimize, 
  onMaximize,
  className = '' 
}: ChatModuleProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 실제로는 API 호출
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `# ${serviceId} 서비스 답변

안녕하세요! **${serviceId}** 서비스입니다.

"${inputValue}"에 대한 답변을 드리겠습니다:

## 주요 내용
- 첫 번째 포인트
- 두 번째 포인트  
- 세 번째 포인트

### 추가 정보
> 이는 예시 답변입니다. 실제로는 AI가 생성한 답변이 표시됩니다.

\`\`\`javascript
// 코드 예시
console.log("챗봇 응답");
\`\`\`

더 궁금한 것이 있으시면 언제든지 물어보세요! 😊`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized && onMaximize) {
      onMaximize();
    } else if (!isMinimized && onMinimize) {
      onMinimize();
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleClearHistory = () => {
    if (confirm('현재 대화 내역을 모두 삭제하시겠습니까?')) {
      setMessages([]);
    }
  };

  const handleLoadHistory = () => {
    // 실제로는 API에서 이전 대화 내역을 불러옴
    const sampleHistory: ChatMessage[] = [
      {
        id: '1',
        content: '안녕하세요!',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000), // 1시간 전
      },
      {
        id: '2',
        content: `# 안녕하세요!

안녕하세요! **${serviceId}** 서비스입니다.

무엇을 도와드릴까요?`,
        sender: 'bot',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '3',
        content: '서비스에 대해 알고 싶어요',
        sender: 'user',
        timestamp: new Date(Date.now() - 1800000), // 30분 전
      },
      {
        id: '4',
        content: `# 서비스 소개

## 주요 기능
- **실시간 채팅**: 24시간 고객 지원
- **AI 답변**: 지능적인 질문 응답
- **다양한 서비스**: 여러 분야의 전문 지식

### 이용 방법
1. 질문을 입력하세요
2. AI가 답변을 생성합니다
3. 추가 질문이 있으면 계속 물어보세요

더 궁금한 것이 있으시면 언제든지 말씀해주세요!`,
        sender: 'bot',
        timestamp: new Date(Date.now() - 1800000),
      },
    ];
    setMessages(sampleHistory);
    setShowHistory(false);
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={toggleMinimize}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`${isEmbedded ? 'h-full' : 'h-screen'} flex flex-col bg-white ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center">
          {!isEmbedded && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="mr-3 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <Bot className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">챗봇 서비스</h2>
            <p className="text-sm text-gray-500">서비스 ID: {serviceId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {isEmbedded && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMinimize}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 대화 내역 패널 */}
      {showHistory && (
        <div className="border-b bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">대화 내역</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadHistory}
              className="w-full justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              이전 대화 불러오기
            </Button>
            <p className="text-xs text-gray-500">
              현재 {messages.length}개의 메시지가 있습니다
            </p>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              안녕하세요! 👋
            </h3>
            <p className="text-gray-500">
              무엇을 도와드릴까요? 질문을 입력해보세요.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'user' ? (
              // 사용자 메시지 - 말풍선 스타일
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-600 text-white">
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // 봇 메시지 - 마크다운 스타일
              <div className="max-w-4xl w-full">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start mb-3">
                    <Bot className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-xl font-bold text-gray-900 mb-2">{children}</h1>,
                            h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold text-gray-900 mb-2">{children}</h2>,
                            h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-base font-medium text-gray-900 mb-1">{children}</h3>,
                            p: ({ children }: { children: React.ReactNode }) => <p className="text-gray-700 mb-2">{children}</p>,
                            ul: ({ children }: { children: React.ReactNode }) => <ul className="list-disc list-inside mb-2 text-gray-700">{children}</ul>,
                            ol: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal list-inside mb-2 text-gray-700">{children}</ol>,
                            li: ({ children }: { children: React.ReactNode }) => <li className="mb-1">{children}</li>,
                            blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 mb-2">{children}</blockquote>,
                            code: ({ children }: { children: React.ReactNode }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                            pre: ({ children }: { children: React.ReactNode }) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-2">{children}</pre>,
                            strong: ({ children }: { children: React.ReactNode }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-4xl w-full">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">답변을 생성하고 있습니다...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
