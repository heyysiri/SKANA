/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import profileImg from '../assets/image.png';
import { getAuthenticated, setAuthenticated } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function AccountSidebar({ isOpen, onClose, profileImage, setProfileImage }) {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptField, setPromptField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const fileInputRef = useRef(null);
  const navi = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
    if (field === 'password') {
      setPassword(actualPassword);
    }
  };

  const handleSave = () => {
    if (editingField === 'email' || editingField === 'password') {
      setPromptField(editingField);
      setNewValue(editingField === 'password' ? password : eval(editingField));
      setShowPrompt(true);
    } else {
      setEditingField(null);
    }
  };

  const handleConfirm = () => {
    updateUserData();
    setShowPrompt(false);
    setEditingField(null);
    setPromptField(null);
    setNewValue('');
  };
  const updateUserData = () => {
    const updatedUserData = { ...userData, [editingField]: newValue };
    setUserData(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    setEditingField(null);
  };

  const handleCancel = () => {
    if (editingField === 'password') {
      setPassword(maskedPassword);
    }
    setShowPrompt(false);
    setEditingField(null);
    setPromptField(null);
    setNewValue('');
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSignOut = () => {
    setAuthenticated(false);
    localStorage.removeItem('user');
    console.log("Signed out. New auth status:", getAuthenticated());
    onClose();
    navigate('/');
  }
   
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
            <div className={`relative w-40 h-40 mx-auto mb-6 transition-all duration-500 ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <img src={profileImg || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg" />
              <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 cursor-pointer hover:bg-yellow-300 transition-colors duration-200" onClick={handleProfileImageClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="space-y-4">
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
</p> )}
                  </div>
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