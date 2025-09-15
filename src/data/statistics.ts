import type { ChatUsage, DocumentUsage, MCPUsage } from '../types';

export const mockChatUsage: ChatUsage[] = [
  { chatUsageId: '1', chatagentsId: 'agent-1', createdAt: '2024-01-01', historyId: 'hist-1' },
  { chatUsageId: '2', chatagentsId: 'agent-1', createdAt: '2024-01-02', historyId: 'hist-2' },
  { chatUsageId: '3', chatagentsId: 'agent-2', createdAt: '2024-01-03', historyId: 'hist-3' },
  { chatUsageId: '4', chatagentsId: 'agent-1', createdAt: '2024-01-04', historyId: 'hist-4' },
  { chatUsageId: '5', chatagentsId: 'agent-3', createdAt: '2024-01-05', historyId: 'hist-5' },
];

export const mockDocumentUsage: DocumentUsage[] = [
  { documentUsageId: '1', documentId: 'doc-1', createdAt: '2024-01-01' },
  { documentUsageId: '2', documentId: 'doc-2', createdAt: '2024-01-02' },
  { documentUsageId: '3', documentId: 'doc-1', createdAt: '2024-01-03' },
  { documentUsageId: '4', documentId: 'doc-3', createdAt: '2024-01-04' },
  { documentUsageId: '5', documentId: 'doc-2', createdAt: '2024-01-05' },
];

export const mockMCPUsage: MCPUsage[] = [
  { mcpUsageId: '1', memberId: 'user-1', serviceId: 'service-1', isComplete: true, createdAt: '2024-01-01' },
  { mcpUsageId: '2', memberId: 'user-2', serviceId: 'service-2', isComplete: false, createdAt: '2024-01-02' },
  { mcpUsageId: '3', memberId: 'user-1', serviceId: 'service-1', isComplete: true, createdAt: '2024-01-03' },
  { mcpUsageId: '4', memberId: 'user-3', serviceId: 'service-3', isComplete: true, createdAt: '2024-01-04' },
  { mcpUsageId: '5', memberId: 'user-2', serviceId: 'service-2', isComplete: true, createdAt: '2024-01-05' },
];

export interface StatData {
  chatUsage: ChatUsage[];
  documentUsage: DocumentUsage[];
  mcpUsage: MCPUsage[];
}

export const mockStatData: StatData = {
  chatUsage: mockChatUsage,
  documentUsage: mockDocumentUsage,
  mcpUsage: mockMCPUsage,
};
