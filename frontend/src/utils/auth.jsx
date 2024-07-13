// auth.js or auth.jsx

export const setAuthenticated = (status) => {
    console.log("Setting authentication status to:", status);
    localStorage.setItem('isAuthenticated', status.toString());
  };
  
  export const getAuthenticated = () => {
    const status = localStorage.getItem('isAuthenticated') === 'true';
    console.log("Getting authentication status:", status);
    return status;
  };