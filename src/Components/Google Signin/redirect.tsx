import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { app } from "../config/config.tsx";
import "./redirect.css";

function Redirect() {

    const handleSubmit = async () => {
        try {
            // var updateUser = httpsCallable(functions, "updateUser");
            // const result = await updateUser(formData);
            // console.log(result.data);
            // setShowModal(false);
            
        } catch (error) {
            console.error("Error updating User: ", error);
        }
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
          />
        </motion.div>
        <motion.div className="redirect_input-wrapper">
            <motion.button className="redirect_button"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 3, duration: 2}}
            >
                <motion.h3 className="redirect_button-text">APPLY</motion.h3>
            </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Redirect;
