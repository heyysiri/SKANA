/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getAuthenticated, setAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCode } from 'react-icons/fa';

function AccountSidebar({ isOpen, onClose }) {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptField, setPromptField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = (field) => {
    if (field !== 'email') {
      setEditingField(field);
      setNewValue(field === 'password' ? '' : userData[field]);
    }
  };

  const handleSave = () => {
    setPromptField(editingField);
    setShowPrompt(true);
  };

  const updateUserData = async () => {
    try {
      const response = await axios.put('https://skana.onrender.com/api/user/update', {
        email: userData.email,
        field: editingField,
        value: newValue
      });
  
      if (response.status === 200) {
        const updatedUserData = { ...userData, [editingField]: newValue };
        setUserData(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setEditingField(null);
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleConfirm = () => {
    updateUserData();
    setShowPrompt(false);
    setPromptField(null);
    setNewValue('');
  };

  const handleCancel = () => {
    setShowPrompt(false);
    setEditingField(null);
    setPromptField(null);
    setNewValue('');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSignOut = () => {
    onClose();
    setAuthenticated(false);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setUserData(null);
    console.log("Signed out. New auth status:", getAuthenticated());
    navigate('/');
  };
   
  if (!userData) return null;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOverlayClick}
        ></div>
      )}
      <div className={`fixed left-0 top-0 h-full w-2/5 bg-gradient-to-br from-black to-violet-900 backdrop-filter backdrop-blur-lg shadow-lg overflow-y-auto text-white transition-all duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-8">
            {/* Profile Box */}
            <div className="bg-black bg-opacity-50 rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-yellow-500/30 hover:border-yellow-500 backdrop-blur-sm">
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 via-violet-500 to-blue-700 flex items-center justify-center shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <span className="text-7xl font-extrabold text-white relative z-10 font-sans tracking-wider">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-yellow-400 rounded-full p-3 shadow-lg transform rotate-12 transition-transform duration-300 hover:rotate-0">
                  <FaCode className="text-black" size={24} />
                </div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-300 rounded-full opacity-50 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              {['name', 'email', 'password'].map((field, index) => (
                <div key={field} className={`bg-white/20 rounded-lg p-3 flex items-center justify-between backdrop-filter backdrop-blur-sm transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} style={{transitionDelay: `${(index + 1) * 100}ms`}}>
                  <div className="flex-grow">
                    <label className="block text-xs font-medium text-gray-200 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {editingField === field ? (
                      <input
                        type={field === 'password' ? 'password' : 'text'}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="bg-transparent border-b border-gray-300 text-white text-sm focus:outline-none focus:border-yellow-400 w-full"
                      />
                    ) : (
                      <p className="text-sm">
                        {field === 'password' ? '********' : userData[field]}
                      </p>
                    )}
                  </div>
                  {field !== 'email' && (
                    <>
                      {editingField === field ? (
                        <button onClick={handleSave} className="text-yellow-400 hover:text-yellow-300 ml-2 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(field)} className="text-yellow-400 hover:text-yellow-300 ml-2 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div className={`pt-6 transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '400ms'}}>
                <button onClick={handleSignOut} className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg hover:from-red-600/90 hover:to-pink-600/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-black to-violet-900 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-xl font-bold mb-4">Confirm Change</h2>
            <p className="mb-6">Are you sure you want to change your {promptField}?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200">
                Cancel
              </button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountSidebar;
