// THIS IS A PROTOTYPE // THIS ISNT IN THE ACTUAL PROJECT AS WELL AS THE CSS FILE OF THIS MODAL
// THIS IS A PROTOTYPE // THIS ISNT IN THE ACTUAL PROJECT AS WELL AS THE CSS FILE OF THIS MODAL
// THIS IS A PROTOTYPE // THIS ISNT IN THE ACTUAL PROJECT AS WELL AS THE CSS FILE OF THIS MODAL
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";
import { app } from "../Google Signin/config.tsx";
import "./blogModal.css";
const blogImageTest = require("../../Images/blogtestimage.jpg");
const defaultAvatar = require("../../Images/avatar.webp");

type ModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  id: string;
  author: string;
  authorId: string;
  date: string;
  description: string;
  name: string;
};
const BlogModal = ({
  showModal,
  setShowModal,
  id,
  author,
  authorId,
  date,
  description,
  name,
}: ModalProps) => {
  const navigate = useNavigate();

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 1 },
};
const modal = {
    hidden: { y: "0vh", opacity: 1 },
    visible: { y: "0vh", opacity: 1 },
};

useEffect(() => {
  console.log(showModal);
})

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="backdrop"
          variants={backdrop}
          animate="visible"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="modal"
            variants={modal}
            animate="visible"
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
                  <motion.div 
                    className='modal' 
                    variants={modal}
                    transition={{type: "spring", bounce: 0.5}}
                    >
                        <motion.div className='modal_container'>
                            <motion.div className='text-wrapper'>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>NAME</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='name'
                                    className='settings-input'
                                    maxlength="30" minlength="10"
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>DESCRIPTION</motion.h2>
                                    
                                    <motion.textarea 
                                    type='text'
                                    name='description'
                                    className='settings-input settings-input-description'
                                    maxlength="120" minlength="10"
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>LINK</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='link'
                                    className='settings-input'
                                    maxlength="20" minlength="1"
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>LOCATION</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='from'
                                    className='settings-input'
                                    maxlength="20" minlength="1"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div className='modal_action-wrapper'>
                                <motion.button className='action-wrapper'><h2>APPLY CHANGES</h2></motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;
