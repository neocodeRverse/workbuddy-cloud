import React, { useEffect, useState } from 'react';
import EmployeeNavbar from '../EmployeeComponents/EmployeeNavbar';
import './HomePage.css'; // Import your custom styles
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ManagerNavbar from '../ManagerComponents/ManagerNavbar';

const HomePage = () => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);
  
  return (
    <div className="wrapper">
      {userRole === 'Employee' ? <EmployeeNavbar /> : <ManagerNavbar />}
      <div className="coverimage">
        <LazyLoadImage
          effect="blur"
          src={process.env.PUBLIC_URL + '/workbuddycoverimage.png'} 
          alt="Cover" 
        />
        <div className="title">WorkBuddy</div>
      </div>

      <div className="content">
        <p>Success at work is a journey, and the first step is managing your tasks effectively. Our platform offers a seamless task management process, helping you stay organized and focused. Start managing your tasks today and get one step closer to achieving your work goals.</p>
      </div>

      <div className="contact">
        <h2>Contact Us</h2>
        <p>Email: example@example.com</p>
        <p>Phone: 123-456-7890</p>
      </div>
    </div>
  );
};

export default HomePage;