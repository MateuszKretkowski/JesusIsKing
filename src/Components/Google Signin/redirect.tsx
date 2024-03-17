import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { app, auth, checkIfUserExistsById, db } from "../config/config.tsx";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookieUtils.ts";
import "./redirect.css";
import { unsubscribe } from "diagnostics_channel";
import { onAuthStateChanged } from "firebase/auth";

function Redirect() {
  const functions = getFunctions();
  const [userId, setUserId] = useState("");
  const [userIdExists, setUserIdExists] = useState(false);
  useEffect(() => {
    if (userId) {
      checkIfUserExistsById(userId).then((exists) => {
        setUserIdExists(exists);
      });
    }
  }, [userId]);

  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!userIdExists && userId.length > 2) {
      const currentUserEmail = auth.currentUser ? auth.currentUser.email : null;
      if (currentUserEmail) {
        const q = query(
          collection(db, "Users"),
          where("uniqueId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
          const userRef = doc(db, "Users", currentUserEmail);
          alert("Your uniqueId has been updated");
          deleteCookie("isRedirected");
          if (auth.currentUser) {
          const userEmail = auth.currentUser.email;
          setCookie("email", userEmail, 100000000000000000000000000);
        }
          navigate("/");
          return updateDoc(userRef, { uniqueId: userId });
        } else {
          alert("This Id is already taken");
        }
      } else {
        console.error("updateUserUniqueId does not exist or is too short");
      }
    }
  };

  const handleChange = (event: any) => {
    const { value } = event.target;
    setUserId(value);

    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <motion.div className="redirect">
      <motion.div className="redirect_container">
        <motion.div
          className="redirect_input-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          <motion.input
            type="text"
            name="id"
            className="redirect-input"
            maxlength="15"
            minlength="10"
            placeholder="WRITE YOUR @ HERE"
            value={userId}
            onChange={handleChange}
          />
        </motion.div>
        <motion.div className="redirect_input-wrapper">
          <motion.button
            className="redirect_button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 2 }}
          >
            <motion.h3 className="redirect_button-text" onClick={handleSubmit}>
              APPLY
            </motion.h3>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
export default Redirect;
