import React, { useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { FaUserPlus, FaBars, FaUserCircle, FaTachometerAlt, FaUsers, FaWhatsapp, FaCog, FaChartBar, FaEllipsisV, FaRegPaperPlane, FaUserTag, FaAddressCard } from "react-icons/fa";
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

const TemplateDropdown = styled.select`
  background: #333;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.8rem 1rem;
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
`;
const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0rem;
`;

const SelectAllText = styled.span`
  font-size: 1rem;
  color: #fff;
  font-weight: 500;
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
  margin-top: 0rem;
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
`;

const AddTemplateButton = styled.button`
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
  transition: opacity 0.3s ease-in-out;
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  background-color: #2c2c2c;
  border: 1px solid #555;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #444;
  }
`;

const ModalContent = styled.div`
  background: #3a3a3a;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  text-align: center;
  animation: fadeIn 0.4s forwards;

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

const InputTextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 0rem;
  background: #2c2c2c;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: #fff;
  resize: none;
  font-size: 1rem;
  min-height: 100px;
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

const Communication = () => {
    const [whatsappTemplates, setWhatsappTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [leads, setLeads] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [templateType, setTemplateType] = useState("");
    const [templateContent, setTemplateContent] = useState("");
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
            const fetchLeads = async () => {
              try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads/`);
                setLeads(response.data.reverse());
              } catch (error) {
                console.error("Failed to fetch leads");
              }
            };
            fetchLeads();
          }, []);

          const fetchTemplates = async () => {
            try {
              const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/temp/templates?type=whatsapp`);
              
              // Ensure the response has the correct structure
              if (response.data && Array.isArray(response.data.templates)) {
                setWhatsappTemplates(response.data.templates);
              } else {
                console.error("Unexpected API response format:", response.data);
                setWhatsappTemplates([]);
              }
            } catch (error) {
              console.error("Error fetching WhatsApp templates:", error);
              setWhatsappTemplates([]);
            }
          };

          useEffect(() => {
            fetchTemplates();
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

          const handleTemplateChange = (e) => {
            setSelectedTemplate(e.target.value);
          };

          const handleSendMessage = async () => {
            if (!selectedTemplate) {
              toast.warning("Please select a WhatsApp template!");
              return;
            }
        
            if (selectedLeads.length === 0) {
              toast.warning("Please select at least one lead!");
              return;
            }
        
            try {
              const leadsToSend = leads.filter((lead) => selectedLeads.includes(lead._id));
              const sendPromises = leadsToSend.map((lead) =>
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/temp/send-whatsapp`, {
                  templateId: selectedTemplate,
                  recipientPhoneNumber: lead.contact, // Assuming `contact` is the lead's phone number field
                  name: lead.name,
                })
              );
          
              // Wait for all promises to resolve
              await Promise.all(sendPromises);
              setSelectedLeads([]);
              setSelectedTemplate("");
              toast.success("Messages sent successfully!");
            } catch (error) {
              console.error("Error sending messages:", error);
              toast.error("Failed to send messages.");
            }
          };

          const handleAddTemplate = async () => {
            if (!templateName || !templateType || !templateContent) {
              toast.warning("Please fill in all fields!");
              return;
            }
          
            try {
              const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/temp/templates`, {
                name: templateName,
                type: templateType,
                content: JSON.parse(templateContent), // Parse JSON from text input
              });

              fetchTemplates();
              toast.success("Template added successfully!");
              setIsCreateModalOpen(false);
              setTemplateName("");
              setTemplateType("");
              setTemplateContent("");
            } catch (error) {
              console.error("Error adding template:", error);
              toast.error("Failed to add template!");
            }
          };

          const handleCloseModal = () => {
            setIsCreateModalOpen(false);
            setNewLead({
              name: "",
              contact: "",
              course: "",
              source: "",
              email: "",
              comments: "",
            });
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
      <AddTemplateButton onClick={() => setIsCreateModalOpen(true)} >
            <FaUserPlus />
          </AddTemplateButton>

          {isCreateModalOpen && (
      <ModalOverlay>
        <AddAgentModalContent>
          <h2>Add Template</h2>
          <Form>
            <FormRow>
              <Label>Template Name</Label>
          <Input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template Name"
          />
          </FormRow>
          <FormRow>
          <Label>Template Type</Label>
          <ModalSelect
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
          >
            <option value="" disabled>
              Select Template Type
            </option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </ModalSelect>
          </FormRow>
          <FormRow>
          <Label>Template Content (JSON)</Label>
          <InputTextArea
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            placeholder="Enter JSON content here"
          />
          </FormRow>
          <EditButtonContainer>
            <Button onClick={handleAddTemplate}>Submit</Button>
            <CancelButton onClick={handleCloseModal}>Cancel</CancelButton>
          </EditButtonContainer>
          </Form>
        </AddAgentModalContent>
      </ModalOverlay>
    )}

      <ContentArea>
      <HeaderTitle>Communication</HeaderTitle>
      <TopBar>
        <SelectAllContainer>
          <SelectAllCheckbox
          type="checkbox"
          checked={isSelectAllChecked}
          onChange={handleSelectAll}
        />
          <SelectAllText>Select All</SelectAllText>
        </SelectAllContainer>
        <TemplateDropdown
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="" disabled>
            Select WhatsApp Template
          </option>
          {whatsappTemplates.map((template) => (
            <option key={template._id} value={template._id}>
              {template.name}
            </option>
          ))}
        </TemplateDropdown>
          <TemplateDropdown value={""} onChange={(e) => ""}>
            <option value="" disabled>Select Mail Template</option>
          </TemplateDropdown>
          <AssignButton onClick={handleSendMessage}>Send</AssignButton>
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

export default Communication;