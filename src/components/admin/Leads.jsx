import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaCog,
  FaEllipsisV,
  FaWhatsapp,
  FaUserPlus,
  FaEdit,
  FaTimes,
  FaAddressCard,
  FaRegPaperPlane
} from "react-icons/fa";

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
  background: rgba(0, 0, 0, 0.6);
  background-image: linear-gradient(135deg, #1a1a1a, #333);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  z-index: 1;

  @media (max-width: 768px) {
    position: fixed;
    left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
    top: 0;
    bottom: 0;
    z-index: 1000;
    padding-top: 3rem;
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
    z-index: 1050;
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
  overflow-y: auto;

  @media (max-width: 768px) {
    padding-top: 0;
    margin-top: 5rem;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ show }) => (show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background: #3a3a3a;
  padding: 2rem;
  border-radius: 1rem;
  width: 400px;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.4s forwards;

  @media (max-width: 768px) {
    width: 80%; /* Make modal width 90% of the screen width on small screens */
    padding: 1.5rem; /* Adjust padding for smaller screens */
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
    h2 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #fff;
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  color: #fff;
  margin-top: 0.5rem;
  font-size: 1.5rem;
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

const ModalInput = styled.input`
  width: 100%;
  padding: 0.8rem 0rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  background: #444;
  color: #fff;

  font-size: 1rem;
  background-color: #2c2c2c;
  margin-bottom: 1rem;
  text-indent: 0.8rem;


  &::placeholder {
    color: #bbb;
  }
`;


const ModalDate = styled.input`
  width: 100%;
  padding: 0.8rem 0rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  background: #444;
  color: #fff;

  font-size: 1rem;
  background-color: #2c2c2c;
  margin-bottom: 1rem;
  text-indent: 0.5rem;
`;

const EditButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* Align buttons to the right */
  gap: 1rem; /* Add space between buttons */
  width: 100%;
  margin-top: 0.6rem; /* Adjust top margin to space out the buttons a bit */
`;  

const ModalButton = styled.button`
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
  background: #3a3a3a;
  padding: 5px 16px 16px 16px; /* Reduced padding for compact list */
  margin: 5px 0;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 30px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 8px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

const LeadSummary = styled.div`
  display: flex;
  flex-direction: column;

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
  font-size: 1.2rem;
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

const LeadComment = styled.p`
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

const LeadFollowDate = styled.p`
  font-size: 0.9rem;
  color: #aaa;
  display: inline;
  text-align: right;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    text-align: left;
  }
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: #fff;
  font-size: 1rem;
  display: inline;
  padding: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

const LeadName = styled.h2`
  font-size: 1.2rem;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LeadDetails = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(50, 50, 50, 0.8), rgba(20, 20, 20, 0.6));
  border-radius: 0.5rem;
  display: ${({ expanded }) => (expanded ? "block" : "none")};
  color: #ddd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;

  p {
    margin: 0.8rem 0;
    color: #ccc;
    font-size: 0.95rem;
    line-height: 1.4;
    font-weight: 300;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.3rem;
  }

  p:last-child {
    border-bottom: none;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(30, 30, 30, 0.7));
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);

    p {
      font-size: 0.85rem;
    }
  }
`;


const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem; /* Adjust gap between filters */
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column; /* Stack filters vertically on small screens */
    gap: 0.5rem; /* Reduce gap for compact layout */
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #444;
  background: #333;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  width: 150px; /* Set a fixed width for better alignment */

  &:focus {
    outline: none;
    border-color: #1b1b1b;
  }

  @media (max-width: 768px) {
    width: 100%; /* Allow the filter to expand and fit the container */
    font-size: 13px; /* Slightly smaller font size for smaller screens */
  }

  @media (max-width: 480px) {
    font-size: 12px; /* Further reduce font size for very small screens */
    padding: 0.5rem; /* Adjust padding for compact design */
  }
`;



