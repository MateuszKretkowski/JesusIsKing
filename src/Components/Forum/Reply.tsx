import React, { useEffect, useState } from 'react'
import "./Reply.css";
import { AnimatePresence, motion } from 'framer-motion';
import { db, likeAPost, unlikeAPost } from '../config/config';
import { collection, getDoc } from 'firebase/firestore';
const defaultAvatar = require("../../Images/avatar.webp");

interface Reply {
  id: string;
  name: string;
  author: string;
  authorEmail: string;
  date: string;
  noLikes: number;
  isRepliesOpen: boolean;
  i: number;
}

function Reply({ id, name, author, authorEmail, date, noLikes, isRepliesOpen, i }: Reply) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const truncatedName = expanded ? name.split('').map((letter, index) => (
    <AnimatePresence key={index}>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.01 * index }}
        key={index}
      >
        {letter}
      </motion.h2>
    </AnimatePresence>
  )) : (
    <AnimatePresence mode='wait'>
      <motion.h2
        initial={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {name.slice(0, 50) + (name.length > 50 ? "..." : "")}
      </motion.h2>
    </AnimatePresence>
  );

  return (
    <motion.div
      className='Reply'
      style={{ height: isRepliesOpen ? expanded ? "240px" : "120px" : "0px" }}
      transition={{ duration: 0.5, delay: 1 * i }}
      onClick={handleClick}
    >
      <motion.div className='reply_container'>
        <div className='reply_author-wrapper'>
          <img src={defaultAvatar} className='author_img' />
          <motion.h5 className="author_name">{author}</motion.h5>
        </div>
        <motion.div className='reply_name-wrapper'>
          {truncatedName}
        </motion.div>
        <motion.div className="post_action_container">
          <motion.button className="post_action action_line">
            <motion.h3 className="post_action-text">{noLikes}</motion.h3>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Reply
