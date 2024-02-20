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
  firstPostTitle: string;
  firstPostDescription: string;
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
  firstPostTitle,
  firstPostDescription,
}: Post) => {
  const [isEven, setIsEven] = useState(false);
  useEffect(() => {
    index % 2 === 0 ? setIsEven(true) : setIsEven(false);
  }, []);

  return (
    <motion.div
      className="post"
      style={{
        marginLeft: isEven ? "0px" : "250px",
        marginRight: isEven ? "250px" : "0px",
      }}
    >
      <motion.div
        className="post_container"
        style={{ alignItems: isEven ? "start" : "end" }}
      >
        <motion.div
          className="post_line"
          style={{ left: isEven ? "0%" : "100%" }}
        />
        <motion.div
          className="post_author-wrapper"
          style={{ justifyContent: isEven ? "start" : "end" }}
        >
          <motion.div
            className="post_author-wrapper-wrapper"
            style={{ flexDirection: isEven ? "row" : "row-reverse" }}
          >
            <motion.img src={defaultAvatar} className="author_img" />
            <motion.h5 className="author_name">{author}</motion.h5>
          </motion.div>
          <motion.div
            className="post_bottom_gradient"
            style={{ scaleX: isEven ? "1" : "-1" }}
          />
        </motion.div>
        <motion.div className="post_title-wrapper">
            <motion.h1
              layout="position"
              className="post_title"
              layoutId={index === 0 ? "post_title" : ""}
              transition={{ duration: 0.7 }}
              style={{ opacity: isApplied ? 1 : 0 }}
            >
              {index === 0 ? firstPostTitle : name}
            </motion.h1>
          <motion.div
            className="post_bottom_gradient"
            style={{ scaleX: isEven ? "1" : "-1" }}
          />
        </motion.div>
        <motion.div
          className="post_description-wrapper"
          style={{ textAlign: isEven ? "start" : "end" }}
        >
            <motion.h2
              layout="position"
              className="post_description"
              layoutId={index === 0 ? "post_description" : ""}
              transition={{ duration: 0.7 }}
              style={{ height: "100%", opacity: isApplied ? 1 : 0 }}
            >
              {index === 0 ? firstPostDescription : description}
            </motion.h2>
        </motion.div>
        <motion.div
          className="post_action_container"
          style={{ justifyContent: isEven ? "start" : "end" }}
        >
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