const SearchBar = styled.input`
  padding: 0.5rem;
  width: 250px; /* Shortened the width */
  border-radius: 0.5rem;
  border: 1px solid #444;
  background: #333;
  color: #fff;
  font-size: 14px;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
    border-color: #0066cc;
  }
`;

const ResetButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 0.5rem;
  &:hover {
    background-color: #ff2d2d;
  }
`;


const FilterButton = styled.button`
  padding: 0.8rem 1rem;
  background-color: #444;
  color: #fff;
  border: 1px solid #555;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #555;
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

const CancelButton = styled(ModalButton)`
  background: #888; /* Different background color for Cancel button */
  &:hover {
    background: #2c2c2c;
  }
`;

const LeadSource = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  background-color: ${({ source }) => {
    switch (source) {
        case "CollegeDuniya":
          return "rgba(186, 225, 255, 0.2)"; // Powder Blue
        case "Referral":
          return "rgba(255, 204, 229, 0.2)"; // Pale Pink
        case "Social Media":
          return "rgba(240, 230, 140, 0.2)"; // Khaki
        case "Other":
          return "rgba(211, 211, 211, 0.2)"; // Light Gray
        default:
          return "rgba(225, 204, 255, 0.2)"; // Lavender Mist
      }
  }};
  border: 1px solid ${({ source }) => {
    switch (source) {
        case "CollegeDuniya":
          return "rgba(186, 225, 255, 0.6)";
        case "Referral":
          return "rgba(255, 204, 229, 0.6)";
        case "Social Media":
          return "rgba(240, 230, 140, 0.6)";
        case "Other":
          return "rgba(211, 211, 211, 0.6)";
        default:
          return "rgba(225, 204, 255, 0.6)";
      }
  }};

`;

const AddLeadButton = styled.button`
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const FormRow = styled.div`

  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
  margin-bottom: 0.3rem;
  text-indent: 0.3rem;
`;


