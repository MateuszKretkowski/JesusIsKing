import React, { useState, useEffect, useRef } from "react";
import "./post.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
  useAnimate,
} from "framer-motion";
import SideBar from "../SideBar/sidebar";
const defaultAvatar = require("../../Images/avatar.webp");

function Post() {
  return (
    <motion.div className='post'>
      <motion.div className="post_container">
        <motion.div className="post_line" />
        <motion.div className="post_author-wrapper post_bottom_gradient">
            <motion.img src={defaultAvatar} className="author_img" />
            <motion.h5 className="author_name">MATEUSZ KRETKOWSKI</motion.h5>
        </motion.div>
        <motion.div className="post_title-wrapper post_bottom_gradient">
            <motion.h1 className="post_title">HI, CAN I DO SOMRETYHING? THNAKS YOU</motion.h1>
        </motion.div>
        <motion.div className="post_description-wrapper">
            <motion.h2 className="post_description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem fuga eligendi debitis pariatur asdkljadljkasdjkl.</motion.h2>
        </motion.div>
        <motion.div className="post_action_container">
                <motion.button className="post_action action_line"><motion.h3 className="post_action-text">REPLIES</motion.h3></motion.button>
                <motion.button className="post_action action_line"><motion.h3 className="post_action-text">LIKE</motion.h3></motion.button>
                <motion.button className="post_action action_line"><motion.h3 className="post_action-text">REPOST</motion.h3></motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Post
