import React from 'react'
import { motion } from 'framer-motion';
import { likeAPost, unlikeAPost } from '../config/config';
const defaultAvatar = require("../../Images/avatar.webp");

interface Reply {
    id: string;
    name: string;
    author: string;
    authorId: string;
    date: string;
    noLikes: number;
}
function Reply({ id, name, author, authorId, date, noLikes }: Reply) {
  return (
    <div className='Reply'>
        <div className='reply_container'>
            <div className='reply_author-wrapper'>
                <img src={defaultAvatar} className='author_img' />
                <motion.h5 className="author_name">{author}</motion.h5>
            </div>
            <motion.div className='reply_name-wrapper'>
                <motion.h2>{name}</motion.h2>
            </motion.div>
            <motion.div
          className="post_action_container"
        //   style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.button className="post_action action_line">
            <motion.h3 className="post_action-text">{noLikes}</motion.h3>
          </motion.button>
        </motion.div>
        </div>
    </div>
  )
}

export default Reply
