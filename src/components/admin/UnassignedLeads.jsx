import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { FaBars, FaTachometerAlt, FaUsers, FaChartBar, FaWhatsapp, FaCog, FaAddressCard, FaRegPaperPlane } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e1e, #2c2c2c);
  color: #fff;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(0, 0, 0, 0.6); /* Slight transparency */
  background-image: linear-gradient(135deg, #1a1a1a, #333); /* Gradient effect */
  backdrop-filter: blur(10px); /* Apply blur effect for a modern look */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  z-index: 1;  /* Make sure sidebar is on top when needed */

  @media (max-width: 768px) {
    position: fixed;
    left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
    top: 0;
    bottom: 0;
    z-index: 1000;
    padding-top: 3rem;  /* Ensure it's below the hamburger icon */
  }
`;

const Hamburger = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    font-size: 2rem;
    color: #fff;
    position: absolute;
    top: 1rem;
    left: 1rem;
    cursor: pointer;
    z-index: 1050; /* Ensure hamburger is above content */
  }
`;



const Logo = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1.2px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
`;

const NavButton = styled.button`
  width: 90%;
  padding: 0.8rem 1rem;
  background-color: transparent;
  border: none;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: background 0.3s ease, transform 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
//   background: linear-gradient(135deg, #2c2c2c, #1e1e1e);
  overflow-y: auto;
  //margin-top: 5rem; /* Adds space below the hamburger */
  
  @media (max-width: 768px) {
    padding-top: 0;  /* Remove padding from top */
    margin-top: 5rem;  /* Content starts below the hamburger */
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const LeadsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const LeadItem = styled.li`
  background: #333;
  border: 1px solid #444;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LeadSummary = styled.div`
  display: flex;
  // flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeadTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeadNameStage = styled.h2`
  font-size: 1.1rem;
  color: #fff;
  margin-top: 0.15rem;
  margin-bottom: 0rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LeadContact = styled.p`
  font-size: 0.9rem;
  color: #aaa;
  display: inline;
  margin-top:0rem;
  margin-bottom: 0rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top:0rem;
  }
`;

const StageBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background-color: ${({ stage }) => {
    switch (stage) {
      case "New":
        return "rgba(0, 123, 255, 0.2)"; // Light Blue
      case "Hot":
        return "rgba(255, 69, 0, 0.2)"; // Light Red-Orange
      case "Warm":
        return "rgba(255, 193, 7, 0.2)"; // Light Yellow
      case "Admission Taken":
        return "rgba(40, 167, 69, 0.2)"; // Light Green
      case "Dead":
        return "rgba(108, 117, 125, 0.2)"; // Light Gray
      default:
        return "rgba(108, 99, 255, 0.2)"; // Default Light Purple
    }
  }};
  border: 1px solid ${({ stage }) => {
    switch (stage) {
      case "New":
        return "rgba(0, 123, 255, 0.6)";
      case "Hot":
        return "rgba(255, 69, 0, 0.3)";
      case "Warm":
        return "rgba(255, 193, 7, 0.6)";
      case "Admission Taken":
        return "rgba(40, 167, 69, 0.6)";
      case "Dead":
        return "rgba(108, 117, 125, 0.6)";
      default:
        return "rgba(108, 99, 255, 0.6)";
    }
  }};
`;

const LeadCourse = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
 background-color: ${({ course }) => {
    switch (course) {
        case "MCA":
          return "rgba(102, 204, 255, 0.2)"; // Soft Sky Blue
        case "MBA":
          return "rgba(255, 102, 153, 0.2)"; // Soft Rose Pink
        case "BCA":
          return "rgba(255, 204, 153, 0.2)"; // Peach Beige
        case "BBA":
          return "rgba(153, 204, 204, 0.2)"; // Soft Aqua
        default:
          return "rgba(178, 156, 229, 0.2)"; // Lavender Mist
      }
  }};
  border: 1px solid ${({ course }) => {
      switch (course) {
        case "MCA":
          return "rgba(102, 204, 255, 0.6)";
        case "MBA":
          return "rgba(255, 102, 153, 0.6)";
        case "BCA":
          return "rgba(255, 204, 153, 0.6)";
        case "BBA":
          return "rgba(153, 204, 204, 0.6)";
        default:
          return "rgba(178, 156, 229, 0.6)";
      }
  }};
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: #fff;
  margin-left: auto;
`;

const LeadDetails = styled.div`
  display: ${({ expanded }) => (expanded ? "block" : "none")};
  margin-top: 1rem;
  background: #444;
  border-radius: 4px;
  padding: 1rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #2c2c2c, #1e1e1e);
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);

   @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const AssignButton = styled.button`
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(108, 99, 255, 0.4);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 6px 15px rgba(108, 99, 255, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0px 3px 8px rgba(0, 123, 255, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;


const AgentDropdown = styled.select`
  background: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.8rem 3rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #444;
    border-color: #555;
  }

  &:focus {
    outline: none;
    border-color: #6c63ff
    background: #444;
  }

  option {
    background: #333;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0rem;

 @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
`;

const SelectAllText = styled.span`
  font-size: 1rem;
  color: #fff;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SelectAllCheckbox = styled.input`
  width: 20px;
  height: 20px;
  background-color: #444;
  border: 2px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    background-color: #6c63ff;
    border-color: #6c63ff;
  }

  &:hover {
    background-color: #555;
    border-color: #666;
  }
    

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;


const Checkbox = styled.input`
  margin-right: 1rem;
  width: 20px;
  height: 20px;
  background-color: #444;
  border: 2px solid #555;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    background-color: #6c63ff
    border-color: #6c63ff
  }

  &:hover {
    background-color: #555;
    border-color: #666;
  }

  @media (max-width: 768px) {
    margin-right: 0.5rem;
    width: 18px;
    height: 18px;
  }
`;



// Main Component
const UnassignedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [expandedLead, setExpandedLead] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleClickOutside = (e) => {
    // Check if click is not inside the sidebar or hamburger icon
    if (
      sidebarRef.current && !sidebarRef.current.contains(e.target) &&
      hamburgerRef.current && !hamburgerRef.current.contains(e.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Fetch leads and agents
    const fetchData = async () => {
      try {
        const [leadsRes, agentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads/`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/agents`),
        ]);
        setLeads(leadsRes.data.filter((lead) => lead.agent === "U/A")); // Only leads with agent="U/A"
        setAgents(agentsRes.data);
      } catch (err) {
        toast.error("Failed to fetch data!");
      }
    };

    fetchData();
  }, []);

  const handleSelectLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((leadId) => leadId !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = (e) => {
    setSelectedLeads(e.target.checked ? leads.map((lead) => lead._id) : []);
  };
  
  const isSelectAllChecked = leads.length > 0 && selectedLeads.length === leads.length;
  

  const handleAssign = async () => {
    if (!selectedAgent) {
      toast.warning("Please select an agent!");
      return;
    }

    try {
      const currentTime = new Date().toISOString();

      const updatedLeads = leads.map((lead) =>
        selectedLeads.includes(lead._id) ? { ...lead, agent: selectedAgent, createdAt: currentTime } : lead
      );

      await Promise.all(
        selectedLeads.map((leadId) =>
          axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/leads/updateLead/${leadId}`, {
            agent: selectedAgent,
            date: currentTime,
          })
        )
      );

      setLeads(updatedLeads.filter((lead) => lead.agent === "U/A"));
      setSelectedLeads([]);
      setSelectedAgent("");
      toast.success("Leads assigned successfully!");
    } catch (err) {
      toast.error("Failed to assign leads!");
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
        <Sidebar ref={sidebarRef} isOpen={isSidebarOpen}>
              <Logo>Admin Panel</Logo>
              <ButtonContainer>
                <NavButton onClick={() => navigate("/admin-dashboard")}>
                  <FaTachometerAlt />
                  Dashboard
                </NavButton>
                <NavButton onClick={() => navigate("/agents")}>
                  <FaUsers />
                  Agents
                </NavButton>
                <NavButton onClick={() => navigate("/leads")}>
                  <FaAddressCard />
                  Leads
                </NavButton>
                <NavButton onClick={() => navigate("/leads/unassigned")}>
                  <FaAddressCard   />
                  Unassigned Leads
                  </NavButton>
                  <NavButton onClick={() => navigate("/communication")}>
                  <FaRegPaperPlane />
                  Communication
                  </NavButton>
                <NavButton onClick={() => navigate("/live-chat")}>
                  <FaWhatsapp />
                  Live Chat
                </NavButton>
                <NavButton onClick={() => navigate("/settings")}>
                  <FaCog />
                  Settings
                </NavButton>
              </ButtonContainer>
            </Sidebar>
            <Hamburger ref={hamburgerRef} onClick={toggleSidebar}>
              <FaBars />
            </Hamburger>

      <ContentArea>
      <HeaderTitle>Unassigned Leads</HeaderTitle>
        <TopBar>
        <SelectAllContainer>
          <SelectAllCheckbox
          type="checkbox"
          checked={isSelectAllChecked}
          onChange={handleSelectAll}
        />
          <SelectAllText>Select All</SelectAllText>
        </SelectAllContainer>
          <AgentDropdown value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="" disabled>Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.name}>
                {agent.name}
              </option>
            ))}
          </AgentDropdown>
          <AssignButton onClick={handleAssign}>Assign</AssignButton>
        </TopBar>

        <LeadsList>
          {leads.map((lead) => (
            <LeadItem key={lead._id}>
              <LeadSummary>
                <Checkbox
                  type="checkbox"
                  checked={selectedLeads.includes(lead._id)}
                  onChange={() => handleSelectLead(lead._id)}
                />
                <LeadTitle>
                  <LeadNameStage>
                    {lead.name}  &nbsp;&nbsp;
                    <StageBadge stage={lead.stages}>{lead.stages || "Not Set"}</StageBadge>&nbsp;&nbsp;
                    <LeadCourse stage={lead.stages}>{lead.course || "Not Set"}</LeadCourse>
                  </LeadNameStage>
                </LeadTitle>
              </LeadSummary>
            </LeadItem>
          ))}
        </LeadsList>
      </ContentArea>
    </Container>
  );
};

export default UnassignedLeads;
