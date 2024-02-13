// THIS IS A PROTOTYPE // THIS ISNT IN THE ACTUAL PROJECT AS WELL AS THE CSS FILE OF THIS MODAL
// THIS IS A PROTOTYPE // THIS ISNT IN THE ACTUAL PROJECT AS WELL AS THE CSS FILE OF THIS MODAL
// THIS IS A PROTOTYPE // THIS ISNT IN THE ACTUAL PROJECT AS WELL AS THE CSS FILE OF THIS MODAL
import React, { useState } from "react";
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
};
const BlogModal = ({ showModal, setShowModal }: ModalProps) => {
  const navigate = useNavigate();

  const modal = {
    hidden: { y: "0vh", opacity: 0 },
    visible: { y: "0vh", opacity: 1 },
  };


  return (
    <AnimatePresence>
      <motion.div className="modal_blog">
        {showModal && (
          <motion.div
            className="content-wrapper_blog"
            variants={modal}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <motion.div className="modal_content-wrapper_blogs">
              <motion.div className="modal_content_blogs">
                <h1 className="title"></h1>
                <h2 className="description"></h2>
              </motion.div>
              <div className="modal_footer-wrapper_blogs">
                <div className="author-wrapper">
                  <motion.img
                    className="author-avatar"
                    src={defaultAvatar}
                    transition={{ delay: 0.3 }}
                  />
                  <h3>AUTHOR</h3>
                </div>
                <div className="date-wrapper">
                  <h3>11-02-24</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;
