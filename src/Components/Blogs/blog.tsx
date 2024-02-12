import React, { useState, useEffect, useRef } from "react";
import "./blog.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
} from "framer-motion";
import { readBlogs } from "../Google Signin/config";
const defaultAvatar = require("../../Images/avatar.webp");
const blogImageTest = require("../../Images/blogtestimage.jpg");
interface Blog {
  id: string, 
  author: string, 
  authorId: string, 
  date: string, 
  description: string, 
  name: string
}

function Blog({ id, author, authorId, date, description, name }: Blog) {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  useEffect(() => {
    showModal ? controls.start("modal") : controls.start(isHovered ? "visible" : "hidden");
  });

  const titleVariants = {
    hidden: { opacity: 0, scale: 0, y: 50, x: 0 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: -100, x: -50 },
    exit: { opacity: 0, scale: 0, y: 50, x: 0 },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: -50 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 0, x: -50 },
  };

  const dateVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: 50 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 0, x: 50 },
  };

  const imgVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: 50 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 0, x: 50 },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: 50 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 0, x: 50 },
  };

  const [blogData, setBlogData] = useState({
    id: id,
    name: name,
    description: description,
    authorId: authorId,
    author: author,
    date: date,
  });

  useEffect(() => {
    const unsub = readBlogs();
  }, []);

  function wrapBlogWordsInSpan(name: string): JSX.Element[] {
    const words = name.split(" ");
  
    return words.map((word, wordIndex) => (
                  <motion.h2
            className="title white"
            variants={titleVariants}
            initial={controls}
            animate={controls}
            exit={controls}
            transition={{
                delay: 0.05 * wordIndex,
                type: "ease",
                bounce: 0.4,
                damping: 10,
                mass: 0.2
              }}
          >
          {word}
        </motion.h2>
    ));
  }
  const blogNameMAPPED = wrapBlogWordsInSpan(blogData.name);

  useEffect(() => {
    console.log(blogData)
  }, [])

  return (
    <motion.div
      className="blog"
      ref={ref}
      style={{opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0px)" : "translateY(50px)"}}
      onClick={() => {setShowModal(!showModal)}}
      onHoverStart={() => {
        setIsHovered(!isHovered);
      }}
      onHoverEnd={() => {
        setIsHovered(!isHovered);
      }}
    >
      <motion.img src={blogImageTest} className="blog_image" />
      <motion.div className="blog_container">
        <motion.div className="upper-wrapper">
          <motion.div className="author-wrpaper">
            <motion.img
              className="author-avatar"
              src={defaultAvatar}
              variants={avatarVariants}
              initial={controls}
              animate={controls}
              exit={controls}
              transition={{ delay: 0.3 }}
            />
            <motion.h5
              className="white"
              variants={avatarVariants}
              initial={controls}
              animate={controls}
              exit={controls}
              transition={{ delay: 0.2 }}
            >
              {blogData.author}
            </motion.h5>
          </motion.div>
          <motion.div className="date-wrapper">
            <motion.h5
              className="white"
              variants={dateVariants}
              initial={controls}
              animate={controls}
              exit={controls}
              transition={{ delay: 0.6 }}
            >
              {blogData.date}
            </motion.h5>
          </motion.div>
        </motion.div>
        <motion.div className="lower-wrapper">
            {blogNameMAPPED}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Blog;
