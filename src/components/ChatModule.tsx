import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, Settings, Minimize2, Maximize2, ArrowLeft, RotateCcw, Trash2, History, X, MessageSquare } from 'lucide-react';
import { Button } from './ui';
import MessageBubble from './MessageBubble';
import ToolForm from './ToolForm';
import ToolApproval from './ToolApproval';
import type { ChatMessage, ChatRequest, ChatResponse, ToolFormSchema } from '../types';

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
  
  // 챗봇 관련 상태
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [currentResumeKey, setCurrentResumeKey] = useState<string | null>(null);
  const [pendingToolResponse, setPendingToolResponse] = useState<ChatResponse | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  // 챗봇 페이지일 때 부모 요소의 스크롤 비활성화
  useEffect(() => {
    if (!isEmbedded) {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.overflow = 'hidden';
        return () => {
          mainElement.style.overflow = '';
        };
      }
    }
  }, [isEmbedded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SSE 스트리밍 처리 함수
  const handleSSEStream = async (chatagentId: string, requestData: ChatRequest) => {
    try {
      // fetch-event-source 라이브러리가 설치되지 않은 경우를 대비한 폴백
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/be/v1/chatagents/${chatagentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      setIsStreaming(true);
      setStreamingContent('');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const chatResponse: ChatResponse = data;
              
              if (chatResponse.isStream && chatResponse.sseState === 'RUNNING') {
                // 스트리밍 중인 경우
                setStreamingContent(prev => prev + chatResponse.content);
              } else if (chatResponse.sseState === 'END') {
                // 스트리밍 완료
                setIsStreaming(false);
                
                // 최종 메시지 추가
                const finalMessage: ChatMessage = {
                  id: `msg_${Date.now()}`,
                  sender: 'bot',
                  content: streamingContent + chatResponse.content,
                  timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, finalMessage]);
                setStreamingContent('');
                
                // taskId와 resumeKey 업데이트
                if (chatResponse.taskId) {
                  setCurrentTaskId(chatResponse.taskId);
                }
                if (chatResponse.resumeKey) {
                  setCurrentResumeKey(chatResponse.resumeKey);
                }
                
                // interrupt 타입인 경우 도구 처리
                if (chatResponse.type === 'interrupt' && chatResponse.payload) {
                  setPendingToolResponse(chatResponse);
                }
              }
            } catch (error) {
              console.error('Error parsing SSE data:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE streaming error:', error);
      setIsStreaming(false);
      setStreamingContent('');
      
      // 에러 메시지 추가
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'bot',
        content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // 챗봇 API 요청 데이터 준비
      const requestData: ChatRequest = {
        userId: 'user-1', // 실제로는 로그인한 사용자 ID
        type: 'chat',
        content: messageContent,
        resumeKey: currentResumeKey || undefined,
        taskId: currentTaskId || undefined,
      };

      // SSE 스트리밍 처리
      await handleSSEStream(serviceId, requestData);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      
      // 에러 메시지 추가
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: 'bot',
        content: '죄송합니다. 메시지 전송 중 오류가 발생했습니다.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 도구 승인 처리
  const handleToolApprove = async () => {
    if (!pendingToolResponse) return;

    try {
      const requestData: ChatRequest = {
        userId: 'user-1',
        type: 'approve',
        content: 'yes',
        resumeKey: currentResumeKey || undefined,
        taskId: currentTaskId || undefined,
        payload: {
          ...pendingToolResponse.payload,
          currentValues: { ...pendingToolResponse.payload?.currentValues, response: 'yes' }
        }
      };

      setPendingToolResponse(null);
      setIsLoading(true);
      await handleSSEStream(serviceId, requestData);
    } catch (error) {
      console.error('도구 승인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 도구 거부 처리
  const handleToolReject = async () => {
    if (!pendingToolResponse) return;

    try {
      const requestData: ChatRequest = {
        userId: 'user-1',
        type: 'approve',
        content: 'no',
        resumeKey: currentResumeKey || undefined,
        taskId: currentTaskId || undefined,
        payload: {
          ...pendingToolResponse.payload,
          currentValues: { ...pendingToolResponse.payload?.currentValues, response: 'no' }
        }
      };

      setPendingToolResponse(null);
      setIsLoading(true);
      await handleSSEStream(serviceId, requestData);
    } catch (error) {
      console.error('도구 거부 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 도구 폼 제출 처리
  const handleToolFormSubmit = async (values: Record<string, any>) => {
    if (!pendingToolResponse) return;

    try {
      const requestData: ChatRequest = {
        userId: 'user-1',
        type: 'input',
        content: JSON.stringify(values),
        resumeKey: currentResumeKey || undefined,
        taskId: currentTaskId || undefined,
        payload: {
          ...pendingToolResponse.payload,
          currentValues: values
        }
      };

      setPendingToolResponse(null);
      setIsLoading(true);
      await handleSSEStream(serviceId, requestData);
    } catch (error) {
      console.error('도구 폼 제출 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 도구 폼 취소 처리
  const handleToolFormCancel = () => {
    setPendingToolResponse(null);
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
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      <div className="flex-1 flex items-center justify-center p-6 min-h-0">
        <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-lg flex flex-col min-h-0">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 space-y-4 min-h-0">
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
            <MessageBubble message={message} />
          </div>
        ))}

        {/* 스트리밍 중인 메시지 */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-4xl w-full">
              <div className="flex items-start mb-3">
                <Bot className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                <div className="flex-1">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 mb-2 whitespace-pre-wrap">
                      {streamingContent}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 도구 승인 UI */}
        {pendingToolResponse?.payload?.type === 'tool_approve' && (
          <div className="flex justify-start">
            <div className="max-w-md">
              <ToolApproval
                toolName={pendingToolResponse.payload.tool}
                onApprove={handleToolApprove}
                onReject={handleToolReject}
              />
            </div>
          </div>
        )}

        {/* 도구 폼 UI */}
        {pendingToolResponse?.payload?.type === 'tool_input_form' && (
          <div className="flex justify-start">
            <div className="max-w-md w-full">
              <ToolForm
                schema={pendingToolResponse.payload.schema as ToolFormSchema}
                currentValues={pendingToolResponse.payload.currentValues || {}}
                onSubmit={handleToolFormSubmit}
                onCancel={handleToolFormCancel}
                toolName={pendingToolResponse.payload.tool}
              />
            </div>
          </div>
        )}

        {isLoading && !isStreaming && (
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
          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isStreaming ? "응답을 받는 중..." : "메시지를 입력하세요..."}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || isStreaming}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isStreaming}
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
