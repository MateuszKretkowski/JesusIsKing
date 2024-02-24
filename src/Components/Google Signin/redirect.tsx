import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, query, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { app, checkIfUserExistsById } from "../config/config.tsx";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookieUtils.ts";
import "./redirect.css";

function Redirect() {
  const functions = getFunctions();
  const [userId, setUserId] = useState("");
  const [userIdExists, setUserIdExists] = useState(false);
  useEffect(() => {
    if (userId) {
      checkIfUserExistsById(userId).then(exists => {
        setUserIdExists(exists);
      });
    }
  }, [userId]);

  const handleSubmit = async () => {
    if (!userIdExists && userId.length > 2) {
      try {
        // Utwórz funkcję aktualizującą użytkownika
        const updateUser = httpsCallable(functions, "createUserDocument");
        // Wywołaj funkcję i poczekaj na zakończenie
        const result = await updateUser({ userId });
        console.log(result.data);
        // Możesz tu przekierować użytkownika lub wykonać inną akcję po pomyślnym utworzeniu dokumentu
      } catch (error) {
        // Obsłuż błąd, jeśli funkcja Cloud zwróci błąd
        console.error("Error creating user document:", error);
      }
    } else {
      console.error('UserId does not exist or is too short');
    }
  };

  useEffect(() => {
    console.log(userId);
    console.log(`userId type: ${typeof userId}`, `Value: ${userId}`);
  }, [userId]);

  const handleChange = (event: any) => {
    const { value } = event.target;
    setUserId(value);

    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <motion.div className="redirect">
      <motion.div className="redirect_container">
        <motion.div className="redirect_input-wrapper"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1, duration: 2}}
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
            <motion.button className="redirect_button"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 3, duration: 2}}
            >
                <motion.h3 className="redirect_button-text" onClick={handleSubmit}>APPLY</motion.h3>
            </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Redirect;
