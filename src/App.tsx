import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ServiceSelection from './pages/ServiceSelection';
import Dashboard from './pages/Dashboard';
import ChatAgents from './pages/ChatAgents';
import Models from './pages/Models';
import Users from './pages/Users';
import MCPServers from './pages/MCPServers';
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
          <Route path="/admin/models" element={<Models />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/mcp-servers" element={<MCPServers />} />
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
