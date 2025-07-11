import React, { useState, useEffect } from 'react';
import './NewRepo.css' ;
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const NewRepository = () => {
    const [userData, setUserData] = useState(null);

    const [repoData, setRepoData] = useState({
        name: '',
        description: '',
        isPublic: false,
        isPrivate: false,
        initializeRepo: false
    });
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    // Fetch user profile
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

        fetchUserData();
    }, [userId]);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRepoData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle checkbox changes with mutual exclusivity
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        if (name === 'isPublic' && checked) {
            setRepoData((prev) => ({
                ...prev,
                isPublic: true,
                isPrivate: false
            }));
        } else if (name === 'isPrivate' && checked) {
            setRepoData((prev) => ({
                ...prev,
                isPublic: false,
                isPrivate: true
            }));
        } else {
            setRepoData((prev) => ({
                ...prev,
                [name]: checked
            }));
        }
    };

    // Create repository
    const handleCreateRepo = async () => {
        try {
            const payload = {
                name: repoData.name,
                description: repoData.description,
                visibility: repoData.isPublic ? true : false, // true for public, false for private
                owner: userId
            };

            const res = await axios.post(`${API_URL}/repo/create`, payload);
            console.log('Repository created:', res.data);
            alert('Repository created successfully!');

            // Optionally reset the form
            setRepoData({
                name: '',
                description: '',
                isPublic: false,
                isPrivate: false,
                initializeRepo: false
            });
            navigate('/');
        } catch (err) {
            console.error('Error creating repository:', err);
        }
    };

    return (
        <div className='container'>
            <Navbar name={"Repository"} />
            <div className='new-repo'>
                <div className='part-1 part'>
                    <h1>Create a new repository</h1>
                    <p>A repository contains all project files, including the revision history. Already have a project repository elsewhere? Import a repository.</p>
                </div>

                <div className='part-2 part'>
                    <p><i>Required fields are marked with an asterisk (*)</i></p>
                    <div className='part-2-1 bold'>
                        <p>Repository template</p>
                        <button>No Template</button>
                        <p>Start your repository with a template repository's contents.</p>
                    </div>
                </div>

                <div className='part-3 part'>
                    <div className='part-3-1 bold'>
                        <div className='owner-container'>
                            <p>Owner *</p>
                            <button>{userData ? userData.username : 'Loading...'}</button>
                        </div>
                        <div className='repository-container bold'>
                            <p>Repository name *</p>
                            <input
                                type='text'
                                required
                                name='name'
                                value={repoData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <p>Great repository names are short and memorable. Need inspiration?</p>
                    <div className='description-container bold'>
                        <p>Description (optional)</p>
                        <input
                            type='text'
                            name='description'
                            value={repoData.description}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className='part-4 part'>
                    <div className='property-check-1'>
                        <input
                            type='checkbox'
                            name='isPublic'
                            checked={repoData.isPublic}
                            onChange={handleCheckboxChange}
                        />
                        <div className='part-4-1'>
                            <p>Public</p>
                            <p>Anyone on the internet can see this repository. You choose who can commit.</p>
                        </div>
                    </div>

                    <div className='property-check-1'>
                        <input
                            type='checkbox'
                            name='isPrivate'
                            checked={repoData.isPrivate}
                            onChange={handleCheckboxChange}
                        />
                        <div className='part-4-1'>
                            <p>Private</p>
                            <p>You choose who can see and commit to this repository.</p>
                        </div>
                    </div>
                </div>

                <div className='part-5 part'>
                    <p>Initialize this repository with:</p>
                    <div className='property-check-3'>
                        <input
                            type='checkbox'
                            name='initializeRepo'
                            checked={repoData.initializeRepo}
                            onChange={handleCheckboxChange}
                        />
                        <div className='part-5-1'>
                            <p>Add a README</p>
                            <p>Include a README to help others understand your project.</p>
                        </div>
                    </div>

                    <div className='part-2-1'>
                        <p>Add .gitignore</p>
                        <button>.gitignore templates</button>
                        <p>Choose which files not to track from a list of templates. Learn more about ignoring files.</p>
                    </div>

                    <div className='part-2-1 bold'>
                        <p>Choose a license</p>
                        <button>License templates</button>
                        <p>A license tells others what they can and can't do with your code. Learn more about licenses.</p>
                    </div>
                </div>

                <div className='part-6 part'>
                    <p>You are creating a {repoData.isPublic ? 'public' : 'private'} repository in your personal account.</p>
                </div>

                <div className='part-7 part'>
                    <button className='submit btn' onClick={handleCreateRepo}>
                        Create Repository
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewRepository;
