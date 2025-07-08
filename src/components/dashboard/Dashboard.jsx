import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './Search.jsx';
import './dashboard.css';
import Navbar from '../Navbar.jsx'

const Dashboard = () => {
  const [AvailRepos, setAvailRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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


  useEffect(() => {
    const fetchAvailRepos = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        console.error('No userId in localStorage');
        return;
      }

      try {
        const result = await axios.get(`http://localhost:3000/repo/user/${storedUserId}`);
        setAvailRepos(result.data.repositories);
        setSearchResults(result.data.repositories); // Also initialize search view
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchAvailRepos();
  }, []);
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(AvailRepos);
    }
  }, [searchQuery, AvailRepos]);
  const getSearchResults = async () => {
    try {
      // If search is empty, show all available repos
      if (searchQuery.trim() === "") {
        setSearchResults(AvailRepos);
        return;
      }

      const res = await axios.get(`http://localhost:3000/repo/name/${searchQuery}`);
      if (!res.data.repository || res.data.repository.length === 0) {
        setSearchResults([]);
      } else {
        setSearchResults(res.data.repository);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  return (
    <>
      <Navbar className="navbar"/>
      <div className='dashboard-container'>
        {/* Left: All Repos */}
        <div className='left-part'>
          <Search
            title={"Top Repositories"}
            btnTitle='New'
            handleClick={() => console.log("Hello Keshu")}
            value={""}
            setValue={setSearchQuery}
          />
          {AvailRepos.length > 0 ? (
            AvailRepos.map((repo, index) => (
              <p className='list' key={index}>{repo.name}</p>
            ))
          ) : (
            <p>No repositories found.</p>
          )}
        </div>

        {/* Center: Search Results */}
        <div className='center-part'>
          <Search
            title={"Search Repositories"}
            btnTitle="Search"
            handleClick={getSearchResults}
            value={searchQuery}
            setValue={setSearchQuery}
          />
          <div className="search-results-container">
            {searchResults.length > 0 ? (
              searchResults.map((repo) => (
                <div className="repo-card" key={repo._id}>
                  <h3 className="repo-name">{repo.name}</h3>
                  <p className="repo-description">{repo.description || "No description provided."}</p>
                  <p className="repo-owner">Owner: {repo.owner?.username || "Unknown"}</p>
                </div>
              ))
            ) : (
              <p>No matching repositories found.</p>
            )}
          </div>
        </div>

        {/* Right Part */}
        <div className='right-part'>
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
