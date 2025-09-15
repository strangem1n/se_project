import type { ChatAgent } from '../types';

export const mockChatAgents: ChatAgent[] = [
  {
    chatagentsId: '1',
    serviceId: 'service-1',
    state: 'active',
    agents: [
      {
        agentId: 'agent-1',
        state: 'active',
        prompt: '고객 서비스 챗봇',
        apiUrl: '/api/chat',
        method: 'POST',
        name: '고객 서비스 봇',
        description: '고객 문의를 처리하는 챗봇',
        isConfirmed: true,
        connectedDocuments: ['1', '2'], // FAQ와 가이드 문서 연결
        connectedModels: ['1'], // GPT-3.5-turbo 모델 연결
        connectedMCPServers: ['1'], // Customer Service MCP 연결
      },
    ],
  },
  {
    chatagentsId: '2',
    serviceId: 'service-2',
    state: 'inactive',
    agents: [
      {
        agentId: 'agent-2',
        state: 'inactive',
        prompt: '기술 지원 챗봇',
        apiUrl: '/api/tech-support',
        method: 'POST',
        name: '기술 지원 봇',
        description: '기술적 문제를 해결하는 챗봇',
        isConfirmed: false,
        connectedDocuments: ['3'], // 기술 지원 FAQ만 연결
        connectedModels: ['2'], // GPT-4 모델 연결
        connectedMCPServers: ['2'], // Tech Support MCP 연결
      },
    ],
  },
  {
    chatagentsId: '3',
    serviceId: 'service-3',
    state: 'active',
    agents: [
      {
        agentId: 'agent-3',
        state: 'active',
        prompt: '영업 상담 챗봇',
        apiUrl: '/api/sales',
        method: 'POST',
        name: '영업 상담 봇',
        description: '제품 상담을 담당하는 챗봇',
        isConfirmed: true,
        connectedDocuments: ['4', '5'], // API 문서와 영업 프로세스 가이드 연결
        connectedModels: ['3'], // Claude-3 모델 연결
        connectedMCPServers: ['3'], // Sales MCP 연결
      },
    ],
  },
];
