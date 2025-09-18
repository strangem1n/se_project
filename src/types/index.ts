// 사용자 타입
export interface User {
  memberId: string;
  name: string;
  role: string;
}

// 챗 에이전트 타입
export interface Agent {
  id: string; // 고유 키값
  serviceName: string; // 챗 에이전트를 필요로 하는 서비스 이름
  state: string; // 현재 활성 상태
  userId: string; // 관리자의 유저 id
  logoUrl?: string; // 서비스 로고 이미지 URL
  // 세부 정보 (모달에서 조회)
  prompt?: string;
  apiUrl?: string;
  method?: string;
  name?: string;
  description?: string;
  isConfirmed?: boolean;
  documents?: Document[]; // 첨부된 문서들
  connectedModels?: string[]; // 연결된 모델 ID들
  connectedMCPServers?: string[]; // 연결된 MCP 서버 ID들
}

// 챗 에이전트 상세보기 응답 타입
export interface AgentDetail {
  id: string;
  serviceName: string;
  state: string;
  userId: string;
  embeddingModel: {
    id: string;
    name: string;
  };
  docs: Array<{
    id: string;
    name: string;
  }>;
  mcpServers: Array<{
    id: string;
    mcpUrl: string;
    mcpName: string;
    state: string; // 현재 사용 가능한지
    isActive: boolean; // 해당 서비스에서 사용중인지
  }>;
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
  // 새로 추가된 필드들
  useForRAG?: boolean; // RAG 사용 여부
  useForFinetuning?: boolean; // 파인튜닝 사용 여부
}

// 모델 타입
export interface Model {
  id: string;
  name: string;
  state: string;
  parentEmbeddingModelId?: string;
  path?: string;
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
  params: Record<string, string>;
}

export interface MCPServer {
  name: string;
  mcpUrl: string;
  state: string; // active / inactive
  chatagentId: string;
  tools: MCPTool[];
  // 기존 필드들 (하위 호환성)
  mcpId?: string;
  description?: string;
  serverUrl?: string;
  useable?: boolean;
}

// 챗봇 관련 타입
export interface ChatRequest {
  userId: string;
  type: 'chat' | 'input' | 'approve';
  content: string;
  resumeKey?: string;
  taskId?: string;
  payload?: any;
}

export interface ChatResponse {
  userId: string;
  type: 'answer' | 'interrupt';
  content: string;
  resumeKey?: string;
  isStream: boolean;
  sseState: 'RUNNING' | 'END';
  taskId?: string;
  payload?: {
    type: 'tool_approve' | 'tool_input_form';
    tool?: string;
    schema?: Record<string, any>;
    currentValues?: Record<string, any>;
    args?: any;
    schemaHash?: string;
  };
}

export interface ToolFormSchema {
  type: string;
  properties: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    default?: any;
  }>;
  required?: string[];
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