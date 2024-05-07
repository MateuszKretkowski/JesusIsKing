import React, { useEffect, useState } from "react";
import "./Reply.css";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { db, likeAPost, unlikeAPost } from "../config/config";
import { collection, getDoc } from "firebase/firestore";
import BusinessCard from "./BusinessCard";
const defaultAvatar = require("../../Images/avatar.webp");

interface Reply {
  id: string;
  name: string;
  author: string;
  authorEmail: string;
  date: string;
  noLikes: number;
  isRepliesOpen: boolean;
  isEven: boolean;
  i: number;
}

function Reply({
  id,
  name,
  author,
  authorEmail,
  date,
  noLikes,
  isRepliesOpen,
  isEven,
  i,
}: Reply) {
  const [expanded, setExpanded] = useState(false);
  const controls = useAnimation();

  const handleClick = () => {
    if (name.length >= 50) {
      setExpanded(!expanded);
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
  };

  useEffect(() => {
    expanded ? controls.start("visible") : controls.start("hidden");
  }, [expanded, isRepliesOpen]);

  const truncatedName = name.split("").map((letter, index) => (
    <motion.h2
      variants={letterVariants}
      initial={controls}
      animate={controls}
      transition={{ duration: 0.01, delay: 0.01 * index }}
      key={index}
      className="letters"
    >
      {index >= 50 ? letter : ""}
    </motion.h2>
  ));

  const controlsForReply = useAnimation();
  useEffect(() => {
    if (isRepliesOpen) {
      controlsForReply.start("visible");
    } else {
      controlsForReply.start("hidden");
    }
  }, [isRepliesOpen, expanded]);
  const replyVariants = {
    hidden: { height: "0px", opacity: 0, transition: { duration: 0.5 } },
    visible: { height: expanded ? "240px" : "150px", opacity: 1, transition: { duration: 0.5, delay: 0.6 } },
    exit: { height: "0px", opacity: 0, transition: { duration: 0.5 } },
  }

  useEffect(() => {
    console.log("isEven: ", isEven);
  }, [isEven])

  const [isHoveredPFP, setIsHoveredPFP] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        className="Reply"
        variants={replyVariants}
        initial={controlsForReply}
        animate={controlsForReply}
        exit={controlsForReply}
        transition={{ duration: 0.2, delay: 0.1 * i }}
        style={{ justifyContent: isEven ? "end" : "start", marginTop: isHoveredPFP ? "60px" : "0px"}}
        onClick={handleClick}
      >
        <motion.div className="reply_container"
        style={{ alignItems: isEven ? "end" : "start" }}
        >
          <motion.div className="reply_author-wrapper"
          onHoverStart={() => setIsHoveredPFP(true)}
          onHoverEnd={() => setIsHoveredPFP(false)}
          >
          <BusinessCard email={authorEmail} isEven={isEven} isPosts={true} />

          </motion.div>
          <motion.h2 className="reply_name-wrapper">
            {name.slice(0, 50)}
            {name.length > 50 ? <motion.h2
              style={{
                display: "inline-block",
                width: "0px",
                color: expanded ? "transparent" : "black",
              }}
            >
              ...
            </motion.h2> : ""}
            {" "}
            {truncatedName}
          </motion.h2>
          <motion.div
            className="post_action_container"
            //   style={{ justifyContent: isEven ? "end" : "start" }}
          >
            <motion.button className="post_action action_line">
              <motion.h3 className="post_action-text">{noLikes}</motion.h3>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Reply;
