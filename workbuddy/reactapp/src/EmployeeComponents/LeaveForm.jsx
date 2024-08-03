import React, { useState, useEffect } from 'react';
import './LeaveForm.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './EmployeeNavbar';
import API_BASE_URL from '../apiConfig';

const LeaveForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    StartDate: '',
    EndDate: '',
    Reason: '',
    LeaveType: '',
    Status: 'Pending',
    File: '',
  });

  const [errors, setErrors] = useState({
    StartDate: '',
    EndDate: '',
    Reason: '',
    LeaveType: '',
    Status: '',
    File: '',
  });

  const [successPopup, setSuccessPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    if (id) {
      fetchLeaveRequest(id);
    }
  }, [id]);

  const fetchLeaveRequest = async (id) => {
    try {
      const response = await axios.get(API_BASE_URL + `/api/leaverequest/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if (response.status === 200) {
        console.log("Fetched leave request data:", response.data);
        setFormData({
          StartDate: new Date(response.data.StartDate).toISOString().split('T')[0],
          EndDate: new Date(response.data.EndDate).toISOString().split('T')[0],
          Reason: response.data.Reason,
          LeaveType: response.data.LeaveType,
          Status: response.data.Status,
          File: response.data.Attachment,
        });
        setFileURL(response.data.Attachment);
      }
    } catch (error) {
      console.log("error: " + error);
      // navigate('/error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLeaveRequest = async () => {
    const fieldErrors = {};

    if (!formData.StartDate) {
      fieldErrors.StartDate = 'Start Date is required';
    }

    if (!formData.EndDate) {
      fieldErrors.EndDate = 'End Date is required';
    }

    if (!formData.Reason) {
      fieldErrors.Reason = 'Reason is required';
    }

    if (!formData.LeaveType) {
      fieldErrors.LeaveType = 'Leave Type is required';
    }

    if (!formData.File) {
      fieldErrors.File = 'File is required';
    }

    // // Add this block to check if file is not selected
    // if (!file && !fileURL) {
    //   fieldErrors.File = 'File is required';
    // }

    if (Object.values(fieldErrors).some((error) => error)) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

      const requestObject = {
        userId, // Include userId in requestObject
        StartDate: formData.StartDate,
        EndDate: formData.EndDate,
        Reason: formData.Reason,
        LeaveType: formData.LeaveType,
        Status: formData.Status,
        CreatedOn:new Date,
        Attachment: formData.File
        // Attachment: file ? filePreview : fileURL,
      };
      const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('token'),
        },
    };

      // const response = id
      //   ? await axios.put(API_BASE_URL + `/api/leaverequest/${id}`, requestObject, {
      //       headers: { Authorization: localStorage.getItem('token') },
      //     })
      //   : await axios.post(API_BASE_URL + '/api/leaverequest', requestObject, {
      //       headers: { Authorization: localStorage.getItem('token') },
      //     });

      const response = id
            ? await axios.put(API_BASE_URL + `/api/leaverequest/${id}`, requestObject, config)
            : await axios.post(API_BASE_URL + '/api/leaverequest', requestObject, config);


      console.log('editoraddleave', response);

      if (response.status === 200) {
        setSuccessPopup(true);
      }
    } catch (error) {
      console.log('error', error);
      // navigate('/error');
    }
  };

  const handleSuccessMessage = () => {
    setSuccessPopup(false);
    navigate(-1);
  };

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   setFile(file);

  //   if (file) {
  //     try {
  //       const base64String = await convertFileToBase64(file);
  //       setFilePreview(base64String);
  //     } catch (error) {
  //       console.error("Error converting file to base64:", error);
  //       navigate("/error");
  //     }
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFilePreview(URL.createObjectURL(file));
        setFormData({ ...formData, File: file });
    }
};

  // Add this function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result); // Include the data URL prefix
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <Navbar />
      <div className={`leave-form-container ${successPopup ? 'blur' : ''}`}>
        {id && (
          <>
            <button 
              type="button" 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <h2 className='Editheading'>Edit Leave Request</h2>
          </>
        )}
        {!id && <h2>Apply Leave Request</h2>}
        <div>
          <div className="form-group">
            <label htmlFor="StartDate">
              Start Date <span className="required-asterisk">*</span>
            </label>
            <input
              type="date"
              name="StartDate"
              value={formData.StartDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.StartDate && <div className="error">{errors.StartDate}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="EndDate">
              End Date <span className="required-asterisk">*</span>
            </label>
            <input
              type="date"
              name="EndDate"
              value={formData.EndDate}
              onChange={handleChange}
              min={formData.StartDate}
            />
            {errors.EndDate && <div className="error">{errors.EndDate}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="Reason">
              Reason <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="Reason"
              value={formData.Reason}
              onChange={handleChange}
            />
            {errors.Reason && <div className="error">{errors.Reason}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="LeaveType">
              Leave Type <span className="required-asterisk">*</span>
            </label>
            <select
              name="LeaveType"
              value={formData.LeaveType}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="PTO">PTO</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            {errors.LeaveType && <div className="error">{errors.LeaveType}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="File" className="form-label">
              Attachment:<span className="required-asterisk">*</span>
            </label>
            <input
              id="File"
              type="file"
              className="form-input"
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .pdf" // Specify the allowed file types
            />
            {errors.File && <div className="error">{errors.File}</div>}
          </div>
          <button className='leavebutton' type="button" onClick={handleAddLeaveRequest}>
            {id ? 'Update Request' : 'Add Request'}
          </button>
        </div>
      </div>
      {successPopup && (
        <div className="modalpopup">
          <p>{id ? 'Updated Successfully!' : 'Successfully Added!'}</p>
          <button onClick={handleSuccessMessage}>Ok</button>
        </div>
      )}
    </div>
  );
};

export default LeaveForm;
