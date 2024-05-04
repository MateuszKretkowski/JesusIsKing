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
import { auth, readBlogs } from "../config/config";

function BlogsWrapper() {
  interface Blog {
    id: string;
    author: string;
    authorId: string;
    date: string;
    description: string;
    name: string;
  }
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await readBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching Blogs: ", error);
        setBlogs([]);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blogs"
    ref={ref}
    >
      <div className="blogs_container">
        <div className="section-title">
            <motion.h1
            style={{opacity: isInView ? 1 : 0}}
            >NEWEST BLOGS</motion.h1>
        </div>
        <motion.div className="blogs_wrapper_container">
          <motion.div className="blogs-wrapper"
          >
              {auth.currentUser && (
            <div className="blogs-wrapper-wrapper">

                {blogs.slice(0, 2).map(blog => (
                  <Blog key={blog.id} id={blog.id} authorId={blog.authorId} author={blog.author} date={blog.date} description={blog.description} name={blog.name} />
                ))}
                </div>
              )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default BlogsWrapper;
