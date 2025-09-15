export interface DashboardStats {
  totalChatAgents: number;
  activeChatAgents: number;
  totalDocuments: number;
  totalUsers: number;
  totalMCPServers: number;
  activeMCPServers: number;
  todayMessages: number;
  totalMessages: number;
}

export const mockDashboardStats: DashboardStats = {
  totalChatAgents: 12,
  activeChatAgents: 8,
  totalDocuments: 45,
  totalUsers: 25,
  totalMCPServers: 6,
  activeMCPServers: 4,
  todayMessages: 156,
  totalMessages: 2847,
};
