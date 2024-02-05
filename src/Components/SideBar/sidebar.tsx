import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, animate, stagger } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { signInWithGoogle, signOutUser, isUserLoggedIn, } from "../Google Signin/config.tsx";
import "./sidebar.css";
// import Settings from '../Settings/settings.js';
const defaultAvatar = require("../../Images/avatar.webp");

function SideBar() {

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    animate(".arrow", { rotate: isOpen ? 90 : 0 }, { duration: 0.2 });
    
  });
  useEffect(() => {
    animate(".sidebar", { width: isOpen ? 300 : 50 },       {
      type: "linear",
      duration: 0.2,
    });
  })
  useEffect(() => {
    animate(".sidebar_container", { opacity: isOpen ? 1 : 0, width: 300 },       {
      duration: 0.5,
      stagger: 2
    });
  })
  
  useEffect(() => {
  animate(".App", { backgroundColor: isOpen ? "#000000B3" : "#f1f0ea" },{
    duration: 0.7,
  });
})

useEffect(() => {
  isOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset';
})

const [ isSettingsOpen, setIsSettingsOpen ] = useState(false)
const location = useLocation();
useEffect(() => {
  if (location.pathname === '/settings') {
    setIsSettingsOpen(true)
  }
  else {
    setIsSettingsOpen(false)
  }
})

  return (
    <motion.div className="sidebar">
      <motion.div className="stripe" />
      <motion.div className="arrow" onClick={() => setIsOpen(!isOpen)} />
        <motion.div className="sidebar_container">
          <div className="account-wrapper">
            <div className="avatar-wrapper">
              <img className="avatar"  src={defaultAvatar} />
            </div>
            {isUserLoggedIn ?
            <div className="desc-wrapper-account">
              <h2 className="name"></h2>
              <h2 className="name desc"></h2>
              <h2 className="name from"></h2>
            </div>
            :
            <h1>Siema</h1>
            }
          </div>
          <div className="login-wrapper">
            {isUserLoggedIn() ? (
    isSettingsOpen ? (
      <Link to="/">
        <motion.button className="login_btn link" onClick={() => setIsOpen(!isOpen)}>HOME</motion.button>
      </Link>
    ) : (
      <Link to="/settings">
        <motion.button className="login_btn link" onClick={() => setIsOpen(!isOpen)}>PROFILE</motion.button>
      </Link>
    )
  ) : (
    <h1></h1>
  )}
          {isUserLoggedIn() ?
          <button onClick={signOutUser} >SIGN OUT</button>
          :
          <button onClick={signInWithGoogle} >SIGN IN WITH GOOGLE</button>
          }
          </div>
          
        </motion.div>
      </motion.div>
  );
}

export default SideBar;
