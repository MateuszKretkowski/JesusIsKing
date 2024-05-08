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
import { auth, isLoggedIn, isUserLoggedIn, readBlogs } from "../config/config";
import { UserAuth } from "../Contexts/AuthContext";

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

  const { user, googleSignIn, logOut } = UserAuth();
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
            <div className="blogs-wrapper-wrapper">

                {blogs && blogs.slice(0, 2).map(blog => (
                  <Blog key={blog.id} id={blog.id} authorId={blog.authorId} author={blog.author} date={blog.date} description={blog.description} name={blog.name} />
                ))}
                </div>
          </motion.div>
        </motion.div>
      </div>
      </div>
  )
}

export default BlogsWrapper;
