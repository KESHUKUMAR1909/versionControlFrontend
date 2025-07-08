import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar.jsx';
import HeatMap from './HeatMap.jsx';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/userProfile/${userId}`);
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRepos = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/user/${userId}`);
        setRepos(res.data.repositories || []);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchUserData();
    fetchRepos();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login'); // redirect to login page
  };

  return (
    <div>
      <Navbar />
      <div className="bottom-part">
        {/* Left Profile Info */}
        <div className="left-part">
          <img
            src={userData?.profileImage || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-image"
          />
          <p>{userData?.username || 'Loading...'}</p>

          {/* Profile Actions */}
          <div className="button-group">
            <button>Edit Profile</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>

          <div className="follow-list">
            <p>{userData?.followers?.length || 0} Followers</p>
            <p>{userData?.followedUsers?.length || 0} Following</p>
          </div>
        </div>

        {/* Right Part */}
        <div className="right-part">
          <p className="section-title">Pinned</p>
          <div className="repo-area">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <div className="repo-card" key={repo._id}>
                  <div className="main-area">
                    <p>{repo.name}</p>
                    <button>{repo.visibility ? 'Public' : 'Private'}</button>
                  </div>
                  <p>{repo.description || 'No description provided.'}</p>
                </div>
              ))
            ) : (
              <p>No repositories found.</p>
            )}
          </div>

          <HeatMap className="width-set" />
        </div>
      </div>
    </div>
  );
}
