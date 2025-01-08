// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Login";
import AdminDashboard from "./components/admin/AdminDashboard";
import AgentDashboard from "./components/agent/AgentDashboard";
import Agents from "./components/admin/Agents";
import Leads from "./components/admin/Leads";
import AgentLeads from "./components/agent/Leads";
import LiveChat from "./components/admin/LiveChat";
import AgentLiveChat from "./components/agent/LiveChat";
import Settings from "./components/admin/Settings";
import AgentSettings from "./components/agent/Settings";
import UnassignedLeads from "./components/admin/UnassignedLeads";
import Communication from "./components/admin/Communication";
import AgentCommunication from "./components/agent/Communication";

// const AdminDashboard = () => <h1 align="center">Welcome to Admin Dashboard</h1>;
// const AgentDashboard = () => <h1 align="center">Welcome to Agent Dashboard</h1>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/agent-leads" element={<AgentLeads />} />
        <Route path="/live-chat" element={<LiveChat />} />
        <Route path="/agent-live-chat" element={<AgentLiveChat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/agent-settings" element={<AgentSettings />} />
        <Route path="/leads/unassigned" element={<UnassignedLeads />} />
        <Route path="/communication" element={<Communication />} />
        <Route path="/agent-communication" element={<AgentCommunication />} />
      </Routes>
    </Router>
  );
};

export default App;
