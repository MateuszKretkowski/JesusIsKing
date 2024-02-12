import React, { useState, useEffect, useRef } from "react";
import "./blog.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
  useAnimate,
} from "framer-motion";
import { readBlogs } from "../Google Signin/config";
import SideBar from "../SideBar/sidebar";
const defaultAvatar = require("../../Images/avatar.webp");
const blogImageTest = require("../../Images/blogtestimage.jpg");
interface Blog {
  id: string;
  author: string;
  authorId: string;
  date: string;
  description: string;
  name: string;
}

function Blog({ id, author, authorId, date, description, name }: Blog) {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  useEffect(() => {
    showModal
    ? controls.start("modal")
    : controls.start(isHovered ? "visible" : "hidden");
  });
  
  const [scopeAuthor, animate] = useAnimate();

  const titleVariants = {
    hidden: { opacity: 0, scale: 0, y: 50, x: 0 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 0, y: 50, x: 0 },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 1, y: -50, x: 10, transition: {delay: 0}  },
    modal: { opacity: 1, scale: 1, y: 0, x: 10, transition: {delay: 0.6} },
    exit: { opacity: 0, scale: 1, y: 0, x: -50 },
  };

  const avatarVariantsName = {
    hidden: { opacity: 0, scale: 1, y: -50, x: 10, transition: {delay: 0}  },
    modal: { opacity: 1, scale: 1, y: 0, x: 10, transition: {delay: 0.9} },
    exit: { opacity: 0, scale: 1, y: 0, x: -50 },
  };

  const dateVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: 50 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 0, x: 50 },
  };

  const imgVariants = {
    hidden: { opacity: 1, scale: 1, filter: "blur(1px) brightness(1)", y: 0, x: 0,},
    visible: { opacity: 1, scale: 1, filter: "blur(1px) brightness(0.8)", y: 0, x: 0, transition: {delay: 0.3}  },
    modal: { opacity: 1, scale: 1, filter: "none", "border-radius-top-right": "0%", "border-radius-bottom-right": "0%", y: 0, x: -550 },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: 0, transition: {delay: 0.4}  },
    visible: { opacity: 0, scale: 1, y: 0, x: 0, transition: {delay: 0.4} },
    modal: { opacity: 1, scale: 1, y: 0, x: 0, transition: {delay: 0.6}  },
  };

  const blogVariants = {
    hidden: { opacity: 1, scale: 1, y: 0, x: 0 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
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
          delay: 0.1 * wordIndex,
          type: "ease",
          bounce: 0.4,
          damping: 10,
          mass: 0.2,
        }}
      >
        {word}
      </motion.h2>
    ));
  }
  const blogNameMAPPED = wrapBlogWordsInSpan(blogData.name);

  useEffect(() => {
    console.log(blogData);
  }, []);

  return (
    <motion.div
      className="blog"
      variants={blogVariants}
      initial={controls}
      animate={controls}
      exit={controls}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0px)" : "translateY(50px)",
      }}
      onClick={() => {
        setShowModal(!showModal);
      }}
      onHoverStart={() => {
        if (!showModal) {
          setIsHovered(true);
        }
      }}
      onHoverEnd={() => {
        if (!showModal) {
          setIsHovered(false);
        }
      }}
    >
      <motion.img
        src={blogImageTest}
        className="blog_image"
        variants={imgVariants}
        initial={controls}
        animate={controls}
        exit={controls}
      />
      <motion.div className="blog_container">
        <motion.div className="upper-wrapper">
          <motion.div className="author-wrpaper"
          >
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
              variants={avatarVariantsName}
              initial={controls}
              animate={controls}
              exit={controls}
              transition={{ delay: 0.9 }}
            >
              {blogData.author}
            </motion.h5>
          </motion.div>
          <motion.div className="date-wrapper"
            ref={scopeAuthor}
          >
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
        <motion.div
            className="description-wrapper"
            variants={descriptionVariants}
            initial={controls}
            animate={controls}
            exit={controls}
          >
            {showModal && <h2 className="description grey">{blogData.description}</h2>}
          </motion.div>
          <h2 className="description">{blogNameMAPPED}</h2>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Blog;
