// 사용자 타입
export interface User {
  memberId: string;
  name: string;
  role: string;
}

// 챗 에이전트 타입
export interface Agent {
  agentId: string;
  state: string;
  prompt: string;
  apiUrl: string;
  method: string;
  name: string;
  description: string;
  isConfirmed: boolean;
  // 연결된 리소스들
  documents: Document[]; // 첨부된 문서들
  connectedModels: string[]; // 연결된 모델 ID들
  connectedMCPServers: string[]; // 연결된 MCP 서버 ID들
}

export interface ChatAgent {
  chatagentsId: string;
  serviceId: string;
  state: string;
  agents: Agent[];
}

// 챗 메시지 타입
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  memberId?: string;
  type?: 'chat' | 'common' | 'tool';
  payload?: any;
}

// 문서 타입
export interface Document {
  docsId: string;
  documentName: string;
  type: 'faq' | 'guide';
  file: File;
  uploadedAt: Date;
}

// 모델 타입
export interface Model {
  id: string;
  parentEmbeddingModelId?: string;
  name: string;
  path: string;
}

export interface Adaptor {
  id: string;
  modelId: string;
  name: string;
  path: string;
}

// MCP 서버 타입
export interface MCPTool {
  name: string;
  description: string;
  parameter: Record<string, string>;
}

export interface MCPServer {
  mcpId: string;
  name: string;
  description: string;
  serverUrl: string;
  useable: boolean;
  tools: MCPTool[];
}

// 사용량 통계 타입
export interface ChatUsage {
  chatUsageId: string;
  chatagentsId: string;
  createdAt: string;
  historyId: string;
}

export interface DocumentUsage {
  documentUsageId: string;
  documentId: string;
  createdAt: string;
}

export interface MCPUsage {
  mcpUsageId: string;
  memberId: string;
  serviceId: string;
  isComplete: boolean;
  createdAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}