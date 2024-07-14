/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { SkillsVisualization } from './SkillsVisualization';
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
  const [loadingSkills, setLoadingSkills] = useState({});

  useEffect(() => {
    // Load saved data from local storage
    const savedAnalysisResult = localStorage.getItem('analysisResult');
    const savedSkills = localStorage.getItem('skills');
    const savedSkillsData = localStorage.getItem('skillsData');
    const savedMatchRate = localStorage.getItem('matchRate');
    const savedMarketFit = localStorage.getItem('marketFit');
    const savedSkillsToImprove = localStorage.getItem('skillsToImprove');
  
    if (savedAnalysisResult) {
      setAnalysisResult(JSON.parse(savedAnalysisResult));
      setSkills(JSON.parse(savedSkills));
      setSkillsData(JSON.parse(savedSkillsData));
      setMatchRate(JSON.parse(savedMatchRate));
      setMarketFit(JSON.parse(savedMarketFit));
      setSkillsToImprove(JSON.parse(savedSkillsToImprove));
    }
  }, []); // This effect runs only once on component mount
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setHighlightedSkill(prevSkill => {
        const newSkill = skills[Math.floor(Math.random() * skills.length)]?.name;
        return newSkill !== prevSkill ? newSkill : prevSkill;
      });
    }, 2000);
  
    return () => clearInterval(intervalId);
  }, [skills]); // This effect depends on skills, but won't cause unnecessary re-renders
  
  useEffect(() => {
    const animationId = setInterval(() => {
      setAnimatedNumber(prev => (prev + 1) % 101);
    }, 50);
  
    return () => clearInterval(animationId);
  }, []); // This effect runs independently of other state

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
      const response = await axios.post('https://skana.onrender.com/skill-analyzer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAnalysisResult = response.data;
      setAnalysisResult(newAnalysisResult);

      const totalRequiredSkills = newAnalysisResult.skills_required_in_job.length;
      const matchingSkillsCount = newAnalysisResult.matching_skills.length;
      const newMatchRate = Math.round(((matchingSkillsCount + 1) / totalRequiredSkills) * 100);
      setMatchRate(newMatchRate);

      const skillsToImproveCount = newAnalysisResult.skills_to_improve.length;
      setSkillsToImprove(skillsToImproveCount);

      const newMarketFit = Math.round(((skillsToImproveCount + 1) / totalRequiredSkills) * 100);
      setMarketFit(newMarketFit);

      const newSkills = newAnalysisResult.skills_to_improve.map((skill, index) => ({
        id: index + 1,
        name: skill,
        completed: false,
      }));
      setSkills(newSkills);

      const newSkillsData = {
        labels: newAnalysisResult.skills_required_in_job,
        datasets: [
          {
            label: 'Your Skills',
            data: newAnalysisResult.skills_required_in_job.map(skill => 
              newAnalysisResult.skills_from_resume.includes(skill) ? 5 : 0
            ),
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            borderColor: 'rgba(251, 191, 36, 1)',
            pointBackgroundColor: 'rgba(251, 191, 36, 1)',
          },
          {
            label: 'Required Skills',
            data: newAnalysisResult.skills_required_in_job.map(() => 5),
            backgroundColor: 'rgba(167, 139, 250, 0.2)',
            borderColor: 'rgba(167, 139, 250, 1)',
            pointBackgroundColor: 'rgba(167, 139, 250, 1)',
          },
        ],
      };
      setSkillsData(newSkillsData);

      // Save data to local storage
      localStorage.setItem('analysisResult', JSON.stringify(newAnalysisResult));
      localStorage.setItem('skills', JSON.stringify(newSkills));
      localStorage.setItem('skillsData', JSON.stringify(newSkillsData));
      localStorage.setItem('matchRate', JSON.stringify(newMatchRate));
      localStorage.setItem('marketFit', JSON.stringify(newMarketFit));
      localStorage.setItem('skillsToImprove', JSON.stringify(skillsToImproveCount));

    } catch (error) {
      console.error('Error during analysis:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (id) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id ? { ...skill, completed: !skill.completed } : skill
    );
    setSkills(updatedSkills);
    localStorage.setItem('skills', JSON.stringify(updatedSkills));
  };

  const sendSkillToBackend = async (e, skillName) => {
    e.preventDefault();
    console.log('Sending skill:', skillName);
    setLoadingSkills(prev => ({ ...prev, [skillName]: true }));
    try {
      const response = await axios.post('https://skana.onrender.com/recommend_course', 
        { resource: skillName },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Received from backend:', response.data);
      if (response.data.recommendation) {
        window.open(response.data.recommendation, '_blank');
      } else {
        console.error('No recommendation received');
      }
    } catch (error) {
      console.error('Error sending skill:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    } finally {
      setLoadingSkills(prev => ({ ...prev, [skillName]: false }));
    }
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
                      <button 
                        onClick={(e) => sendSkillToBackend(e, skill.name)}
                        className={`inline-block ${skill.completed ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-sm font-bold py-2 px4 rounded transition-colors duration-300 cursor-pointer`}
                        disabled={loadingSkills[skill.name]}
                      >
                        {loadingSkills[skill.name] ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : 'resource'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Skills Checklist and Estimated Study Time */}
            <div className="md:w-1/3">
              <div className="mb-8 bg-black bg-opacity-50 p-6 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-3 font-sans">Skills to Improve</h3>
                <div className="max-h-60 overflow-y-auto">
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

              {/* Estimated Study Time */}
              <div className="mb-8 bg-black bg-opacity-50 p-6 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-3 font-sans">Estimated Study Time</h3>
                <p className="text-white text-lg">
                  Total time to master all skills: 
                </p>
                <p className="text-yellow-400 text-3xl font-bold mt-2">
                  ~{skills.length * 10} hours
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  (Assuming an average of 10 hours per skill)
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Analyze;