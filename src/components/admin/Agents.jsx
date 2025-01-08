import React, { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { FaUserPlus, FaBars, FaUserCircle, FaTachometerAlt, FaUsers, FaWhatsapp, FaCog, FaChartBar, FaEllipsisV, FaAddressCard, FaRegPaperPlane  } from "react-icons/fa";
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
  //background: linear-gradient(135deg, #2c2c2c, #1e1e1e);
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

const AgentsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AgentCard = styled.div`
  position: relative;
  background: #3a3a3a;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AgentAvatar = styled(FaUserCircle)`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #6c63ff;
`;

const AgentName = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const AgentEmail = styled.p`
  font-size: 0.9rem;
  color: #bbb;
`;

const AgentContact = styled.p`
  font-size: 0.9rem;
  color: #bbb;
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
`;

const LoadingMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-top: 2rem;
  color: #6c63ff;
`;

const MenuButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    color: #ccc;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  background: #2c2c2c;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  display: ${({ visible }) => (visible ? "block" : "none")};
  z-index: 10;

  @media (max-width: 768px) {
    right: 5px;
  }
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: #fff;
  font-size: 0.9rem;
  text-align: left;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #3a3a3a;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  text-align: center;

  @media (max-width: 768px) {
    width: 80%; /* Make modal width 90% of the screen width on small screens */
    padding: 1.5rem; /* Adjust padding for smaller screens */
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 0rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #2c2c2c;
  color: #fff;
  margin-bottom: 1rem;
  text-indent: 0.8rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: #6c63ff;
  border: none;
  border-radius: 0.5rem;
  color: #fff;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #5847eb;
  }
`;

const EditButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* Align buttons to the right */
  gap: 1rem; /* Add space between buttons */
  width: 100%;
  margin-top: 1rem; /* Adjust top margin to space out the buttons a bit */
`;

const CancelButton = styled(Button)`
  background: #888; /* Different background color for Cancel button */
  &:hover {
    background: #2c2c2c;
  }
`;

const AddAgentButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 1050; /* Ensure it stays above the content */

  &:hover {
    background: #5847eb;
  }
`;

const AddAgentModalContent = styled(ModalContent)`
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #fff;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
  margin-bottom: 0.3rem;
  text-indent: 0.3rem;
`;


const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuVisible, setMenuVisible] = useState({});
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgentData, setNewAgentData] = useState({ name: "", email: "", contact: "" });
  const [deleteAgentId, setDeleteAgentId] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
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

  React.useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [isSidebarOpen]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/agents`);
        setAgents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch agents");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const handleCreateAgent = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register-agent`, newAgentData);
      toast.success("Agent created successfully!");
      setAgents((prev) => [...prev, response.data]); // Add the new agent to the list
      setNewAgentData({ name: "", email: "", contact: "", password: "" }); // Clear the form
      setIsCreateModalOpen(false); // Close the modal
    } catch (error) {
        toast.error("Failed to create agent !");
    }
  };  

  const handleCloseCreateModal = () => {
    setNewAgentData({ name: "", email: "", contact: "", password: "" }); // Reset the form fields
    setIsCreateModalOpen(false); // Close the modal
  };

  const handleMenuToggle = (id) => {
    setMenuVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({ name: agent.name, email: agent.email, contact: agent.contact });
    setMenuVisible((prev) => ({ ...prev, [agent._id]: false }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/agent/${editingAgent._id}`, formData);
      toast.success("Agent updated successfully!");
      setAgents((prev) =>
        prev.map((agent) => (agent._id === editingAgent._id ? { ...agent, ...formData } : agent))
      );
      setEditingAgent(null);
    } catch (error) {
        toast.error("Failed to update agent !"); // Error alert
    }
  };

  const handleDelete = async () => {
    if (deleteInput !== "Delete") {
      toast.error("You must type 'Delete' to confirm.");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/auth/agent/${deleteAgentId}`);
      toast.success("Agent deleted successfully!");
      setAgents((prev) => prev.filter((agent) => agent._id !== deleteAgentId));
      setDeleteAgentId(null);
      setDeleteInput("");
    } catch (error) {
      toast.error("Failed to delete agent!");
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteAgentId(id);
    setDeleteInput("");
    setMenuVisible({});
  };

  const handleCloseDeleteDialog = () => {
    setDeleteAgentId(null);
    setDeleteInput("");
  };

  const handleCancel = () => {
    setEditingAgent(null); // Close the modal
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
        <HeaderTitle>Agents</HeaderTitle>
        {error ? (
          <p>{error}</p>
        ) : (
          <AgentsList>
            {agents.map((agent) => (
              <AgentCard key={agent._id}>
                <MenuButton onClick={() => handleMenuToggle(agent._id)}>
                  <FaEllipsisV />
                </MenuButton>
                <DropdownMenu visible={menuVisible[agent._id]}>
                  <MenuItem onClick={() => handleEdit(agent)}>Edit</MenuItem>
                  <MenuItem onClick={() => handleOpenDeleteDialog(agent._id)}>Delete</MenuItem>
                </DropdownMenu>
                <AgentAvatar />
                <AgentName>{agent.name || "Unknown Agent"}</AgentName>
                <AgentEmail>{agent.email}</AgentEmail>
                <AgentContact>{agent.contact}</AgentContact>
              </AgentCard>
            ))}
          </AgentsList>
        )}
      </ContentArea>

      <AddAgentButton onClick={() => setIsCreateModalOpen(true)}>
      <FaUserPlus />
    </AddAgentButton>

    {isCreateModalOpen && (
      <ModalOverlay>
        <AddAgentModalContent>
          <h2>Create Agent</h2>
          <Form>
            <FormRow>
              <Label>Name</Label>
          <Input
            type="text"
            value={newAgentData.name}
            onChange={(e) => setNewAgentData({ ...newAgentData, name: e.target.value })}
            placeholder="Name"
          />
          </FormRow>
          <FormRow>
          <Label>Email</Label>
          <Input
            type="email"
            value={newAgentData.email}
            onChange={(e) => setNewAgentData({ ...newAgentData, email: e.target.value })}
            placeholder="Email"
          />
          </FormRow>
          <FormRow>
          <Label>Contact</Label>
          <Input
            type="text"
            value={newAgentData.contact}
            onChange={(e) => setNewAgentData({ ...newAgentData, contact: e.target.value })}
            placeholder="Contact"
          />
          </FormRow>
          <FormRow>
          <Label>Password</Label>
          <Input
          type="password"
          value={newAgentData.password}
          onChange={(e) => setNewAgentData({ ...newAgentData, password: e.target.value })}
          placeholder="Password"
         />
         </FormRow>
          <EditButtonContainer>
            <Button onClick={handleCreateAgent}>Submit</Button>
            <CancelButton onClick={handleCloseCreateModal}>Cancel</CancelButton>
          </EditButtonContainer>
          </Form>
        </AddAgentModalContent>
      </ModalOverlay>
    )}

      {editingAgent && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit Agent</h2>
            <Form>
              <FormRow>
                <Label>Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
            />
            </FormRow>
            <FormRow>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
            />
            </FormRow>
            <FormRow>
            <Label>Contact</Label>
            <Input
              type="text"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="Contact"
            />
            </FormRow>
            <EditButtonContainer>
            <Button onClick={handleUpdate}>Submit</Button>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            </EditButtonContainer>

            </Form>
            
          </ModalContent>
        </ModalOverlay>
      )}

{deleteAgentId && (
        <ModalOverlay>
          <ModalContent>
            <h2>Confirm Delete</h2>
            <p>Type "Delete" to confirm the deletion of this agent.</p>
            <Input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type 'Delete' to confirm"
            />
            <EditButtonContainer>
              <Button onClick={handleDelete} disabled={deleteInput !== "Delete"}>
                Confirm
              </Button>
              <CancelButton onClick={handleCloseDeleteDialog}>Cancel</CancelButton>
            </EditButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Agents;
