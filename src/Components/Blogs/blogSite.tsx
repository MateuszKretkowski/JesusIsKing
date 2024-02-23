import React, { useState, useEffect, useRef } from "react";
import "./blogSite.css";
import Blog from "./blog";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
} from "framer-motion";
import BlogModal from "./BlogModal";
import { Link, useLocation } from "react-router-dom";
import { readBlogs } from "../config/config";

function BlogSite() {
  interface Blog {
    id: string;
    author: string;
    authorId: string;
    date: string;
    description: string;
    name: string;
    // Inne właściwości, które mogą być potrzebne
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
    <div className="blogsSite" ref={ref}>
      <div className="blogsSite_container">
        <div className="sectionSite-title">
          <motion.h1 className="title" style={{ opacity: isInView ? 1 : 0 }}>
            BLOGS
          </motion.h1>
        </div>
        <div className="blogsSite_blogs-wrapper">
        {blogs.map((blog) => (
            <Blog
            key={blog.id}
            id={blog.id}
            authorId={blog.authorId}
            author={blog.author}
            date={blog.date}
            description={blog.description}
            name={blog.name}
            />
            ))}
            </div>
      </div>
    </div>
  );
}

export default BlogSite;
