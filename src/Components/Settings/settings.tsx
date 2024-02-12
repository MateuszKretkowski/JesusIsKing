import React, { useState, useEffect } from "react";
import "./settings.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
} from "framer-motion";
import Modal from "./Modal.tsx";
import handleSubmit from "./Modal.tsx";
import { isUserLoggedIn, readUser, auth } from "../Google Signin/config.tsx";
import { onAuthStateChanged } from "firebase/auth";
const defaultAvatar = require("../../Images/avatar.webp");

function Settings() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const controls = useAnimation();
  useEffect(() => {
    showModal ? controls.start("hidden") : controls.start("visible");
  });

  const even = {
    hidden: { x: -200, opacity: 0, scale: 1,},
    visible: { x: 0, opacity: 1, scale: 1,},
    exit: { x: -200, opacity: 0, scale: 1,},
  };

  const odd = {
    hidden: { x: 200, opacity: 0, scale: 1,},
    visible: { x: 0, opacity: 1, scale: 1,},
    exit: { x: 200, opacity: 0, scale: 1,},
  };

  const variantsDescription = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  };

  const variantsAction = {
    hidden: { opacity: 0, scale: 0, y: 100 },
    visible: { opacity: 1, scale: 1 , y: 0},
    exit: { opacity: 0, scale: 0, y: 100 },
  };

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
  

  function wrapWordsAndLettersInSpan(name: string): JSX.Element[] {
    const words = name.split(" ");

    return words.map((word, wordIndex) => (
      <motion.div 
      key={`word-${wordIndex}`} 
        data-value={wordIndex}
        className="title-settings"
        >
        {word.split("").map((letter, letterIndex) => (
          <motion.h1
            key={letterIndex}
            data-value={letterIndex}
            variants={wordIndex % 2 == 0 ? even : odd}
            initial={controls}
            animate={controls}
            exit={controls}
            transition={
              wordIndex == 1 ? 
              {delay: 0.05 * letterIndex, type: "spring", bounce: 1, damping: 10}
              : 
              {delay: 0.05 * (word.length - letterIndex - 1), type: "spring", bounce: 1, damping: 10,} 
              
            }
          >
            {letter}
          </motion.h1>
        ))}
      </motion.div>
    ));
  }

  const nameMAPPED = wrapWordsAndLettersInSpan(userData.name);

  return (
    <div className="settings">
      <div className="settings_container">
        <div className="account-wrapper-settings">
          <motion.div
            className="avatar-wrapper-settings"
            variants={variantsAction}
            initial={controls}
            exit={controls}
          >
            <img className="avatar-settings" src={defaultAvatar} />
          </motion.div>
          <div className="desc-wrapper-account-settings">
            <motion.div
              className="title-settings-wrapper"
            >
              {nameMAPPED}
            </motion.div>
            <motion.h2
              className=""
              variants={variantsDescription}
              initial={controls}
              animate={controls}
              exit={controls}
              transition={{type: "spring", bounce: 1, damping: 12}}
            >
              {userData.description}
            </motion.h2>
            <div className="links-wrapper">
              <motion.a
                className="desc link-settings"
                variants={variantsAction}
                initial={controls}
                animate={controls}
                exit={controls}
              >
                <h5 className="where">{userData.link}</h5>
              </motion.a>
              <motion.a
                className="desc link-settings"
                variants={variantsAction}
                initial={controls}
                animate={controls}
                exit={controls}
              >
                <h5 className="where">MESSAGE</h5>
              </motion.a>
              <motion.a
                className="desc link-settings"
                variants={variantsAction}
                initial={controls}
                animate={controls}
                exit={controls}
              >
                <motion.h5 className="where">{userData.from}</motion.h5>
              </motion.a>
            </div>
            <div className="helper-edit-wrapper">
            <motion.button
              className="action-wrapper settings_action-wrapper"
              onClick={() => setShowModal(!showModal)}
              style={{ opacity: showModal ? 0 : 1}}
            >
              <h5 className="edit">EDIT YOUR ACCOUNT</h5>
            </motion.button>
          </div>
          </div>
        </div>
        <Modal showModal={showModal} setShowModal={setShowModal} />
          <motion.button
          className="action-wrapper settings_action-wrapper"
          variants={variantsDescription}
          initial={controls}
          animate={controls}
          exit={controls}
          transition={{delay: 1}}
          >
          <h5 className="edit">OPEN POSTS</h5>
        </motion.button>
      </div>
    </div>
  );
}

export default Settings;
