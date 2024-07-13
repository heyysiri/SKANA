/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { SkillsVisualization } from './SkillsVisualization';
import { FaCode, FaRocket } from 'react-icons/fa';
import { Radar } from 'react-chartjs-2';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

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
      const newMatchRate = Math.round(((matchingSkillsCount + 1) / totalRequiredSkills) * 100);
      setMatchRate(newMatchRate);

      const skillsToImproveCount = response.data.skills_to_improve.length;
      setSkillsToImprove(skillsToImproveCount);

      const newMarketFit = Math.round(((skillsToImproveCount + 1) / totalRequiredSkills) * 100);
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center bg-gray-800 p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-6xl font-bold text-white mb-2">{matchRate}%</div>
                  <div className="text-yellow-400">Match Rate</div>
                </div>
                <div className="text-center bg-gray-800 p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-6xl font-bold text-white mb-2">{skillsToImprove}</div>
                  <div className="text-yellow-400">Skills to Improve</div>
                </div>
                <div className="text-center bg-gray-800 p-6 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-6xl font-bold text-white mb-2">{marketFit}%</div>
                  <div className="text-yellow-400">Market Fit</div>
                </div>
              </div>
              
              {/* Skills Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl">
                  <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Your Skills</h3>
                  <ul className="list-disc list-inside">
                    {analysisResult.skills_from_resume.map((skill, index) => (
                      <li key={index} className="text-white mb-2">{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                  <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Required Skills</h3>
                  <ul className="list-disc list-inside">
                    {analysisResult.skills_required_in_job.map((skill, index) => (
                      <li key={index} className="text-white mb-2">{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="md:flex space-x-8">
            <div className="md:w-2/3">
              {/* Skills Assessment Visualization */}
              {analysisResult && <SkillsVisualization analysisResult={analysisResult} />}
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
        
      </div>
    </div>
  );
}


export default Analyze;

