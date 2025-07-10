import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar.jsx';
import HeatMap from './HeatMap.jsx';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [localImage, setLocalImage] = useState(localStorage.getItem('profileImage') || '');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/userProfile/${userId}`);
        setUserData(res.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRepos = async () => {
      try {
        const res = await axios.get(`${API_URL}/repo/user/${userId}`);
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
    navigate('/login');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      localStorage.setItem('profileImage', base64Image);
      setLocalImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Navbar />
      <div className="bottom-part">
        {/* Left Profile Info */}
        <div className="left-part">
          <div className="image-wrapper">
            <img
              src={localImage || userData?.profileImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="profile-image"
            />
            <label htmlFor="image-upload" className="upload-icon">🖼️</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

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
