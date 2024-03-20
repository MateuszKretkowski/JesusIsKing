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
import { doc, getDoc } from "firebase/firestore";
import { db, likeAPost, unlikeAPost } from "../config/config";
const defaultAvatar = require("../../Images/avatar.webp");

interface Post {
  id: string;
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

interface AuthorData {
  author: string;
  authorId: string;
}
const Post = ({
  id,
  index,
  authorId,
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

  useEffect(() => {
    console.log(authorId);
  })  

  const [authorData, setAuthorData] = useState<AuthorData>({
    author: "",
    authorId: "",
  });


  
  useEffect(() => {
    const readPostAuthor = async () => {
      const userRef = doc(db, "Users", authorId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData);
        setAuthorData({
          author: userData?.name || "",
          authorId: userData?.id || "",
        });
      }
    };

    readPostAuthor();
  }, []);

  const addPostTitleVariants = {
    hidden: { color: "#333333" },
    visible: { color: "#000000" },
  };
  const addPostDescriptionVariants = {
    hidden: { color: "#333333" },
    visible: { color: "#000000" },
  };
  const addPostActionContainerVariants = {
    hidden: { opacity: "0", top: 100 },
    visible: { opacity: "1", top: 0, transition: { staggerChildren: 0.5 } },
  };
  const addPostActionVariants = {
    hidden: { opacity: "0", top: 100 },
    visible: { opacity: "1", top: 0 },
  };
  const addPostAuthorContainerVariants = {
    hidden: { opacity: "0", top: -100, height: "0%" },
    visible: {
      opacity: "1",
      top: 0,
      height: "100%",
      transition: { staggerChildren: 0.5 },
    },
  };
  const addPostAuthorVariants = {
    hidden: { opacity: "0", top: -100, height: "0%" },
    visible: { opacity: "1", top: 0, height: "auto" },
  };
  const addPostPostVariants = {
    hidden: { opacity: "1" },
    visible: { opacity: "0" },
  };
  const gradientVariants = {
    hidden: { width: "0%" },
    visible: { width: "100%" },
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    console.log(isLiked);
  
  }, [isLiked])

  return (
    <motion.div
      className="post"
      style={{
        marginLeft: isEven ? "250px" : "0",
        marginRight: isEven ? "0" : "250px",
      }}
    >
      <motion.div
        className="post_container"
        style={{ alignItems: isEven ? "end" : "start" }}
      >
        <motion.div
          className="post_line"
          style={{ left: isEven ? "100%" : "0%" }}
        />
        <motion.div
          className="post_author-wrapper"
          style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.div
            className="post_author-wrapper-wrapper"
            style={{ flexDirection: isEven ? "row-reverse" : "row" }}
          >
            <motion.img src={defaultAvatar} className="author_img" />
            <motion.h5 className="author_name">{authorData.author}</motion.h5>
          </motion.div>
          <motion.div className="author_description">

          </motion.div>
          <motion.div
            className="post_bottom_gradient"
            style={{ scaleX: isEven ? "-1" : "1" }}
          />
        </motion.div>
        <motion.div className="post_title-wrapper">
          <motion.h1
            className="post_title"
            transition={{ duration: 0.7 }}
          >
            {name}
          </motion.h1>
          <motion.div
            className="post_bottom_gradient"
            style={{ scaleX: isEven ? "-1" : "1" }}
          />
        </motion.div>
        <motion.div
          className="post_description-wrapper"
          style={{ textAlign: isEven ? "end" : "start" }}
        >
          <motion.h2
             className="post_description"
            transition={{ duration: 0.7 }}
          >
            {description}
          </motion.h2>
        </motion.div>
        <motion.div
          className="post_action_container"
          style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.button
            className="post_action action_line"
            style={{ marginRight: "6%" }}
          >
            <motion.h3 className="post_action-text">
              REPLIES: {noReplies}
            </motion.h3>
          </motion.button>
          <motion.button className="post_action action_line" onClick={() => {isLiked ? likeAPost(id) : unlikeAPost(id); setIsLiked(!isLiked)}}>
            <motion.h3 className="post_action-text">{isLiked ? `LIKE: ${noLikes+=1}` : `LIKE: ${noLikes}`}</motion.h3>
          </motion.button>
          <motion.button className="post_action action_line">
            <motion.h3 className="post_action-text">
              REPOST: {noReposts}
            </motion.h3>
          </motion.button>
        </motion.div>
        <motion.div
          className="post_date_container"
          style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.h5 className="post_date-text">{date}</motion.h5>
        </motion.div>
      </motion.div>

      {/* REPLIES */}

      <motion.div
        className="replies_container"
        style={{ justifyContent: isEven ? "end" : "start" }}
      >
        <motion.div className="reply_addPost"
        style={{ justifyContent: isEven ? "end" : "start" }}
        >
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Post;
