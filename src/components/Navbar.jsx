import React from 'react';
import './Navbar.css'; 
import { FaGithub, FaBars, FaSearch, FaUserFriends, FaPlus, FaRecordVinyl, FaCodeBranch, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Navbar = ({name}) => {
  return (
    <nav className="top-navbar">
      <div className="left-section">
        <button className="icon-btn"><FaBars /></button>
        <FaGithub className="github-logo" />
        <span className="dashboard-title">{name}</span>
      </div>

      <div className="search-section">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Type / to search" />
      </div>

      <div className="right-section">
        <button className="icon-btn"><FaUserFriends /></button>
        <div className="divider" />
        <button className="icon-btn"><FaPlus /></button>
        <button className="icon-btn"><FaRecordVinyl /></button>
        <button className="icon-btn"><FaCodeBranch /></button>
        <button className="icon-btn"><FaFolderOpen /></button>
         <Link to='/profile'><img src="https://i.imgur.com/your-image.png" alt="profile" className="profile-pic" /></Link>
      </div>
    </nav>
  );
};

export default Navbar;
