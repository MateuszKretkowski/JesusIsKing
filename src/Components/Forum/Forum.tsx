import React, { useState, useEffect, useRef } from "react";
import "./forum.css";
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

function Forum() {
  return (
    <div className="forum">
      <div className="forum_container">
        <div className="section-title">
          <h1 className="">FORUM</h1>
        </div>
        <div className="forum_content">
          <div className="addpost_container">
            <div className="addpost_title">
              <motion.input
                type="text"
                name="name"
                className="forum-input"
                maxlength="30"
                minlength="1"
              />
            </div>
            <div className="addpost_action">
             <button className="forum_addpost_button"><h3 className="forum_addpost_button-text">IMAGE</h3></button>
             <button className="forum_addpost_button"><h3 className="forum_addpost_button-text">POLLS</h3></button>
             <button className="forum_addpost_button"><h3 className="forum_addpost_button-text">POST IT</h3></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
