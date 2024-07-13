/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileImg from '../assets/image.png';
import AccountSidebar from './AccountSidebar';

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    setDropdownOpen(false);
  };

  const openProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black h-32">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* <img src={Logo} className="h-16 w-20" alt="Skana Logo" /> */}
        </a>
        <div className="flex items-center space-x-3 rtl:space-x-reverse ml-auto">
          <ul className="flex flex-row items-center space-x-8 text-white">
            <li className="relative group">
              <Link to="/" className="py-2 px-3 text-4xl font-mono">
                Home
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-500 group-hover:w-full"></span>
            </li>
            <li className="relative group">
              <Link to="/analyze" className="py-2 px-3 text-4xl font-mono">
                Analyze
              </Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-500 group-hover:w-full"></span>
            </li>
          </ul>
          <div className="relative">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={dropdownOpen}
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src={profileImg} alt="user photo" />
            </button>
            {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">SiriK</span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">siri@gmail.com</span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    onClick={openSidebar}
                  >
                    Account
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    onClick={openProfile}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                </li>
              </ul>
            </div>
            )}
          </div>
        </div>
      </div>
      <AccountSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </nav>
  );
}

export default NavBar;