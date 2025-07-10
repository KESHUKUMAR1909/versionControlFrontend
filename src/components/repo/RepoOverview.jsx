import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import './RepoOverview.css';

const RepoOverview = () => {
  const { id } = useParams(); // repoId
  const navigate = useNavigate();
  const location = useLocation();

  const [repo, setRepo] = useState(null);
  const [commitId, setCommitId] = useState(null);
  const [allCommits, setAllCommits] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [currentPath, setCurrentPath] = useState('');

  // Fetch repository details
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/${id}`);
        setRepo(res.data.repository);
      } catch (err) {
        console.error("Error fetching repo:", err);
      }
    };
    fetchRepo();
  }, [id]);

  // Fetch commits and file list based on path or selected commit
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/${id}/commits`);
        const commits = res.data.commits;
        if (!commits.length) return;

        setAllCommits(commits);

        const selectedCommit = commitId || commits[0].commitId;
        setCommitId(selectedCommit);

        const path = location.pathname.split(`/repo/${id}`)[1] || '/';
        setCurrentPath(path);

        const encodedPath = encodeURIComponent(path.replace(/^\/+/, ''));
        const url = `http://localhost:3000/repo/${id}/commit/${selectedCommit}/file/${encodedPath}`;

        const fileRes = await axios.get(url);
        if (fileRes.data.type === 'file') {
          setFileContent(fileRes.data.content);
          setFileList([]);
        } else {
          setFileContent(null);
          setFileList(fileRes.data.files);
        }
      } catch (err) {
        console.error("❌ Error fetching files or commits:", err.response?.data || err.message);
        setFileList([]);
        setFileContent(null);
      }
    };

    fetchData();
  }, [id, location.pathname, commitId]);

  const handleClick = async (item) => {
    const newPath = pathJoin(currentPath, item.name);

    if (item.type === 'file') {
      try {
        const url = `http://localhost:3000/repo/${id}/commit/${commitId}/details/${encodeURIComponent(newPath.replace(/^\/+/, ''))}`;
        const res = await axios.get(url);

        setFileContent({
          name: res.data.name,
          size: res.data.size,
          type: res.data.contentType,
          lastModified: res.data.lastModified,
          content: res.data.content,
        });

        setFileList([]); // clear file list since we're showing file content
      } catch (err) {
        console.error("Error fetching file details:", err.message);
      }
    } else {
      // for folders, update path to show inner files
      const encoded = encodeURIComponent(newPath.replace(/^\/+/, ''));
      navigate(`/repo/${id}${newPath}`);
    }
  };


  const pathJoin = (base, name) => {
    return `${base}/${name}`.replace(/\/+/g, '/');
  };

  const handleDeleteRepo = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this repository?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/repo/delete/${id}`);
      alert("Repository deleted successfully!");
      navigate('/'); // redirect after deletion
    } catch (err) {
      console.error("Error deleting repository:", err.message);
      alert("Failed to delete repository.");
    }
  };

  const handleCommitChange = (e) => {
    setCommitId(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="repo-overview-container">
        {repo && (
          <>
            <div className="repo-header">
              <h1>📦 {repo.name}</h1>
              <span className={`visibility-tag ${repo.visibility ? 'public' : 'private'}`}>
                {repo.visibility ? 'Public' : 'Private'}
              </span>
              <button className="delete-repo-btn" onClick={handleDeleteRepo}>
                🗑️ Delete Repository
              </button>
            </div>

            <div className="repo-meta">
              <span>🌿 Branch: master</span>
              <span>📝 Commit:</span>
              <select className="commit-dropdown" value={commitId} onChange={handleCommitChange}>
                {allCommits.map((commit) => (
                  <option key={commit._id} value={commit.commitId}>
                    {commit.commitId.substring(0, 8)} | {commit.message || 'No message'} |{' '}
                    {commit.author || 'Unknown'} | {new Date(commit.date).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {fileContent ? (
          <div className="file-content">
            <h2>📄 {fileContent.name}</h2>
            <p><strong>Type:</strong> {fileContent.type}</p>
            <p><strong>Size:</strong> {fileContent.size} bytes</p>
            <p><strong>Last Modified:</strong> {fileContent.lastModified}</p>
            <pre>{fileContent.content}</pre>
          </div>
        ) : (
          <div className="file-list">
            {fileList.length > 0 ? (
              fileList.map((item, index) => (
                <div className="file-row" key={index} onClick={() => handleClick(item)}>
                  <span className="file-name">
                    {item.type === 'folder' ? '📁' : '📄'} {item.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-folder">No files found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RepoOverview;
