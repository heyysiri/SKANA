/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import SignUp from './Components/SignUp.jsx';
import Analyze from './Components/Analyze.jsx';
import Profile from './Components/Profile.jsx';
import SignIn from './Components/SignIn.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Analyze" element={<Analyze />} />
      <Route path="/Profile" element={<Profile />} />
      {/* <Route path="/SignIn" element={<SignIn />} /> */}
    </Routes>
  </Router>,
  document.getElementById('root')
);
