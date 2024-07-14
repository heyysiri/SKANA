/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

const colorMap = {
  your: ['#fbbf24', '#f59e0b'],
  required: ['#a78bfa', '#8b5cf6'],
  matching: ['#34d399', '#10b981'],
  improve: ['#f87171', '#ef4444']
};

const SkillArc = ({ skill, index, total, radius, type, animate, rotation }) => {
  const arcRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (animate && arcRef.current && textRef.current) {
      arcRef.current.style.transition = 'stroke-dashoffset 1s ease-in-out';
      textRef.current.style.transition = 'opacity 1s ease-in-out';
      setTimeout(() => {
        arcRef.current.style.strokeDashoffset = '0';
        textRef.current.style.opacity = '1';
      }, 100 * index);
    }
  }, [animate, index]);

  const angleStep = (2 * Math.PI) / total;
  const startAngle = index * angleStep + rotation;
  const endAngle = (index + 1) * angleStep + rotation;
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  const startX = 200 + radius * Math.cos(startAngle);
  const startY = 200 + radius * Math.sin(startAngle);
  const endX = 200 + radius * Math.cos(endAngle);
  const endY = 200 + radius * Math.sin(endAngle);

  const [gradientStart, gradientEnd] = colorMap[type];

  // Truncate long skill names
  const truncatedSkill = skill.length > 15 ? skill.slice(0, 12) + '...' : skill;

  return (
    <g>
      <defs>
        <linearGradient id={`gradient-${type}-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>
      </defs>
      <path
        ref={arcRef}
        d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
        fill="none"
        stroke={`url(#gradient-${type}-${index})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={radius * angleStep}
        strokeDashoffset={animate ? radius * angleStep : 0}
      />
      <text
        ref={textRef}
        x={200 + (radius + 15) * Math.cos((startAngle + endAngle) / 2)}
        y={200 + (radius + 15) * Math.sin((startAngle + endAngle) / 2)}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="white"
        fontSize="10"
        opacity={animate ? 0 : 1}
        transform={`rotate(${((startAngle + endAngle) / 2 * 180 / Math.PI) + 90}, 
                    ${200 + (radius + 15) * Math.cos((startAngle + endAngle) / 2)}, 
                    ${200 + (radius + 15) * Math.sin((startAngle + endAngle) / 2)})`}
      >
        {truncatedSkill}
      </text>
    </g>
  );
};

export function SkillsVisualization({ analysisResult }) {
  const [animate, setAnimate] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;
      setRotation((prevRotation) => prevRotation + (deltaX + deltaY) * 0.01);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!analysisResult) return null;

  const { skills_from_resume, skills_required_in_job, matching_skills, skills_to_improve } = analysisResult;

  return (
    <div className="mb-8 bg-black bg-opacity-50 p-8 rounded-3xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
      <h3 className="text-3xl font-semibold text-yellow-400 mb-4 font-sans">Skills Visualization</h3>
      <div className="w-full flex justify-center">
        <svg 
          width="450" 
          height="450" 
          viewBox="0 0 400 400"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <circle cx="200" cy="200" r="190" fill="none" stroke="#ffffff10" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#ffffff10" strokeWidth="1" />
          <circle cx="200" cy="200" r="90" fill="none" stroke="#ffffff10" strokeWidth="1" />
          {skills_from_resume.map((skill, index) => (
            <SkillArc 
              key={skill} 
              skill={skill} 
              index={index} 
              total={skills_from_resume.length} 
              radius={180} 
              type={matching_skills.includes(skill) ? 'matching' : 'your'}
              animate={animate}
              rotation={rotation}
            />
          ))}
          {skills_required_in_job.map((skill, index) => (
            <SkillArc 
              key={skill} 
              skill={skill} 
              index={index} 
              total={skills_required_in_job.length} 
              radius={130} 
              type='required'
              animate={animate}
              rotation={rotation}
            />
          ))}
          {skills_to_improve.map((skill, index) => (
            <SkillArc 
              key={skill} 
              skill={skill} 
              index={index} 
              total={skills_to_improve.length} 
              radius={80} 
              type='improve'
              animate={animate}
              rotation={rotation}
            />
          ))}
          <circle cx="200" cy="200" r="60" fill="#00000080" />
          <text x="200" y="190" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Skills</text>
          <text x="200" y="210" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Overview</text>
        </svg>
      </div>
      <div className="flex justify-center mt-6 space-x-6">
        {Object.entries(colorMap).map(([key, [color]]) => (
          <div key={key} className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{background: `linear-gradient(to right, ${color}, ${colorMap[key][1]})`}}></div>
            <span className="text-white capitalize">{key.replace('_', ' ')} Skills</span>
          </div>
        ))}
      </div>
    </div>
  );
}