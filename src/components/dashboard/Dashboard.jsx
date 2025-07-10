import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search.jsx';
import './dashboard.css';
import Navbar from '../Navbar.jsx';
import { Link, useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const [AvailRepos, setAvailRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const jobOpenings = [
    {
      title: "Frontend Developer",
      company: "SoftSell Pvt Ltd",
      location: "Remote",
      type: "Full-time",
      postedDate: "July 8, 2025"
    },
    {
      title: "Backend Developer Intern",
      company: "CodeVerse Inc",
      location: "Bangalore",
      type: "Internship",
      postedDate: "July 7, 2025"
    },
    {
      title: "MERN Stack Developer",
      company: "DevHub Solutions",
      location: "Delhi",
      type: "Part-time",
      postedDate: "July 6, 2025"
    }
  ];

  // ✅ Automatically fetch on first render
  useEffect(() => {
    const fetchRepos = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        setError("User ID not found");
        return;
      }

      try {
        setLoading(true);
        const result = await axios.get(`${API_URL}/repo/user/${storedUserId}`);
        setAvailRepos(result.data.repositories);
        setSearchResults(result.data.repositories);
        setError(null);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const getSearchResults = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults(AvailRepos);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/repo/name/${searchQuery}`);
      if (!res.data.repository) {
        setSearchResults([]);
      } else {
        setSearchResults([res.data.repository]); // Ensure it's an array
      }
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar className="navbar" name="Dashboard" />
      <div className="dashboard-container">

        {/* Left: Repositories */}
        <div className="left-part">
          <Search
            title="Top Repositories"
            btnTitle="New"
            handleClick={() => navigate("/new")}
            value={""}
            setValue={setSearchQuery}
          />
          {loading ? (
            <p>Loading...</p>
          ) : AvailRepos.length > 0 ? (
            AvailRepos.map((repo, index) => (
              <p className="list" key={index}>{repo.name}</p>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </div>

        {/* Center: Search Results */}
        <div className="center-part">
          <Search
            title="Search Repositories"
            btnTitle="Search"
            handleClick={getSearchResults}
            value={searchQuery}
            setValue={setSearchQuery}
          />

          {error && <p className="error">{error}</p>}

          <div className="search-results-container">
            {loading ? (
              <p>Loading...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((repo) => (
                <Link to={`/repo/${repo._id}`} key={repo._id} className="repo-card-link">
                  <div className="repo-card">
                    <h3 className="repo-name">{repo.name}</h3>
                    <p className="repo-description">{repo.description || "No description provided."}</p>
                    <p className="repo-owner">Owner: {repo.owner?.username || "Unknown"}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No matching repositories found.</p>
            )}
          </div>
        </div>

        {/* Right Part: Job Openings */}
        <div className="right-part">
          <h3 style={{ marginBottom: "10px" }}>Job Openings</h3>
          <div className="openings-container">
            {jobOpenings.map((job, index) => (
              <div className="job-card" key={index}>
                <div className="job-header">
                  <h4 className="job-title">{job.title}</h4>
                  <span className="job-type">{job.type}</span>
                </div>
                <p className="job-company"><strong>Company:</strong> {job.company}</p>
                <p className="job-location"><strong>Location:</strong> {job.location}</p>
                <p className="job-date">Posted on: {job.postedDate}</p>
                <button className="apply-btn" onClick={() => alert(`Apply for ${job.title}`)}>Apply</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
