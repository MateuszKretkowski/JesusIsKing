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
import Post from "./post";
const defaultAvatar = require("../../Images/avatar.webp");

function Forum() {
  const [rows, setRows] = useState(2);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="forum">
      <div className="forum_container">
        <div className="section-title">
          <h1 className="">FORUM</h1>
        </div>
        <div className="forum_content">
          <div className="addpost_container">
            <div className="addpost_title-wrapper bottom_gradient">
              <motion.textarea
                name="name"
                className="forum_addpost_title"
                maxLength="40"
                minLength="1"
                rows="1"
                cols="50"
                style={{width: isFocused ? "100%" : "150%"}}
                placeholder="WHAT'S ON YOUR MIND TODAY?"
              ></motion.textarea>
            </div>
            <div className="addpost_title-wrapper">
              <motion.textarea
                name="name"
                className="forum_addpost_title forum_addpost_description"
                maxLength="400"
                minLength="1"
                rows="6"
                cols="50"
                style={{height: isFocused ? "100px" : "30px"}}
                transition={{type: "spring"}}
                onFocus={() => {setIsFocused(!isFocused)}} // Set rows to 6 when focused
                onBlur={() => {setIsFocused(!isFocused)}} // Set rows back to 2 when not focused
                placeholder="Could You maybe describe it?"
              ></motion.textarea>
            </div>
            <div className="addpost_action">
              <button className="forum_addpost_button">
                <h3 className="forum_addpost_button-text">POST IT</h3>
              </button>
            </div>
          </div>
          <div className="posts_container">
            <Post />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
