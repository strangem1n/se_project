import type { MCPServer } from '../types';

export const mockMCPServers: MCPServer[] = [
  {
    mcpId: '1',
    name: 'Customer Service MCP',
    description: '고객 서비스를 위한 MCP 서버',
    serverUrl: 'http://localhost:8081/mcp',
    useable: true,
    tools: [
      {
        name: 'get_customer_info',
        description: '고객 정보를 조회합니다',
        parameter: { customerId: 'string' },
      },
      {
        name: 'create_ticket',
        description: '고객 티켓을 생성합니다',
        parameter: { title: 'string', description: 'string' },
      },
    ],
  },
  {
    mcpId: '2',
    name: 'Tech Support MCP',
    description: '기술 지원을 위한 MCP 서버',
    serverUrl: 'http://localhost:8082/mcp',
    useable: false,
    tools: [
      {
        name: 'check_system_status',
        description: '시스템 상태를 확인합니다',
        parameter: { systemId: 'string' },
      },
      {
        name: 'restart_service',
        description: '서비스를 재시작합니다',
        parameter: { serviceName: 'string' },
      },
    ],
  },
  {
    mcpId: '3',
    name: 'Sales MCP',
    description: '영업을 위한 MCP 서버',
    serverUrl: 'http://localhost:8083/mcp',
    useable: true,
    tools: [
      {
        name: 'get_product_info',
        description: '제품 정보를 조회합니다',
        parameter: { productId: 'string' },
      },
      {
        name: 'calculate_price',
        description: '가격을 계산합니다',
        parameter: { productId: 'string', quantity: 'number' },
      },
    ],
  },
];
