/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import profileImg from '../assets/image.png';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaPlus, FaEdit } from 'react-icons/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

function Profile() {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState('');
  const [tagline, setTagline] = useState('"Catchy Tagline!"');
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User');
  useEffect(() => {
    fetchUserName();
    fetchPosition();
    fetchTagline();
    fetchSkills();
  }, []);
  const fetchUserName = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserName(user.name || 'User');
    }
  };
  const fetchPosition = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.email) {
        console.error('User email not found in local storage');
        return;
      }
      
      const response = await axios.get(`https://skana.onrender.com/api/user/job?email=${encodeURIComponent(user.email)}`);
      if (response.data && response.data.job) {
        setPosition(response.data.job);
      }
    } catch (error) {
      console.error('Error fetching position:', error);
      setPosition('Developer');  // Set default job if there's an error
    }
  };
  
  const savePosition = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.email) {
        console.error('User email not found in local storage');
        return;
      }
      
      const jobToSave = position.trim() || 'Developer';
      
      await axios.post('https://skana.onrender.com/api/user/job', { 
        email: user.email, 
        job: jobToSave
      });
      console.log('Position updated successfully');
      setPosition(jobToSave); // Update the state immediately
      fetchPosition(); // Refetch to ensure we have the latest data
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };
  
  const fetchSkills = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.email) {
        console.error('User email not found in local storage');
        return;
      }
      
      const response = await axios.get(`https://skana.onrender.com/api/skills?email=${encodeURIComponent(user.email)}`);
      if (response.data && Array.isArray(response.data.skills)) {
        setSkills(response.data.skills);
      } else {
        setSkills([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    }
  };
  
  const addNewSkill = async (e) => {
    e.preventDefault();
    if (newSkill.trim() !== '') {
      try {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user || !user.email) {
          console.error('User email not found in local storage');
          return;
        }
        const response = await axios.post('https://skana.onrender.com/api/skills', { 
          email: user.email, 
          skill: newSkill.trim() 
        });
        setSkills([...skills, response.data.skill]);
        setNewSkill('');
      } catch (error) {
        console.error('Error adding new skill:', error);
      }
    }
  };
  

  // Fetch tagline
const fetchTagline = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      throw new Error('User email not found');
    }
    const response = await axios.get(`https://skana.onrender.com/api/user/tagline?email=${encodeURIComponent(user.email)}`);
    setTagline(response.data.tagline);
  } catch (error) {
    console.error('Error fetching tagline:', error);
    setTagline('A catchy tagline!');
  }
};

// Update tagline
const saveTagline = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      throw new Error('User email not found');
    }
    await axios.post('https://skana.onrender.com/api/user/tagline', {
      email: user.email,
      tagline: tagline
    });
    console.log('Tagline updated successfully');
  } catch (error) {
    console.error('Error saving tagline:', error);
  }
};

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const updatedPosition = position.trim() || 'Developer';
  const updatedTagline = tagline.trim() || 'A catchy tagline!';
  setPosition(updatedPosition);
  setTagline(updatedTagline);
  savePosition();
  saveTagline();
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-r from-blue-900 via-violet-900 to-black'>
      <NavBar className="sticky top-0 z-50" />
      <div className="flex-grow flex flex-col lg:flex-row mt-16 px-4 lg:px-12 gap-8">
        {/* Profile and Skills section */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Profile Box */}
          <div className="bg-black bg-opacity-50 rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500 backdrop-blur-sm">
            <button 
              onClick={handleEdit}
              className="absolute top-4 left-4 bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <FaEdit className="text-black" size={20} />
            </button>
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 via-violet-500 to-blue-700 flex items-center justify-center shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <span className="text-7xl font-extrabold text-white relative z-10 font-sans tracking-wider">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full p-3 shadow-lg transform rotate-12 transition-transform duration-300 hover:rotate-0">
                <FaCode className="text-black" size={24} />
              </div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-300 rounded-full opacity-50 animate-pulse"></div>
            </div> 
            <h2 className="text-5xl font-bold text-yellow-400 text-center mb-3 font-sans">{userName}</h2>
            {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            onBlur={handleInputBlur}
            className="w-full bg-transparent text-white text-center text-2xl py-1 px-2 rounded-lg font-sans border-b border-yellow-400 focus:outline-none focus:border-yellow-500"
          />
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            onBlur={handleInputBlur}
            className="w-full bg-transparent text-gray-300 text-center italic py-1 px-2 rounded-lg font-sans text-lg border-b border-yellow-400 focus:outline-none focus:border-yellow-500"
          />
        </div>
      ) : (
        <>
          <p className="text-white text-center text-2xl mb-4 font-sans">{position}</p>
          <p className="text-gray-300 text-center italic mb-8 font-sans text-lg">{tagline}</p>
        </>
      )}
            <div className="flex justify-center space-x-6">
              {[FaGithub, FaLinkedin, FaTwitter, FaEnvelope].map((Icon, index) => (
                <a key={index} href="#" className="bg-gray-800 p-4 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-110 shadow-lg">
                  <Icon className="text-gray-300 hover:text-black" size={24} />
                </a>
              ))}
            </div>
          </div>
            
          {/* Skills List */}
          <div className="bg-black bg-opacity-50 rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500 backdrop-blur-sm">            <h3 className="text-4xl font-semibold text-yellow-400 mb-8 font-sans">Skills</h3>
            <div className="grid grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 bg-gray-800 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.7)]"
                >
                  <span className="font-sans text-lg text-gray-300 hover:text-black">
                    {skill.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-6 bg-black bg-opacity-50 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">          <h3 className="text-4xl font-semibold text-yellow-400 mb-8 font-sans text-center">Timeline</h3>
          <VerticalTimeline layout="1-column" lineColor="rgba(251, 191, 36, 0.3)">
            {/* Add Skill Input */}
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ 
                background: 'rgba(31, 41, 55, 0.8)', 
                color: '#fff', 
                boxShadow: '0 3px 0 #fbbf24', 
                borderRadius: '15px',
                padding: '20px'
              }}
              contentArrowStyle={{ borderRight: '7px solid rgba(31, 41, 55, 0.8)' }}
              iconStyle={{ background: '#fbbf24', color: '#1f2937' }}
              icon={<FaPlus />}
            >
              <form onSubmit={addNewSkill} className="flex flex-col">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full p-3 bg-transparent text-yellow-400 text-2l font-bold mb-1 font-sans border-b-2 border-yellow-400 focus:outline-none focus:border-yellow-500 transition-all duration-300"
                  placeholder="Press Enter to add a new skill"
                />
              </form>
            </VerticalTimelineElement>
            {/* Existing Skills */}
            {skills.map((skill, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgba(31, 41, 55, 0.8)', color: '#fff', boxShadow: '0 3px 0 #fbbf24', borderRadius: '15px' }}
                contentArrowStyle={{ borderRight: '7px solid rgba(31, 41, 55, 0.8)' }}
                date={skill.date}
                iconStyle={{ background: '#fbbf24', color: '#1f2937' }}
                icon={<FaCode />}
              >
                <h3 className="text-yellow-400 text-2xl font-bold mb-1 font-sans">{skill.title}</h3>
                <p className="text-gray-300 font-sans">Mastered {skill.title}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </div>
  );
}

export default Profile;
