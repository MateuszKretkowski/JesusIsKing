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
import { readBlogs } from "../config/config";
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

  const titleVariants = {
    hidden: { opacity: 1, scale: 1, y: 0, x: 0,},
    visible: { opacity: 1, scale: 1, y: 0, x: 0,},
    modal: { opacity: 1, scale: 1, y: 0, x: 0,},
    exit: { opacity: 0, scale: 0, y: 50, x: 0 },
  };

  const avatarVariants = {
    hidden: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 10, transition: { delay: 0.6 } },
    visible: { opacity: 1, scale: 1, y: 0, x: 10, transition: { delay: 0.6 } },
    exit: { opacity: 0, scale: 1, y: 0, x: -50 },
  };


  const avatarVariantsName = {
    hidden: { opacity: 1, scale: 1, y: 0, x: 0 },
    visible: { opacity: 1, scale: 1, y: 0, x: 10, transition: { delay: 0.9 } },
    modal: { opacity: 1, scale: 1, y: 0, x: 10, transition: { delay: 0.9 } },
    exit: { opacity: 0, scale: 1, y: 0, x: -50 },
  };

  const dateVariants = {
    hidden: { opacity: 1, scale: 1, y: 0, x: 0 },
    visible: { opacity: 1, scale: 1, y: 0, x: 0 },
    modal: { opacity: 1, scale: 1, y: 0, x: 0 },
    exit: { opacity: 0, scale: 1, y: 0, x: 50 },
  };

  const imgVariants = {
    hidden: {
      opacity: 1,
      scale: 1,
      filter: "blur(1px) brightness(1)",
      y: 0,
      x: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(1px) brightness(0.8)",
      y: 0,
      x: 0,
      transition: { delay: 0.3 },
    },
    modal: {
      opacity: 1,
      scale: 1,
      filter: "none",
      "border-radius-top-right": "0%",
      "border-radius-bottom-right": "0%",
      y: 0,
      x: "-98%",
    },
  };
  const [scope, animate] = useAnimate();
  async function descriptionAnimation() {
    await animate(scope.current, { height: "100%",});
    await animate(scope.current, { opacity: 1, scale: 1, y: 0, x: 0, transition: { delay: 5 } });
  }

  useEffect(() => {
    showModal ? descriptionAnimation() : console.log("not show modal animation description");
  });

  const descriptionVariants = {
    hidden: { opacity: 0, scale: 1, y: 0, x: 0, height: "0px", transition: { delay: showModal ? 4 : 0, duration: 0.5 } },
    visible: { opacity: 0, scale: 0, y: 0, x: 0, height: "100%", transition: { delay: showModal ? 4 : 2, duration: 0.5 } },
  };
    // max-width: 42vw;
  const blogVariants = {
    hidden: { opacity: 1, scale: 1, y: 0, x: 0, "max-width": "30%" },
    visible: { opacity: 1, scale: 1, y: 0, x: 0, "max-width": "37vw" },
    modal: { opacity: 1, scale: 1, y: 0, x: 0, "max-width": "52vw" },
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
        variants={titleVariants}
        initial={controls}
        animate={controls}
        exit={controls}
        className="blog_title"
      >
        {word.toUpperCase()}
      </motion.h2>
    ));
  }
  const blogNameMAPPED = wrapBlogWordsInSpan(blogData.name);

  useEffect(() => {
    console.log("blogModal: ", showModal);
  }, [showModal]);

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
    >
      <motion.div className="blog_container">
        <motion.div className="blog_title-wrapper">{blogNameMAPPED}</motion.div>
        <motion.div
          className="description-wrapper"
          variants={descriptionVariants}
          initial={controls}
          animate={controls}
          exit={controls}
          ref={scope}
          transition={{delay: 1}}
        >
          <motion.h3 className="blog_description">
            {blogData.description.toUpperCase()}
          </motion.h3>
        </motion.div>
        <motion.div className="blog_lower-wrapper">
          <motion.div className="blog_author-wrapper">
            <motion.img
              src={defaultAvatar}
              className="author-avatar"
              variants={avatarVariants}
              initial={controls}
              animate={controls}
              exit={controls}
            />
            <motion.h5
              variants={avatarVariantsName}
              initial={controls}
              animate={controls}
              exit={controls}
            >
              {blogData.author}
            </motion.h5>
          </motion.div>
          <motion.div className="blog_date-wrapper">
            <motion.h5
              className="date"
              variants={dateVariants}
              initial={controls}
              animate={controls}
              exit={controls}
            >
              {blogData.date}
            </motion.h5>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Blog;