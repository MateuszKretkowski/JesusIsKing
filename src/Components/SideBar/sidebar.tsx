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
    animate(
      ".arrow",
      {
        rotate: isOpen ? -45 : isMobile ? 0 : 45,
        top: isMobile ? "2%" : "50%",
        left: "90%",
        margin: isOpen ? "0px 0px" : "0px 16px",
      },
      { duration: 0.2 }
    );
    animate(
      ".arrow2",
      {
        rotate: isOpen ? 45 : isMobile ? 0 : -45,
        top: isMobile ? (isOpen ? "2%" : "3%") : "51.6%",
        width: isMobile ? (isOpen ? "24px" : "16px") : "24px",
        left: "90%",
        margin: isOpen ? "0px 0px" : "0px 16px",
      },
      { duration: 0.2 }
    );
  });

  // useEffect(() => {
  //   animate(".mobileArrow", { rotate: isOpen ? 45 : -45 }, { duration: 0.2 });
  //   animate(".mobileArrow2", { rotate: isOpen ? -45 : 45 }, { duration: 0.2 });
  //   animate(".mobileArrow3", { rotate: isOpen ? -45 : 45 }, { duration: 0.2 });
  // });

  const [isMobile, setIsMobile] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  useEffect(() => {
    if (getCookie("isMobile") == "true") {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  });
  useEffect(() => {
    animate(
      ".sidebar",
      { width: isOpen ? (isMobile ? "100vw" : isNotificationsOpen ? 640 : 320) : isMobile ? 0 : 50 },
      {
        type: "spring",
        duration: 0.2,
      }
    );
  });
  useEffect(() => {
    animate(
      ".sidebar_container",
      { width: isNotificationsOpen ? "50%" : "100%", opacity: isOpen ? 1 : 0  },
      {
        duration: 0.5,
        stagger: 2,
      }
    );
  });
  useEffect(() => {
    animate(
      ".notifications_container",
      { width: isNotificationsOpen ? "50%" : "0%", opacity: isOpen ? isNotificationsOpen ? 1 : 0 : 0 },
      {
        type: "spring",
        duration: 0.2,
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
    uniqueId: "",
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        readUser(setUserData);
      } else {
        setUserData({
          id: "",
          name: "",
          description: "",
          from: "",
          link: "",
          uniqueId: "",
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
    if (location.pathname === `/user/${userData.uniqueId}}`) {
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
          if (
            userData.uniqueId !== "DEFAULT" ||
            getCookie("isRedirected") === "true"
          ) {
            console.log("Logged user:", userData.uniqueId);
          } else {
            navigate("/redirect");
            setCookie("isRedirected", "true", 1);
          }
        } else {
        }
      } else {
        console.log("Użytkownik jest wylogowany");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db, navigate, setCookie]);

  const getUserUniqueId = async () => {
    const user = auth.currentUser;
    if (user && user.email) {
      const currentUserEmail = user.email;
      const userRef = doc(db, "Users", currentUserEmail);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
      } else {
      }
    }
  };

  const isRedirectedCookie = getCookie("isRedirected");
  return (
    <motion.div
      className="sidebar"
      style={{ opacity: isRedirectedCookie ? 0 : 1 }}
    >

      {isMobile ? null : <motion.div className="stripe" />}
      <div>
        <motion.div className="arrow" onClick={() => setIsOpen(!isOpen)} />
        <motion.div
          className="arrow arrow2"
          onClick={() => setIsOpen(!isOpen)}
          />
      </div>
      <motion.div className="notifications_container">
        <h3>REPLIES</h3>
        <h3>LIKES</h3>
      </motion.div>
      <motion.div className="sidebar_container">
        <div className="account-wrapper">
          <div className="avatar-wrapper">
            <img className="avatar" src={defaultAvatar} />
          </div>
          <div className="desc-wrapper-account">
            <h2 className="name">{userData.name}</h2>
            <h2 className="id">@{userData.uniqueId}</h2>
            <div className="link-wrapper">
              <h5 className="where white" style={{ opacity: isNotificationsOpen ? "0" : "1", height: isNotificationsOpen ? "0px" : "12px" }}>{userData.link}</h5>
              <h5 className="where white" style={{ opacity: isNotificationsOpen ? "0" : "1", height: isNotificationsOpen ? "0px" : "12px  " }}>{userData.from}</h5>
            </div>
            <div className="notifications_trigger">
                           <motion.button
                className="login_btn link"
                style={{ marginBottom: isNotificationsOpen ? "16px" : "0px"}}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                NOTIFICATIONS
              </motion.button>
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
            <Link to={`/user/${userData.uniqueId}`}>
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
