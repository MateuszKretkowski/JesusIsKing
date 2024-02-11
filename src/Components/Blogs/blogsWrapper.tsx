import React, { useState, useEffect, useRef } from "react";
import "./blogsWrapper.css";
import Blog from "./blog";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
} from "framer-motion";

function BlogsWrapper() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div className="blogs"
    ref={ref}
    >
      <div className="blogs_container">
        <div className="section-title">
            <motion.h1 className="title"
            style={{opacity: isInView ? 1 : 0}}
            >BLOGS</motion.h1>
        </div>
        <div className="blogs_wrapper_container">
          <div className="blogs-wrapper">
              <Blog />
              <Blog />
              <Blog />
          </div>
        </div>
        <div className="buttons-wrapper">
          <div className="blog_button-left" />

          <div className="blog_button-right" />
        </div>
      </div>
    </div>
  )
}

export default BlogsWrapper;
