import React, { useState, useEffect, useRef } from "react";
import "./forum.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
  useAnimate,
} from "framer-motion";
import SideBar from "../SideBar/sidebar";
import Post from "./post";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth, readPosts } from "../config/config";
import { findUserByEmail } from "../config/config.tsx";
const defaultAvatar = require("../../Images/avatar.webp");

function Forum() {
  const [isFocused, setIsFocused] = useState(false);
  const [isEven, setIsEven] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isAppliedAddPost, setIsAppliedAddPost] = useState(false);
  const [firstPostTitle, setFirstPostTitle] = useState("");
  const [firstPostDescription, setFirstPostDescription] = useState("");

  interface PostData {
    name: string;
    description: string;
    author: string;
    authorId: string;
    date: string;
    numberOfLikes: number;
    numberOfReplies: number;
    numberOfReposts: number;
  }

  const [postData, setPostData] = useState<PostData>({
    name: "",
    description: "",
    author: "",
    authorId: "",
    date: "",
    numberOfLikes: 0,
    numberOfReplies: 0,
    numberOfReposts: 0,
  });

  const userEmail = auth.currentUser?.email || null;
  const getUser = async () => {
    const user = await findUserByEmail(userEmail || "");
    setAuthor(user?.name);
  };

  const [author, setAuthor] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target; // Destrukturyzacja, aby uzyskać `name` i `value`
    setPostData((prevState) => ({
      ...prevState, // Kopiowanie istniejących wartości stanu
      [name]: value, // Aktualizacja wartości dla klucza, który odpowiada `name` elementu formularza
    }));

    const textarea = event.target;
    textarea.style.height = "auto"; // Reset wysokości
    textarea.style.height = textarea.scrollHeight + "px";
  };
  const functions = getFunctions();
  const handleSubmit = async () => {
    try {
      getUser();
      var createPost = httpsCallable(functions, "createPost");
      const result = await createPost(postData);
      await setIsApplied(true);
      await setIsAppliedAddPost(true);
    } catch (error) {
      console.error("Error creating Post: ", error);
    }
  };

  interface Post {
    name: string;
    description: string;
    author: string;
    authorId: string;
    date: string;
    numberOfLikes: number;
    numberOfReplies: number;
    numberOfReposts: number;
  }
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await readPosts();
        const formattedPosts = postsData.map(post => ({
          ...post,
          id: post.id,
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching Blogs: ", error);
        setPosts([]);
      }
    };
  
    fetchPosts();
  }, []);

  const addPostTitleVariants = {
    hidden: { color: "#333333" },
    visible: { color: "#000000" },
  };
  const addPostDescriptionVariants = {
    hidden: { color: "#333333" },
    visible: { color: "#000000" },
  };
  const addPostActionContainerVariants = {
    hidden: { opacity: "0", top: 100 },
    visible: { opacity: "1", top: 0, transition: { staggerChildren: 0.5 } },
  };
  const addPostActionVariants = {
    hidden: { opacity: "0", top: 100 },
    visible: { opacity: "1", top: 0 },
  };
  const addPostAuthorContainerVariants = {
    hidden: { opacity: "0", top: -100, height: "0%" },
    visible: {
      opacity: "1",
      top: 0,
      height: "100%",
      transition: { staggerChildren: 0.5 },
    },
  };
  const addPostAuthorVariants = {
    hidden: { opacity: "0", top: -100, height: "0%" },
    visible: { opacity: "1", top: 0, height: "auto" },
  };
  const addPostPostVariants = {
    hidden: { opacity: "1" },
    visible: { opacity: "0" },
  };
  const gradientVariants = {
    hidden: { width: "0%" },
    visible: { width: "100%" },
  };
  const controls = useAnimation();
  useEffect(() => {
    isApplied ? controls.start("visible") : controls.start("hidden");
  }, [isApplied]);

  return (
    <div className="forum">
      <div className="forum_container">
        <div className="section-title">
          <h1 className="">FORUM</h1>
        </div>
        <div className="forum_content">
          <motion.div className="addpost_container">
            <motion.div
              className="post_author-wrapper"
              style={{
                justifyContent: isEven ? "end" : "start",
                height: isApplied ? "50px" : "0px",
              }}
            >
              <motion.div
                className="post_author-wrapper-wrapper"
                style={{ flexDirection: isEven ? "row-reverse" : "row" }}
                variants={addPostAuthorContainerVariants}
                initial={controls}
                animate={controls}
              >
                <motion.img
                  src={defaultAvatar}
                  className="author_img"
                  variants={addPostAuthorVariants}
                  initial={controls}
                  animate={controls}
                />
                <motion.h5
                  className="author_name"
                  variants={addPostAuthorVariants}
                  initial={controls}
                  animate={controls}
                >
                  {author}
                </motion.h5>
              </motion.div>
              <motion.div
                variants={gradientVariants}
                initial={controls}
                animate={controls}
                className="post_bottom_gradient"
                style={{ scaleX: isEven ? "-1" : "1" }}
              />
            </motion.div>
            <div className="addpost_title-wrapper">
              {!isApplied ? (
                <motion.textarea
                  name="name"
                  value={postData.name}
                  onChange={handleChange}
                  className="forum_addpost_title"
                  variants={addPostTitleVariants}
                  initial={controls}
                  animate={controls}
                  maxLength="40"
                  minLength="1"
                  rows="1"
                  cols="50"
                  layout="position"
                  // layoutId={"post_title"}
                  transition={{ duration: 0.5 }}
                  placeholder="WHAT'S ON YOUR MIND TODAY?"
                  style={{ height: "100%" }}
                ></motion.textarea>
              ) : (
                <motion.h1
                  className="forum_addpost_title"
                  variants={addPostTitleVariants}
                  initial={controls}
                  animate={controls}
                >
                  {postData.name}
                </motion.h1>
              )}
              <motion.div
                className="bottom_gradient"
                variants={gradientVariants}
                initial={"hidden"}
                animate={"visible"}
              />
            </div>
            <div className="addpost_title-wrapper">
              {!isApplied ? (
                <motion.textarea
                  name="description"
                  value={postData.description}
                  onChange={handleChange}
                  className="forum_addpost_title forum_addpost_description"
                  variants={addPostDescriptionVariants}
                  initial={controls}
                  animate={controls}
                  maxLength="400"
                  minLength="1"
                  rows="6"
                  cols="50"
                  layout="position"
                  // layoutId={"post_description"}
                  style={{ height: isFocused ? "200px" : "30px" }}
                  transition={{ type: "spring" }}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  placeholder="Could You maybe describe it?"
                ></motion.textarea>
              ) : (
                <motion.h2
                  className="forum_addpost_title forum_addpost_description"
                  variants={addPostDescriptionVariants}
                  initial={controls}
                  animate={controls}
                >
                  {postData.description}
                </motion.h2>
              )}
            </div>
            <div className="addpost_action">
              <motion.div
                className="post_action_container"
                variants={addPostActionContainerVariants}
                initial={controls}
                animate={controls}
                style={{ justifyContent: isEven ? "end" : "start" }}
              >
                <motion.button
                  className="post_action action_line"
                  style={{ marginRight: "6%" }}
                  variants={addPostActionVariants}
                  initial={controls}
                  animate={controls}
                  transition={{ delay: 1 }}
                >
                  <motion.h3 className="post_action-text">REPLY (0)</motion.h3>
                </motion.button>
                <motion.button
                  className="post_action action_line"
                  variants={addPostActionVariants}
                  initial={controls}
                  animate={controls}
                  transition={{ delay: 2 }}
                >
                  <motion.h3 className="post_action-text">LIKE (0)</motion.h3>
                </motion.button>
                <motion.button
                  className="post_action action_line"
                  variants={addPostActionVariants}
                  initial={controls}
                  animate={controls}
                  transition={{ delay: 3 }}
                >
                  <motion.h3 className="post_action-text">REPOST (0)</motion.h3>
                </motion.button>
              </motion.div>
              <motion.button
                className="forum_addpost_button"
                variants={addPostPostVariants}
                initial={controls}
                animate={controls}
              >
                <h3
                  className="forum_addpost_button-text"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  POST IT
                </h3>
              </motion.button>
            </div>
          </motion.div>
          <div className="posts_container">
            {posts &&
              posts.map((post, index) => (
                <Post
                  key={post.id}
                  id={post.id}
                  index={index}
                  authorId={post.authorId}
                  author={post.author}
                  date={post.date}
                  description={post.description}
                  name={post.name}
                  noReposts={post.numberOfLikes}
                  noLikes={post.numberOfLikes}
                  noReplies={post.numberOfLikes}
                  isApplied={isApplied}
                  localName={postData.name}
                  localDescription={postData.description}
                  firstPostTitle={firstPostTitle}
                  firstPostDescription={firstPostDescription}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