const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [expandedLead, setExpandedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "",
    contact: "",
    email: "",
    course: "",
    source: "",
    comments: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editableLead, setEditableLead] = useState({
  name: "",
  contact: "",
  email: "",
  course: "",
  stages: "",
  agent: "",
  nextFollowUpDate: "",
  comments:""
  });
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(e.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "course":
        setCourseFilter(value);
        break;
      case "source":
        setSourceFilter(value);
        break;
      case "stage":
        setStageFilter(value);
        break;
      default:
        break;
    }
  };

  // Filter leads based on search and filter criteria
  const filteredLeads = Array.isArray(leads)
  ? leads.filter((lead) => {
      const matchesSearch =
        (lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (lead.contact?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
        (lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) || "");

      const matchesCourse = courseFilter ? lead.course === courseFilter : true;
      const matchesSource = sourceFilter ? lead.source === sourceFilter : true;
      const matchesStage = stageFilter ? lead.stages === stageFilter : true;

      return matchesSearch && matchesCourse && matchesSource && matchesStage;
    })
  : [];


  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("${import.meta.env.VITE_BACKEND_URL}/api/leads/");
        setLeads(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch leads");
      }
    };
    fetchLeads();
  }, []);

  const toggleLeadDetails = (id) => {
    setExpandedLead((prev) => (prev === id ? null : id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitLead = async () => {
    try {
      // Submit the new lead to the server
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/leads/addLead`, newLead);

      setLeads((prev) => (Array.isArray(prev) ? [...prev, response.data] : [response.data]));

      toast.success("Lead created successfully!");
      
      // After submitting the new lead, fetch the updated list of leads
      const updatedLeads = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/leads/`);
      
      // Update the leads state with the new list
      setLeads(updatedLeads.data.reverse());
      
      // Close the modal
      setShowModal(false); 
  
    } catch (error) {
        toast.error("Failed to create lead!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewLead({
      name: "",
      contact: "",
      course: "",
      source: "",
      email: "",
      comments: "",
    });
  };

  const openEditModal = (e, lead) => {
    e.stopPropagation(); // Prevent toggle of lead details
    setEditableLead(lead);
    setShowEditModal(true);
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    console.log('Before update:', editableLead); 
    setEditableLead((prev) => ({ ...prev, [name]: value }));
    console.log('After update:', editableLead); 
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/agents`); // Adjust API path
        setAgents(response.data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };
    fetchAgents();
  }, []);
  
  const handleUpdateLead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/leads/updateLead/${editableLead._id}`, editableLead);
      setLeads((prev) =>
        prev.map((lead) => (lead._id === editableLead._id ? editableLead : lead))
      );
      toast.success("Lead updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  const handleResetFilters = () => {
    setCourseFilter("");
    setSourceFilter("");
    setStageFilter("");
    setSearchQuery("");
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
        <HeaderTitle>Leads</HeaderTitle>
        <SearchBar 
          type="text" 
          placeholder="Search by Name, Contact, or Email..." 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />

        {/* Filters */}
        <FilterContainer>
          <FilterSelect value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">Filter by Course</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BCA">BCA</option>
            <option value="BBA">BBA</option>
          </FilterSelect>

          <FilterSelect value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="">Filter by Source</option>
            <option value="CollegeDuniya">CollegeDuniya</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Other">Other</option>
          </FilterSelect>

          <FilterSelect value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="">Filter by Stage</option>
            <option value="New">New</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Admission Taken">Admission Taken</option>
            <option value="Dead">Dead</option>
          </FilterSelect>

          <ResetButton onClick={handleResetFilters}>
            <FaTimes /> Reset Filters
          </ResetButton>
        </FilterContainer>

        <LeadsList>
          {filteredLeads.map((lead) => (
            <LeadItem key={lead._id} onClick={() => toggleLeadDetails(lead._id)}>
                <LeadSummary>
                <LeadTitle>
                <LeadNameStage>
                    {lead.name}  &nbsp;&nbsp;<LeadSource source={lead.source || "Not Set"}> {lead.source} </LeadSource>&nbsp;&nbsp;<LeadCourse course={lead.course || "Not Set"}> {lead.course}</LeadCourse>&nbsp;&nbsp;<StageBadge stage={lead.stages || "Not Set"}>{lead.stages || "Not Set"}</StageBadge> 
                    <MenuIcon onClick={(e) => openEditModal(e, lead)}>
                  <FiEdit />
                  </MenuIcon>
                </LeadNameStage>
                <LeadComment>{lead.comments}</LeadComment>
                <LeadFollowDate>{lead.nextFollowUpDate
                  ? new Date(lead.nextFollowUpDate).toLocaleDateString("en-GB")
                  : "Not Set"}
                </LeadFollowDate>
                </LeadTitle>
                <LeadContact>Contact: {lead.contact}</LeadContact>
                
              </LeadSummary>
              <LeadDetails expanded={expandedLead === lead._id}>
                <p>Contact: {lead.contact}</p>
                <p>Course: {lead.course}</p>
                <p>Source: {lead.source || "Not Set"}</p>
                <p>Email: {lead.email}</p>
                <p>Agent: {lead.agent || "Not Set"}</p>
                <p>Stage: {lead.stages || "Not Set"}</p>
                <p>Comments: {lead.comments || "Not Set"}</p>
                <p>Next Follow-Up Date: {lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleDateString("en-GB"): "Not Set"}</p>
              </LeadDetails>
            </LeadItem>
          ))}
        </LeadsList>

        <AddLeadButton onClick={() => setShowModal(true)}>
            <FaUserPlus />
        </AddLeadButton>

        {/* Modal for Lead Creation */}
        <ModalOverlay show={showModal}>
          <ModalContent>
            <ModalTitle>Create New Lead</ModalTitle>
            <Form>
              <FormRow><Label>Name</Label>
            <ModalInput
              type="text"
              name="name"
              placeholder="Lead Name"
              value={newLead.name}
              onChange={handleInputChange}
            />
            </FormRow>
            <FormRow><Label>Contact</Label>
            <ModalInput
              type="text"
              name="contact"
              placeholder="Contact"
              value={newLead.contact}
              onChange={handleInputChange}
            />
            </FormRow>
            <FormRow><Label>Email</Label>
            <ModalInput
              type="email"
              name="email"
              placeholder="Email"
              value={newLead.email}
              onChange={handleInputChange}
            />
            </FormRow>
            <FormRow><Label>Course</Label>
            <ModalInput
              type="text"
              name="course"
              placeholder="Course"
              value={newLead.course}
              onChange={handleInputChange}
            />
            </FormRow>
            <FormRow><Label>Source</Label>
            <ModalInput
              type="text"
              name="source"
              placeholder="Source"
              value={newLead.source}
              onChange={handleInputChange}
            />
            </FormRow>
            <FormRow><Label>Comment</Label>
            <ModalInput
              type="text"
              name="comments"
              placeholder="Comments"
              value={newLead.comments}
              onChange={handleInputChange}
            />
              </FormRow>
            <EditButtonContainer>
            <ModalButton onClick={handleSubmitLead}>Submit</ModalButton>
            <CancelButton onClick={handleCloseModal}>Cancel</CancelButton>
            </EditButtonContainer>
            </Form>
          </ModalContent>
        </ModalOverlay>

        <ModalOverlay show={showEditModal}>
        <ModalContent>
          <ModalTitle>Edit Lead Details</ModalTitle>
          <Form>
            <FormRow><Label>Name</Label>
          <ModalInput
            type="text"
            name="name"
            placeholder="Name"
            value={editableLead.name}
            onChange={handleEditChange}
          />
          </FormRow>
          {/* <FormRow><Label>Email</Label>
          <ModalInput
            type="email"
            name="email"
            placeholder="Email"
            value={editableLead.email}
            onChange={handleEditChange}
          />
          </FormRow> */}
          <FormRow><Label>Course</Label>
          <ModalInput
            type="text"
            name="course"
            placeholder="Course"
            value={editableLead.course}
            onChange={handleEditChange}
          />
          </FormRow>
          <FormRow><Label>Lead Stage</Label>
          <ModalSelect
            name="stages"
            value={editableLead.stages}
            onChange={handleEditChange}
          >
            <option value="" disabled>Select Stage</option>
            <option value="New">New</option>
            <option value="Warm">Warm</option>
            <option value="Form Sold">Form Sold</option>
            <option value="Admission Taken">Admission Taken</option>
            <option value="Dead">Dead</option>
          </ModalSelect>
          </FormRow>

          {/* Agent Dropdown */}
          <FormRow><Label>Agent</Label>
          <ModalSelect
            name="agent"
            value={editableLead.agent}
            onChange={handleEditChange}
          >
            <option value="" disabled>Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.name}>
                {agent.name}
              </option>
            ))}
          </ModalSelect>
          </FormRow>
          <FormRow><Label>Comments</Label>
          <ModalInput
            type="text"
            name="comments"
            placeholder="Comments"
            value={editableLead.comments}
            onChange={handleEditChange}
          />
          </FormRow>

          {/* Next Follow-Up Date */}
          <FormRow><Label>Next Follow-Up Date</Label>
          <ModalDate
            type="date"
            name="nextFollowUpDate"
            placeholder="Next Follow-Up Date"
            value={editableLead.nextFollowUpDate}
            onChange={handleEditChange}
          />
          </FormRow>
          <EditButtonContainer>
            <ModalButton onClick={handleUpdateLead}>Save</ModalButton>
            <CancelButton onClick={() => setShowEditModal(false)}>Cancel</CancelButton>
          </EditButtonContainer>
          </Form>
          </ModalContent>
          </ModalOverlay>

      </ContentArea>
    </Container>
  );
};

export default Leads;
