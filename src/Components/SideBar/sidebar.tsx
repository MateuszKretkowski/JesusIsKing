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
import Notif from "./Notif.tsx";
import ProfilePicture from "../Forum/ProfilePicture.tsx";
// import Settings from '../Settings/settings.js';
const defaultAvatar = require("../../Images/avatar.webp");

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const [ToggleSearch, setToggleSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (event: any) => {
    setSearchInput(event.target.value);
    console.log(searchInput);
  };

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
      {
        width: isOpen
          ? isMobile
            ? "100vw"
            : 320
          : isMobile
          ? 0
          : 50,
      },
      {
        type: "spring",
        duration: 0.2,
      }
    );
  });
  useEffect(() => {
    animate(
      ".sidebar_container",
      {
        width: isNotificationsOpen ? (isMobile ? "0%" : "0%") : "100%",
        opacity: isOpen ? 1 : 0,
        opacity: isNotificationsOpen
          ? isMobile
            ? "0"
            : "0"
          : isOpen
          ? "1"
          : "0",
        padding: isNotificationsOpen
          ? isMobile
            ? "0px"
            : "0%"
          : "24% 10%",
      },
      {
        duration: 0.5,
        stagger: 2,
      }
    );
  });
  useEffect(() => {
    animate(
      ".notifications_container",
      {
        width: isNotificationsOpen ? (isMobile ? "100%" : "100%") : "0%",
        opacity: isOpen ? (isNotificationsOpen ? 1 : 0) : 0,
      },
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
    notifications: {
      likes: {},
      replies: {},
    },
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
          notifications: {
            likes: {},
            replies: {},
          },
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


  useEffect(() => {
    console.log(userData, "USER DATA");
  }, [userData])

  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

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
      <motion.div
        className="notifications_container"
        style={{ padding: isNotificationsOpen ? "8n% 10% 12% 10%" : "0px" }}
      >
        <motion.h1 className="notifs_title">NOTIFICATIONS</motion.h1>
        <motion.div className="notifs_action"
        style={{ height: "100%" }}
        >
          <motion.div className="notif-wrapper"
          style={{ height: isLikesOpen ? "100%" : "6%" }}
          >
            <motion.button
              className="notif_btn"
              style={{
                opacity: isNotificationsOpen ? (isRepliesOpen ? 0 : 1) : 0,
              }}
              onClick={() => {
                setIsLikesOpen(!isLikesOpen);
              }}
            >
              LIKES
            </motion.button>
            <motion.div className="notif_likes">
            {userData.notifications.likes && isLikesOpen &&
                Object.values(userData.notifications.likes).map((like: any) => (
                  <div key={like.id}>
                    <Notif
                      id={like}
                      isReply={false} />
                  </div>
                ))}
            </motion.div>
          </motion.div>
          <motion.div className="notif-wrapper"
          style={{ height: isRepliesOpen ? "100%" : "6%" }}
          >
            <motion.button
              className="notif_btn"
              style={{
                opacity: isNotificationsOpen ? (isLikesOpen ? 0 : 1) : 0,
              }}
              onClick={() => {
                setIsRepliesOpen(!isRepliesOpen);
              }}
            >
              REPLIES
            </motion.button>
            <motion.div className="notif_likes">
              {userData.notifications.replies && isRepliesOpen &&
                Object.values(userData.notifications.replies).slice(0, 1).map((reply: any) => (
                  <div key={reply.id}>
                    <Notif
                      id={reply}
                      isReply={true} />
                  </div>
                ))}
            </motion.div>
          </motion.div>
        </motion.div>
          <motion.div className="notif_action-wrapper">
            <motion.button
              className="login_btn link"
              style={{ opacity: isNotificationsOpen ? 1 : 0 }}
              onClick={() => setIsNotificationsOpen(!setIsNotificationsOpen)}
            >
              CLOSE NOTIFICATIONS
            </motion.button>
          </motion.div>
      </motion.div>
      <motion.div className="sidebar_container"
      style={{ padding: isNotificationsOpen ? "0%" : "0%" }}
      >
        <div className="account-wrapper">
          <div className="avatar-wrapper">
            <ProfilePicture email={auth?.currentUser?.email} isAbleToChange={false} classname="avatar_sidebar" />
          </div>
          <div className="desc-wrapper-account">
            <h2 className="name">{userData.name}</h2>
            <h2 className="id">@{userData.uniqueId}</h2>
            <div className="link-wrapper">
              <h5
                className="where white"
                style={{
                  opacity: isNotificationsOpen ? "0" : "1",
                  height: isNotificationsOpen ? "0px" : "12px",
                }}
              >
                {userData.link}
              </h5>
              <h5
                className="where white"
                style={{
                  opacity: isNotificationsOpen ? "0" : "1",
                  height: isNotificationsOpen ? "0px" : "12px  ",
                }}
              >
                {userData.from}
              </h5>
            </div>
            <div className="notifications_trigger">
              <motion.button
                className="login_btn link"
                style={{ marginBottom: isNotificationsOpen ? "16px" : "0px" }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                NOTIFICATIONS
              </motion.button>
            </div>
          </div>
        </div>
        <div className="login-wrapper">
        {isUserLoggedIn() ? (
            <div className="search-wrapper">
              <motion.input className="search_input" style={{ opacity: ToggleSearch ? 1 : 0 }} value={searchInput} onChange={handleChange} placeholder="USER'S @" />
              <motion.button
                className="login_btn link"
                onClick={() => {setToggleSearch(!ToggleSearch); if (searchInput != "") {navigate(`/user/${searchInput}`); setSearchInput("");}}}
              >
                SEARCH
              </motion.button>
            </div>
          ) : null}
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
