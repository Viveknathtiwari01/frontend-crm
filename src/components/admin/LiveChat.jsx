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
  padding: 0rem;
//   background: linear-gradient(135deg, #2c2c2c, #1e1e1e);
  overflow-y: auto;
  //margin-top: 5rem; /* Adds space below the hamburger */
  
  @media (max-width: 768px) {
    padding-top: 0;  /* Remove padding from top */
    margin-top: 5rem;  /* Content starts below the hamburger */
  }
`;

const LiveChat = () => {
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
      <iframe 
                    src="https://app.karvatech.com?theme=dark"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Live Chat"
                />
      </ContentArea>
      </Container>
      );
    };

export default LiveChat;