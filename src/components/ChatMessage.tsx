import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function MessageBubble({ message }: ChatMessageProps) {
  if (message.sender === 'user') {
    // 사용자 메시지 - 말풍선 스타일
    return (
      <div className="max-w-md px-4 py-2 rounded-lg bg-blue-600 text-white">
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
    );
  }

  // 봇 메시지 - 마크다운 렌더링
  return (
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
  );
}
