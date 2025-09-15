import axios from 'axios';
import type {
  User,
  ChatAgent,
  ChatMessage,
  Document,
  Model,
  Adaptor,
  MCPServer,
  MCPTool,
  ChatUsage,
  DocumentUsage,
  MCPUsage,
  ApiResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 인터셉터는 SSO 구현 시 추가 예정

// 챗 에이전트 API
export const chatAgentApi = {
  // 메시지 송신
  sendMessage: (serviceId: string, message: ChatMessage) =>
    api.post(`/be/v1/chatagents/${serviceId}`, message),

  // 사이클 시작
  startCycle: (serviceId: string, memberId: string) =>
    api.post(`/be/v1/chatagents/cycle/start/${serviceId}/${memberId}`),

  // 사이클 종료
  endCycle: (serviceId: string, memberId: string) =>
    api.post(`/be/v1/chatagents/cycle/end/${serviceId}/${memberId}`),

  // 채팅 요청 중지
  interrupt: (serviceId: string, memberId: string) =>
    api.post(`/be/v1/chatagents/interrupt/${serviceId}/${memberId}`),

  // 히스토리 추가
  addHistory: (serviceId: string, data: { userId: string; type: string; content: string }) =>
    api.post(`/be/v1/chatagents/${serviceId}`, data),

  // 히스토리 조회
  getHistory: (chatagentsId: string, userId: string, historyId?: string) =>
    api.get(`/be/v1/chatagents/${chatagentsId}/user/${userId}`, {
      params: { historyId }
    }),

  // 챗 에이전트 추가
  create: (data: {
    name: string;
    serviceId: string;
    description: string;
    modelId: string;
    chatagentsIds: string[];
  }) => api.post('/be/v1/chatagents', data),

  // 챗 에이전트 삭제
  delete: (chatagentsId: string) =>
    api.delete(`/be/v1/chatagents/${chatagentsId}`),

  // 챗 에이전트 조건 조회
  getList: (params?: {
    memberId?: string;
    state?: string;
    serviceId?: string;
  }) => api.get('/be/v1/chatagents', { params }),

  // 헬스 체크
  healthCheck: (chatagentsIds: string[]) =>
    api.get('/be/v1/chatagents/state', { data: { chatagentsIds } }),
};

// 문서 API
export const documentApi = {
  // 문서 추가
  upload: (serviceId: string, formData: FormData) =>
    api.post(`/be/v1/docs/${serviceId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // 문서 조회
  getList: (params?: { serviceId?: string; docsId?: string }) =>
    api.get('/be/v1/docs/services', { params }),

  // 문서 삭제
  delete: (serviceId: string, docsId: string) =>
    api.delete(`/be/v1/docs/service/${serviceId}/${docsId}`),
};

// 모델 API
export const modelApi = {
  // 파인 튜닝
  finetune: (data: { serviceId: string; docsId: string[] }) =>
    api.post('/be/v1/models/finetune', data),

  // 벡터 DB 저장
  saveVector: (data: { serviceId: string; docsId: string[] }) =>
    api.post('/be/v1/models/vector', data),

  // 문서 청킹
  chunk: (data: { serviceId: string; docsId: string[]; chunkSize: number }) =>
    api.post('/be/v1/models/chunk', data),

  // 모델 조회
  getModels: (modelId?: string) =>
    api.get('/be/v1/models', { params: { modelId } }),

  // 어댑터 조회
  getAdaptors: (adaptorId?: string) =>
    api.get('/be/v1/models', { params: { adaptorId } }),
};

// 사용자 API
export const userApi = {
  // 사용자 생성
  create: (data: { name: string; role: string }) =>
    api.post('/be/v1/members', data),

  // 사용자 목록 조회
  getList: (memberId?: string) =>
    api.get('/be/v1/members', { params: { memberId } }),

  // 사용자 삭제
  delete: (memberId: string) =>
    api.delete(`/be/v1/members/${memberId}`),

  // 접근 권한 수정
  updateAuth: (members: { memberId: string; role: string }[]) =>
    api.patch('/be/v1/managers/auths', { members }),
};

// MCP Server API
export const mcpApi = {
  // Server URL 추가
  create: (data: { name: string; description: string; serverUrl: string }) =>
    api.post('/be/v1/mcps', data),

  // Server URL 삭제
  delete: (mcpId: string) =>
    api.delete(`/be/v1/mcps/${mcpId}`),

  // 상세 Tools 조회
  getTools: (mcpId: string) =>
    api.get('/be/v1/mcps/tools', { params: { mcpId } }),

  // 헬스 체크
  healthCheck: (mcpId: string) =>
    api.get('/be/v1/mcps', { params: { mcpId } }),

  // ON/OFF
  toggle: (mcpIds: { mcpId: string; useable: boolean }[]) =>
    api.patch('/be/v1/mcps', { mcpIds }),
};

// 통계 API
export const statisticsApi = {
  // 챗 에이전트 사용량 조회
  getChatUsage: (params: {
    chatagentsId?: string;
    startDateTime?: string;
    endDateTime?: string;
  }) => api.get('/be/v1/statistics/chatagents', { params }),

  // 문서 사용량 조회
  getDocumentUsage: (params: {
    documentId?: string;
    serviceId?: string;
    startDateTime?: string;
    endDateTime?: string;
  }) => api.get('/be/v1/statistics/docs', { params }),

  // MCP tool 호출량 조회
  getMCPUsage: (params: {
    mcpId?: string;
    startDateTime?: string;
    endDateTime?: string;
  }) => api.get('/be/v1/statistics/mcp', { params }),
};

// 가이드 API
export const guideApi = {
  // 가이드 파일 추가
  upload: (formData: FormData) =>
    api.post('/be/v1/managers/guides', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // 가이드 파일 다운로드
  download: (guideId: string) =>
    api.get(`/be/v1/managers/guides/${guideId}`, {
      responseType: 'blob'
    }),

  // 가이드 파일 삭제
  delete: (guideId: string) =>
    api.delete(`/be/v1/managers/guides/${guideId}`),
};

export default api;
