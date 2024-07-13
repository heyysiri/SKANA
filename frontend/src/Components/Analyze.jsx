/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaRocket, FaBrain, FaChartLine } from 'react-icons/fa';
import { Radar } from 'react-chartjs-2';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SkillCheckbox = ({ skill, completed, onToggle }) => (
  <div className="flex items-center mb-2">
    <div 
      onClick={onToggle}
      className={`w-5 h-5 border-2 rounded mr-2 cursor-pointer ${completed ? 'bg-yellow-400 border-yellow-400' : 'border-gray-400'}`}
    >
      {completed && (
        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className={`${completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>{skill}</span>
  </div>
);

function Analyze() {
  const [highlightedSkill, setHighlightedSkill] = useState(null);
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const [skills, setSkills] = useState([]);
  const [skillsData, setSkillsData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Your Skills',
        data: [],
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        borderColor: 'rgba(251, 191, 36, 1)',
        pointBackgroundColor: 'rgba(251, 191, 36, 1)',
      },
      {
        label: 'Required Skills',
        data: [],
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
        borderColor: 'rgba(167, 139, 250, 1)',
        pointBackgroundColor: 'rgba(167, 139, 250, 1)',
      },
    ],
  });

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchRate, setMatchRate] = useState(0);
  const [marketFit, setMarketFit] = useState(0);
  const [skillsToImprove, setSkillsToImprove] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHighlightedSkill(skills[Math.floor(Math.random() * skills.length)]?.name);
    }, 2000);

    const animationId = setInterval(() => {
      setAnimatedNumber(prev => (prev + 1) % 101);
    }, 50);

    return () => {
      clearInterval(intervalId);
      clearInterval(animationId);
    };
  }, [skills]);

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('http://localhost:5001/skill-analyzer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data);

      const totalRequiredSkills = response.data.skills_required_in_job.length;
      const matchingSkillsCount = response.data.matching_skills.length;
      const newMatchRate = Math.round((matchingSkillsCount / totalRequiredSkills) * 100);
      setMatchRate(newMatchRate);

      // Set skills to improve
      const skillsToImproveCount = response.data.skills_to_improve.length;
      setSkillsToImprove(skillsToImproveCount);

      // Calculate market fit
      const newMarketFit = Math.round((matchingSkillsCount / (totalRequiredSkills)) * 100);
      setMarketFit(newMarketFit);

      setSkills(response.data.skills_to_improve.map((skill, index) => ({
        id: index + 1,
        name: skill,
        completed: false,
      })));

      setSkillsData({
        labels: response.data.skills_required_in_job,
        datasets: [
          {
            label: 'Your Skills',
            data: response.data.skills_required_in_job.map(skill => 
              response.data.skills_from_resume.includes(skill) ? 5 : 0
            ),
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            borderColor: 'rgba(251, 191, 36, 1)',
            pointBackgroundColor: 'rgba(251, 191, 36, 1)',
          },
          {
            label: 'Required Skills',
            data: response.data.skills_required_in_job.map(() => 5),
            backgroundColor: 'rgba(167, 139, 250, 0.2)',
            borderColor: 'rgba(167, 139, 250, 1)',
            pointBackgroundColor: 'rgba(167, 139, 250, 1)',
          },
        ],
      });

    } catch (error) {
      console.error('Error during analysis:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (id) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, completed: !skill.completed } : skill
    ));
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-r from-blue-900 via-violet-900 to-black'>
      <NavBar />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* File Upload Form */}
          <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
            <h2 className="text-5xl font-bold text-yellow-400 text-center mb-4 font-sans">Skill Analyzer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="resume" className="block text-yellow-400 mb-2">Upload Resume</label>
                <input type="file" id="resume" onChange={handleResumeChange} className="w-full p-2 rounded bg-gray-800 text-white" />
              </div>
              <div>
                <label htmlFor="jobDescription" className="block text-yellow-400 mb-2">Upload Job Description</label>
                <input type="file" id="jobDescription" onChange={handleJobDescriptionChange} className="w-full p-2 rounded bg-gray-800 text-white" />
              </div>
              <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors">
                {isLoading ? 'Analyzing...' : 'Analyze Skills'}
              </button>
            </form>
          </div>

          {/* Analysis Dashboard */}
          {analysisResult && (
            <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
              <h2 className="text-5xl font-bold text-yellow-400 text-center mb-4 font-sans">Analysis Dashboard</h2>
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">{animatedNumber}%</div>
                  <div className="text-yellow-400">Match Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">{analysisResult.skills_to_improve.length}</div>
                  <div className="text-yellow-400">Skills to Improve</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">
                    {Math.round((analysisResult.matching_skills.length / analysisResult.skills_required_in_job.length) * 100)}%
                  </div>
                  <div className="text-yellow-400">Market Fit</div>
                </div>
              </div>
            </div>
          )}

          <div className="md:flex space-x-8">
            <div className="md:w-2/3">
              {/* Skills Assessment Visualization */}
              <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
                <h3 className="text-3xl font-semibold text-yellow-400 mb-4 font-sans">Skills Assessment</h3>
                <div className="mb-6 bg-gray-900 p-6 rounded-xl" style={{ height: '300px' }}>
                  <Radar data={skillsData} options={{ maintainAspectRatio: false, scales: { r: { ticks: { beginAtZero: true, max: 5, stepSize: 1 }, angleLines: { color: 'rgba(255, 255, 255, 0.1)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } } }} />
                </div>
              </div>
              
              {/* Recommended Improvements */}
              <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
                <h3 className="text-3xl font-semibold text-yellow-400 mb-4 font-sans">Recommended Improvements</h3>
                <div className="mb-6 grid grid-cols-1 gap-4">
                  {skills.map((skill) => (
                    <div 
                      key={skill.id}
                      className={`p-4 rounded-xl flex items-center justify-between transition-all duration-300 transform hover:scale-105 
                        ${highlightedSkill === skill.name 
                          ? 'bg-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]' 
                          : 'bg-gray-800'}`}
                    >
                      <span className={`font-sans text-lg ${highlightedSkill === skill.name ? 'text-black' : 'text-gray-300'}`}>
                        {skill.name}
                      </span>
                      <a 
                        href="#" 
                        className={`inline-block ${skill.completed ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-sm font-bold py-2 px-4 rounded transition-colors duration-300`}
                      >
                        Resource
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              {/* Recent Applications */}
              <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
                <h3 className="text-3xl font-semibold text-yellow-400 mb-4 font-sans">Recent Applications</h3>
                <div className="mb-6 space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-300">Senior Developer at Tech Co.</span>
                      <span className="text-green-500">85% Match</span>
                    </div>
                    <p className="text-sm text-gray-400">Applied on: July 1, 2024</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-300">Full Stack Engineer at Startup Inc.</span>
                      <span className="text-yellow-500">70% Match</span>
                    </div>
                    <p className="text-sm text-gray-400">Applied on: June 15, 2024</p>
                  </div>
                </div>
              </div>

              {/* Skills Checklist */}
              <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
                <h3 className="text-3xl font-semibold text-yellow-400 mb-4 font-sans">Skills to Improve</h3>
                {skills.map((skill) => (
                  <SkillCheckbox 
                    key={skill.id}
                    skill={skill.name}
                    completed={skill.completed}
                    onToggle={() => toggleSkill(skill.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Career Progress Timeline */}
        <div className="mt-8 p-6 bg-black bg-opacity-50 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
          <h3 className="text-3xl font-semibold text-yellow-400 mb-8 font-sans text-center">Career Progress</h3>
          <VerticalTimeline layout="1-column" lineColor="rgba(251, 191, 36, 0.3)">
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: 'rgba(31, 41, 55, 0.8)', color: '#fff', boxShadow: '0 3px 0 #fbbf24', borderRadius: '15px' }}
              contentArrowStyle={{ borderRight: '7px solid rgba(31, 41, 55, 0.8)' }}
              date="2021 - present"
              iconStyle={{ background: '#fbbf24', color: '#1f2937' }}
              icon={<FaRocket />}
            >
              <h3 className="text-yellow-400 text-xl font-bold mb-1 font-sans">Senior Developer</h3>
              <h4 className="text-gray-300 font-sans">Tech Corp</h4>
              <p className="text-gray-400 font-sans">
                Led team in developing scalable web applications using React and Node.js
              </p>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: 'rgba(31, 41, 55, 0.8)', color: '#fff', boxShadow: '0 3px 0 #fbbf24', borderRadius: '15px' }}
              contentArrowStyle={{ borderRight: '7px solid rgba(31, 41, 55, 0.8)' }}
              date="2018 - 2021"
              iconStyle={{ background: '#fbbf24', color: '#1f2937' }}
              icon={<FaCode />}
            >
              <h3 className="text-yellow-400 text-xl font-bold mb-1 font-sans">Full Stack Developer</h3>
              <h4 className="text-gray-300 font-sans">Web Solutions Inc.</h4>
              <p className="text-gray-400 font-sans">
                Developed and maintained various client projects using MERN stack
              </p>
            </VerticalTimelineElement>
          </VerticalTimeline>
        </div>
      </div>
    </div>
  );
}


export default Analyze;

