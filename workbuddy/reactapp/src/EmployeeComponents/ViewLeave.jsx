import React, { useState, useMemo } from "react";
import "./ViewLeave.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearInfo } from "../userSlice";
import { useQuery } from "react-query";
import axios from "axios";
import EmployeeNavbar from "./EmployeeNavbar";
import API_BASE_URL from "../apiConfig";

const ViewLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [maxRecords, setMaxRecords] = useState(1);
  const username = useSelector((state) => state.user.userName);

  const totalPages = Math.ceil(maxRecords / limit);

  const [availableLeave, setAvailableLeave] = useState([]);
  const updateAvailableLeave = (newLeave) => {
    setAvailableLeave(newLeave);
  };

  const handlePagination = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteClick = (leave) => {
    setLeaveToDelete(leave);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (leaveToDelete) {
        const response = await axios.delete(
          `${API_BASE_URL}/api/leaverequest/${leaveToDelete}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("delete", response);
        if (response.status === 200) {
          refetch();
        } else {
          navigate("/error");
        }
        closeDeletePopup();
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const closeDeletePopup = () => {
    setLeaveToDelete(null);
    setShowDeletePopup(false);
  };

  const fetchAvailableLeave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(
        `${API_BASE_URL}/api/leaverequest/user/${userId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      console.log("myleave", res);

      if (res.status === 200) {
        return res.data;
      } else {
        navigate("/error");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const { data, status, refetch } = useQuery("availableLeave", fetchAvailableLeave);
  React.useEffect(() => {
    if (data) {
      updateAvailableLeave(data);
      setMaxRecords(data.length);
    }
  }, [data]);

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);
  };

  const handleSortChange = (e) => {
    const inputValue = e.target.value;
    setSortValue(inputValue);
  };

  const sortedAndFilteredLeave = useMemo(() => {
    let filteredLeave = [...availableLeave];

    // Perform search
    if (searchValue) {
      filteredLeave = filteredLeave.filter(leave =>
        leave.Reason.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Perform sort
    if (sortValue) {
      filteredLeave.sort((a, b) => {
        if (sortValue === '1') {
          return new Date(a.StartDate) - new Date(b.StartDate);
        } else if (sortValue === '2') {
          return new Date(b.StartDate) - new Date(a.StartDate);
        } else if (sortValue === '3') {
          return new Date(a.EndDate) - new Date(b.EndDate);
        } else if (sortValue === '4') {
          return new Date(b.EndDate) - new Date(a.EndDate);
        }
      });
    }

    return filteredLeave;
  }, [availableLeave, searchValue, sortValue]);

  const paginatedLeave = useMemo(() => {
    // Perform pagination
    return sortedAndFilteredLeave.slice((page - 1) * limit, page * limit);
  }, [sortedAndFilteredLeave, page, limit]);

  return (
    <div id="parent">
      <EmployeeNavbar />
      <div id="leaveHomeBody" className={showDeletePopup ? "blur" : ""}>
        <h1>Leave Requests</h1>
        <div className="boxcontainer">
          <input
            id="leavesearchBox"
            type="text"
            placeholder="Search by Reason..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <table className="leave-table">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created On</th>
              <th>Leave Type</th>
              <th>Action</th>
            </tr>
          </thead>
          {status === "loading" && (
            <tbody>
              <tr>
                <td>Loading...</td>
              </tr>
            </tbody>
          )}
          {status === "error" && (
            <tbody>
              <tr>
                <td>Error loading data</td>
              </tr>
            </tbody>
          )}
          {status === "success" && paginatedLeave.length ? (
            <tbody>
              {paginatedLeave.map((leave, index) => (
                <tr key={leave.LeaveRequestId}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{new Date(leave.StartDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.EndDate).toLocaleDateString()}</td>
                  <td>{leave.Reason}</td>
                  <td>{leave.Status}</td>
                  <td>{new Date(leave.CreatedOn).toLocaleDateString()}</td>
                  <td>{leave.LeaveType}</td>
                  <td>
                    <button 
                      className={`viewleavebutton ${leave.Status !== "Pending" ? "disabled-button" : ""}`} 
                      disabled={leave.Status !== "Pending"} 
                      onClick={() => navigate("/newleave/" + leave.LeaveRequestId)}
                    >
                      Edit
                    </button>
                    <button 
                      className={`deleteButton ${leave.Status !== "Pending" ? "disabled-button" : ""}`} 
                      disabled={leave.Status !== "Pending"} 
                      onClick={() => handleDeleteClick(leave.LeaveRequestId)} 
                      id="deleteButton"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
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
      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={closeDeletePopup}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewLeave;
