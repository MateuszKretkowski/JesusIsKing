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
import Forum from "./Forum";
const defaultAvatar = require("../../Images/avatar.webp");

interface Post {
  index: number;
  authorId: string;
  author: string;
  date: string;
  description: string;
  name: string;
  noReposts: number;
  noLikes: number;
  noReplies: number;
  isApplied: boolean;
  localName: string;
  localDescription: string;
}
const Post = ({
  index,
  authorId,
  author,
  date,
  description,
  name,
  noReposts,
  noLikes,
  noReplies,
  isApplied,
  localName,
  localDescription,
}: Post) => {
  return (
    <motion.div className="post">
      <motion.div className="post_container">
        <motion.div className="post_line" />
        <motion.div className="post_author-wrapper post_bottom_gradient">
          <motion.img src={defaultAvatar} className="author_img" />
          <motion.h5 className="author_name">{author}</motion.h5>
        </motion.div>
        <motion.div className="post_title-wrapper post_bottom_gradient">
          {!isApplied &&( <motion.h1 className="post_title">{name}</motion.h1>)}
          {isApplied && (
            <motion.h1
              layout="position"
              className="post_title"
              layoutId={index === 0 ? "post_title" : ""}
              transition={{duration: 0.5}}

            >
              {index === 0 ? localName : name}
            </motion.h1>
          )}
        </motion.div>
        <motion.div className="post_description-wrapper">
        {isApplied && (<motion.h2 className="post_description">{description}</motion.h2>)}
        {isApplied && (
            <motion.h1
              layout="position"
              className="post_description"
              layoutId={index === 0 ? "post_description" : ""}
              transition={{duration: 0.5}}

            >
              {index === 0 ? localDescription : description}
            </motion.h1>
          )}
        </motion.div>
        <motion.div className="post_action_container">
          <motion.button
            className="post_action action_line"
            style={{ marginRight: "6%" }}
          >
            <motion.h3 className="post_action-text">
              REPLIES: {noReplies}
            </motion.h3>
          </motion.button>
          <motion.button className="post_action action_line">
            <motion.h3 className="post_action-text">LIKE: {noLikes}</motion.h3>
          </motion.button>
          <motion.button className="post_action action_line">
            <motion.h3 className="post_action-text">
              REPOST: {noReposts}
            </motion.h3>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Post;
