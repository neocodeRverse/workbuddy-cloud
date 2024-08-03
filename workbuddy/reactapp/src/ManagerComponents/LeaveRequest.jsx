import React, { useState, useEffect } from 'react';
import './LeaveRequest.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import ManagerNavbar from './ManagerNavbar';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(null);
  const [statusFilter, setStatusFilter] = useState("-1");
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [maxPageLength, setMaxPageLength] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leaverequest`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      console.log("leaverequest", response);
      if (response.data && response.data) {
        setLeaveRequests(response.data);
      } else {
        console.error('Unexpected API response', response);
      }
    } catch (error) {
      console.log(error);
      // navigate("/error")
    }
  }

  const handleApprove = async (id) => {
    const updatedRequest = leaveRequests.find(request => request.LeaveRequestId === id);
    if (updatedRequest) {
      const requestObject = {
        ...updatedRequest,
        Status: "Approved"
      };

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/leaverequest/${id}`,
          requestObject, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("updateresponse", response);
        if (response.status === 200) {
          fetchData();
        }
      } catch (error) {
        console.log(error);
        // navigate("/error")
      }
    }
  };

  const handleReject = async (id) => {
    const updatedRequest = leaveRequests.find(request => request.LeaveRequestId === id);
    if (updatedRequest) {
      const requestObject = {
        ...updatedRequest,
        Status: "Rejected"
      };

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/leaverequest/${id}`,
          requestObject, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response.status === 200) {
          fetchData();
        } else {
          navigate("/error")
        }
      } catch (error) {
        navigate("/error")
      }
    }
  };

  const handleRowExpand = (index) => {
    if (expandedRow === index) {
      setShowModal(false);
      setExpandedRow(null);
      setSelectedLeave(null);
    } else {
      const selected = leaveRequests[index];
      setExpandedRow(index);
      setSelectedLeave(selected);
      setShowModal(true);
    }
  };

  const LeaveDetailsModal = ({ leave, onClose }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button id='redButtons' onClick={onClose}>
            X
          </button>
          <div className="address-details">
            <div>
              <div><b>Attachment:</b></div>
              <img src={leave.Attachment} alt="Wfh Image" style={{ height: '300px', width: '300px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="home">
      <ManagerNavbar />
      <div className='leaverequest'>
        <h1>Leave Requests for Approval</h1>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>LeaveType</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {leaveRequests.length ? (
            <tbody>
              {leaveRequests.map((request, index) => (
                <React.Fragment key={request.LeaveRequestId}>
                  <tr>
                    <td>{request.User.Username}</td>
                    <td>{new Date(request.StartDate).toLocaleDateString()}</td>
                    <td>{new Date(request.EndDate).toLocaleDateString()}</td>
                    <td>{request.Reason}</td>
                    <td>{request.LeaveType}</td>
                    <td>{request.Status}</td>
                    <td>
                      <button onClick={() => handleRowExpand(index)}>Show More</button>
                      {(request.Status === "Pending" || request.Status === "Rejected") && (
                        <button id="greenButton" onClick={() => handleApprove(request.LeaveRequestId)}>Approve</button>
                      )}
                      {(request.Status === "Pending" || request.Status === "Approved") && (
                        <button id="redButton" onClick={() => handleReject(request.LeaveRequestId)}>Reject</button>
                      )}
                    </td>
                  </tr>
                  {showModal && expandedRow === index && (
                    <LeaveDetailsModal leave={selectedLeave} onClose={() => { setShowModal(false); setExpandedRow(null); setSelectedLeave(null); }} />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={8} className="no-records-cell">
                  Oops! No records Found
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default LeaveRequests;
