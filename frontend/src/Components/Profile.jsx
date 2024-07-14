import React, { useState } from 'react';
import NavBar from './NavBar';
import profileImg from '../assets/image.png';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaPlus, FaEdit } from 'react-icons/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

function Profile() {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([
    { date: "June 2024", title: "Machine Learning" },
    { date: "January 2024", title: "Docker" },
    { date: "July 2023", title: "AWS" },
    { date: "January 2023", title: "Python" },
    { date: "June 2022", title: "Node.js" },
    { date: "January 2022", title: "React" }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState('Software Developer');
  const [tagline, setTagline] = useState('"Catchy Tagline!"');

  const addNewSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() !== '') {
      const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      const newSkillObject = {
        date: currentDate,
        title: newSkill.trim()
      };
      setSkills([newSkillObject, ...skills]);
      setNewSkill('');
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-r from-blue-900 via-violet-900 to-black'>
      <NavBar className="sticky top-0 z-50" />
      <div className="flex-grow flex flex-col lg:flex-row mt-16 px-4 lg:px-12 gap-8">
        {/* Profile and Skills section */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Profile Box */}
          <div className="bg-black rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500 relative">
            <button 
              onClick={handleEdit}
              className="absolute top-4 left-4 bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <FaEdit className="text-black" size={20} />
            </button>
            <div className="relative w-48 h-48 mx-auto mb-8">
              <img 
                src={profileImg}
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-yellow-400 shadow-lg"
              />
              <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full p-3 shadow-lg">
                <FaCode className="text-black" size={24} />
              </div>
            </div> 
            <h2 className="text-5xl font-bold text-yellow-400 text-center mb-3 font-sans">Jane Doe</h2>
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
          <div className="bg-black rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500">
            <h3 className="text-4xl font-semibold text-yellow-400 mb-8 font-sans">Skills</h3>
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

        {/* Timeline */}
        <div className="w-full lg:w-1/2 p-6 bg-black rounded-3xl shadow-2xl border border-yellow-500/30">
          <h3 className="text-4xl font-semibold text-yellow-400 mb-8 font-sans text-center">Timeline</h3>
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
                  onKeyPress={(e) => e.key === 'Enter' && addNewSkill(e)}
                  className="w-full p-3 bg-transparent text-yellow-400 text-2l font-bold mb-1 font-sans border-b-2 border-yellow-400 focus:outline-none focus:border-yellow-500 transition-all duration-300"
                  placeholder="Enter new skill"
                />
                <p className="text-gray-300 font-sans">Press Enter to add new skill</p>
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