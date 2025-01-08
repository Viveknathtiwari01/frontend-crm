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

const Settings = () => {
    const [agent, setAgent] = useState([]);  // To store the current agent details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);  // Single menu visibility
    const [editingAgent, setEditingAgent] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", contact: "" });
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
          const fetchCurrentAgent = async () => {
            try {
              const token = localStorage.getItem("authToken"); // Or however you store the token
              const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
              const currentAgentId = decodedToken.id; // Adjust to match the field in your token
        
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`);
              const agentData = response.data.find((agent) => agent._id === currentAgentId);
        
              if (!agentData) throw new Error("Agent not found");
              setAgent(agentData);
            } catch (err) {
              setError(err.message || "Failed to fetch agent details");
            } finally {
              setLoading(false);
            }
          };
        
          fetchCurrentAgent();
        }, []);

        const handleEdit = () => {
          setEditingAgent(agent);
          setFormData({ name: agent.name, email: agent.email, contact: agent.contact });
          setMenuVisible(false);
        };
      
        const handleUpdate = async () => {
          try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/agent/${agent._id}`, formData);
            toast.success("Agent updated successfully!");
            setAgent({ ...agent, ...formData }); // Update current agent's data
            setEditingAgent(null);
          } catch (error) {
            toast.error("Failed to update agent!");
          }
        };

        const handleOpenPasswordModal = () => {
          setPasswordData({ currentPassword: "", newPassword: "" });
          setIsPasswordModalOpen(true);
          setMenuVisible(false);
        };
      
        const handlePasswordChange = async () => {
          if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error("Both fields are required!");
            return;
          }
      
          try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/change-password`, {
              agentId: agent._id,
              currentPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword,
            });
            toast.success("Password updated successfully!");
            setIsPasswordModalOpen(false);
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password!");
          }
        };
      
        const handleMenuToggle = () => {
          setMenuVisible((prev) => !prev);
        };
      
        const handleCancel = () => {
          setEditingAgent(null); // Close edit modal
        };

return (
    <Container>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
        <Sidebar ref={sidebarRef} isOpen={isSidebarOpen}>
              <Logo>Agent Panel</Logo>
              <ButtonContainer>
                <NavButton onClick={() => navigate("/agent-dashboard")}>
                  <FaTachometerAlt />
                  Dashboard
                </NavButton>
                <NavButton onClick={() => navigate("/agent-leads")}>
                  <FaAddressCard />
                  Leads
                </NavButton>
                  <NavButton onClick={() => navigate("/agent-communication")}>
                  <FaRegPaperPlane />
                  Communication
                  </NavButton>
                <NavButton onClick={() => navigate("/agent-live-chat")}>
                  <FaWhatsapp />
                  Live Chat
                </NavButton>
                <NavButton onClick={() => navigate("/agent-settings")}>
                  <FaCog />
                  Settings
                </NavButton>
              </ButtonContainer>
            </Sidebar>
      <Hamburger ref={hamburgerRef} onClick={toggleSidebar}>
        <FaBars />
      </Hamburger>
      <ContentArea>
      <HeaderTitle>Settings</HeaderTitle>
      <AgentCard>
          <MenuButton onClick={handleMenuToggle}>
            <FaEllipsisV />
          </MenuButton>
          <DropdownMenu visible={menuVisible}>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleOpenPasswordModal}>Change Password</MenuItem>
          </DropdownMenu>
          
          <AgentAvatar />
          <AgentName>{agent.name || "Unknown Agent"}</AgentName>
          <AgentEmail>{agent.email}</AgentEmail>
          <AgentContact>{agent.contact}</AgentContact>
        </AgentCard>
      </ContentArea>
      {editingAgent && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit Profile</h2>
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

        {isPasswordModalOpen && (
                <ModalOverlay>
                  <ModalContent>
                    <h2>Change Password</h2>
                    <Form>
                      <FormRow>
                        <Label>Current Password</Label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                        />
                      </FormRow>
                      <FormRow>
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password"
                        />
                      </FormRow>
                      <EditButtonContainer>
                        <Button onClick={handlePasswordChange}>Submit</Button>
                        <CancelButton onClick={() => setIsPasswordModalOpen(false)}>Cancel</CancelButton>
                      </EditButtonContainer>
                    </Form>
                  </ModalContent>
                </ModalOverlay>
              )}

      </Container>
      );
}

export default Settings