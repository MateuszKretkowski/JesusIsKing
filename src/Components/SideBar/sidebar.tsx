import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, animate, stagger } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithGoogle, signOutUser, auth, db } from "../config/config.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { isUserLoggedIn } from "../config/config.tsx";
import "./sidebar.css";
import { readUser } from "../config/config.tsx";
import { doc, getDoc } from "firebase/firestore";
import { getCookie, setCookie } from "../../utils/cookieUtils.ts";
import { get } from "http";
// import Settings from '../Settings/settings.js';
const defaultAvatar = require("../../Images/avatar.webp");

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    animate(".arrow", { rotate: isOpen ? 45 : -45 }, { duration: 0.2 });
    animate(".arrow2", { rotate: isOpen ? -45 : 45 }, { duration: 0.2 });
  });
  useEffect(() => {
    animate(
      ".sidebar",
      { width: isOpen ? 300 : 50 },
      {
        type: "linear",
        duration: 0.2,
      }
    );
  });
  useEffect(() => {
    animate(
      ".sidebar_container",
      { opacity: isOpen ? 1 : 0, width: 300 },
      {
        duration: 0.5,
        stagger: 2,
      }
    );
  });

  useEffect(() => {
    animate(
      ".App",
      { backgroundColor: isOpen ? "#000000B3" : "#f1f0ea" },
      {
        duration: 0.7,
      }
    );
  });

  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  });

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    description: "",
    from: "",
    link: "",
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, call readUser to fetch the user data.
        readUser(setUserData);
      } else {
        // No user is signed in, reset the user data.
        setUserData({
          id: "",
          name: "",
          description: "",
          from: "",
          link: "",
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const [isHomeOpen, setIsHomeOpened] = useState(false);
  const homeLocation = useLocation();
  useEffect(() => {
    if (homeLocation.pathname === "/") {
      setIsHomeOpened(true);
    } else {
      setIsHomeOpened(false);
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/settings") {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }
  });
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const currentUserEmail = user.email;
        const userRef = doc(db, "Users", currentUserEmail);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.uniqueId !== "DEFAULT" || getCookie("isRedirected") === "true"){
            console.log("Logged user:", userData.uniqueId);
          } else {
            console.log("Redirecting to /redirect");
            navigate("/redirect");
            setCookie("isRedirected", "true", 1);
          }
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("Użytkownik jest wylogowany");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db, navigate, setCookie]);

  const isRedirectedCookie = getCookie("isRedirected");
  return (
    <motion.div className="sidebar"
    style={{ opacity: isRedirectedCookie ? 0 : 1}}
    >
      <motion.div className="stripe" />
      <motion.div className="arrow" onClick={() => setIsOpen(!isOpen)} />
      <motion.div className="arrow arrow2" onClick={() => setIsOpen(!isOpen)} />
      <motion.div className="sidebar_container">
        <div className="account-wrapper">
          <div className="avatar-wrapper">
            <img className="avatar" src={defaultAvatar} />
          </div>
          <div className="desc-wrapper-account">
            <h2 className="name">{userData.name}</h2>
            <div className="link-wrapper">
              <h5 className="where white">{userData.link}</h5>
              <h5 className="where white">{userData.from}</h5>
            </div>
          </div>
        </div>
        <div className="login-wrapper">
          {isUserLoggedIn() ? (
            <Link to="/">
              <motion.button
                className="login_btn link"
                style={{ opacity: isHomeOpen ? 0 : 1 }}
                onClick={() => setIsOpen(!isOpen)}
              >
                HOME
              </motion.button>
            </Link>
          ) : null}
          {isUserLoggedIn() ? (
            <Link to="/blogs">
              <motion.button
                className="login_btn link"
                style={{ opacity: location.pathname === "/blogs" ? 0 : 1 }}
                onClick={() => setIsOpen(!isOpen)}
              >
                BLOGS
              </motion.button>
            </Link>
          ) : null}
          {isUserLoggedIn() ? (
            <Link to="/adminpanel">
              <motion.button
                className="login_btn link"
                style={{ opacity: location.pathname === "/adminpanel" ? 0 : 1 }}
                onClick={() => setIsOpen(!isOpen)}
              >
                ADMIN PANEL
              </motion.button>
            </Link>
          ) : null}
          {isUserLoggedIn() ? (
            <Link to={`/user`}>
              <motion.button
                className="login_btn link"
                style={{ opacity: isSettingsOpen ? 0 : 1 }}
                onClick={() => setIsOpen(!isOpen)}
              >
                PROFILE
              </motion.button>
            </Link>
          ) : (
            <h1></h1>
          )}

          {isUserLoggedIn() ? (
            <button className="login_btn" onClick={signOutUser}>
              SIGN OUT
            </button>
          ) : (
            <button className="login_btn" onClick={signInWithGoogle}>
              SIGN IN WITH GOOGLE
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SideBar;
