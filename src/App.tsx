import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ServiceSelection from './pages/ServiceSelection';
import Dashboard from './pages/Dashboard';
import ChatAgents from './pages/ChatAgents';
import AgentCreate from './pages/AgentCreate';
import AgentEdit from './pages/AgentEdit';
import Documents from './pages/Documents';
import DocumentUpload from './pages/DocumentUpload';
import Models from './pages/Models';
import Users from './pages/Users';
import UserCreate from './pages/UserCreate';
import UserEdit from './pages/UserEdit';
import MCPServers from './pages/MCPServers';
import MCPServerCreate from './pages/MCPServerCreate';
import MCPServerEdit from './pages/MCPServerEdit';
import Statistics from './pages/Statistics';
import ChatInterface from './pages/ChatInterface';
import ChatEmbed from './pages/ChatEmbed';
import EmbedTest from './pages/EmbedTest';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ServiceSelection />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/chat-agents" element={<ChatAgents />} />
          <Route path="/admin/chat-agents/create" element={<AgentCreate />} />
          <Route path="/admin/chat-agents/edit/:agentId" element={<AgentEdit />} />
          <Route path="/admin/documents" element={<Documents />} />
          <Route path="/admin/documents/upload" element={<DocumentUpload />} />
          <Route path="/admin/models" element={<Models />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/create" element={<UserCreate />} />
          <Route path="/admin/users/edit/:userId" element={<UserEdit />} />
          <Route path="/admin/mcp-servers" element={<MCPServers />} />
          <Route path="/admin/mcp-servers/create" element={<MCPServerCreate />} />
          <Route path="/admin/mcp-servers/edit/:mcpId" element={<MCPServerEdit />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/embed-test" element={<EmbedTest />} />
          <Route path="/chat/:serviceId" element={<ChatInterface />} />
          <Route path="/embed/chat/:serviceId" element={<ChatEmbed />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
