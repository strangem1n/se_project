import type { Agent } from '../types';

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    serviceName: '고객 서비스',
    state: 'active',
    userId: 'admin-1',
    logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjEwQzE0IDExLjEgMTMuMSAxMiAxMiAxMkg0QzIuOSAxMiAyIDExLjEgMiAxMFY0QzIgMi45IDIuOSAyIDQgMkgxMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiA2SDIwQzIxLjEgNiAyMiA2LjkgMjIgOFYxNEMyMiAxNS4xIDIxLjEgMTYgMjAgMTZIMTZWNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K',
    // 세부 정보 (모달에서 조회)
    prompt: '고객 서비스 챗봇',
    apiUrl: '/api/chat',
    method: 'POST',
    name: '고객 서비스 봇',
    description: '고객 문의를 처리하는 챗봇',
    isConfirmed: true,
    documents: [], // 첨부된 문서들
    connectedModels: ['1'], // GPT-3.5-turbo 모델 연결
    connectedMCPServers: ['1'], // Customer Service MCP 연결
  },
  {
    id: 'agent-2',
    serviceName: '기술 지원',
    state: 'inactive',
    userId: 'admin-1',
    // 세부 정보 (모달에서 조회)
    prompt: '기술 지원 챗봇',
    apiUrl: '/api/tech-support',
    method: 'POST',
    name: '기술 지원 봇',
    description: '기술적 문제를 해결하는 챗봇',
    isConfirmed: false,
    documents: [], // 첨부된 문서들
    connectedModels: ['2'], // GPT-4 모델 연결
    connectedMCPServers: ['2'], // Tech Support MCP 연결
  },
  {
    id: 'agent-3',
    serviceName: '영업 상담',
    state: 'active',
    userId: 'admin-2',
    // 세부 정보 (모달에서 조회)
    prompt: '영업 상담 챗봇',
    apiUrl: '/api/sales',
    method: 'POST',
    name: '영업 상담 봇',
    description: '제품 상담을 담당하는 챗봇',
    isConfirmed: true,
    documents: [], // 첨부된 문서들
    connectedModels: ['3'], // Claude-3 모델 연결
    connectedMCPServers: ['3'], // Sales MCP 연결
  },
  {
    id: 'agent-4',
    serviceName: '제품 문의',
    state: 'active',
    userId: 'admin-1',
    // 세부 정보 (모달에서 조회)
    prompt: '제품 문의 챗봇',
    apiUrl: '/api/product',
    method: 'POST',
    name: '제품 문의 봇',
    description: '제품 관련 문의를 처리하는 챗봇',
    isConfirmed: true,
    documents: [], // 첨부된 문서들
    connectedModels: ['1'], // GPT-3.5-turbo 모델 연결
    connectedMCPServers: ['1'], // Customer Service MCP 연결
  },
];
