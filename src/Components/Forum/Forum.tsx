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
import { auth, db, readPosts } from "../config/config";
import { findUserByEmail } from "../config/config.tsx";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
const defaultAvatar = require("../../Images/avatar.webp");

function Forum() {
  const [isFocused, setIsFocused] = useState(false);
  const [isEven, setIsEven] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isAppliedAddPost, setIsAppliedAddPost] = useState(false);
  const [firstPostTitle, setFirstPostTitle] = useState("");
  const [firstPostDescription, setFirstPostDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);

  const [image, setImage] = useState("");

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(event.target.files[0].name);
        setPostData((prevState) => ({ ...prevState, image: image }));
        console.log("Photo selected.", image);
      };
      reader.readAsDataURL(file);
    }
  };

  interface PostData {
    name: string;
    description: string;
    author: string;
    authorId: string;
    date: string;
    image: string;
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
    image: image,
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
    const { name, value } = event.target;
    setPostData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const textarea = event.target;
    textarea.style.height = "auto"; // Reset wysokości
    textarea.style.height = textarea.scrollHeight + "px";
  };
  const functions = getFunctions();
  const handleSubmit = async () => {
    try {
      getUser();
      console.log(postData.image, "image");
      var createPost = httpsCallable(functions, "createPost");
      if (postData.name !== "") {
        startAnimation();
        const result = await createPost(postData);
        await setIsApplied(true);
        await setIsAppliedAddPost(true);
        setIsLoading(true);
      } else {
        setError(true);
      }
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
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      setLoading(true);
      const q = query(
        collection(db, "Posts"),
        orderBy("date", "desc"),
        limit(2)
      );
      const querySnapshot = await getDocs(q);
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postsArray);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    };

    fetchInitialPosts();
  }, []);

  useEffect(() => {
    console.log(postData.image, "imag!!!!!!!!!!!!!!!!!!!!!!!!");
  }, [postData.image])

  const loadMorePosts = async () => {
    if (loading || !lastVisible) return;
    setLoading(true);
    const next = query(
      collection(db, "Posts"),
      orderBy("date", "desc"),
      startAfter(lastVisible),
      limit(1)
    );
    const newDocs = await getDocs(next);
    const newPosts = [];
    newDocs.forEach((doc) => {
      newPosts.push({ id: doc.id, ...doc.data() });
    });
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setLastVisible(newDocs.docs[newDocs.docs.length - 1]);
    setLoading(false);
  };

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

  const controlsGradients = useAnimation();

  const startAnimation = async () => {
    await controlsGradients.start({
      width: "70%",
      x: "50%",
      transition: { duration: 0.4, type: "linear", at: ">" },
    });
    while (isLoading) {
      await controlsGradients.start({
        x: "-80%",
        transition: { duration: 0.5, type: "linear", bounce: 0.5 },
      });
      await controlsGradients.start({
        x: "200%",
        transition: { duration: 0.5, type: "linear", bounce: 0.5 },
      });
    }
  };

  // IMAGE

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
              {!isApplied ? (
            <div className="addpost_title-wrapper">
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
                  {image && (
                    <motion.img
                    className="forum_addpost_description image"
                    src={image}
                    alt="Selected"
                    style={{ marginLeft: "8px" }}
                    whileHover={{ filter: "brightness(0.5)", transition: { duration: 0.3 } }}
                    />
                  )}
                  </div>
                ) : (
                  <div className="addpost_title-wrapper">
                  <motion.h2
                    className="forum_addpost_title forum_addpost_description"
                    variants={addPostDescriptionVariants}
                    initial={controls}
                    animate={controls}
                  >
                    {postData.description}
                  </motion.h2>
                  {image && (
                    <motion.img
                    src={image}
                    alt="Selected"
                    style={{ width: "100px", height: "100px" }}
                    />
                  )}
                  </div>
                )}
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
                    <motion.h3 className="post_action-text">REPLY: 0</motion.h3>
                  </motion.button>
                  <motion.button
                    className="post_action action_line"
                    variants={addPostActionVariants}
                    initial={controls}
                    animate={controls}
                    transition={{ delay: 2 }}
                  >
                    <motion.h3
                    className="post_action-text"
                    onClick={() => {
                      setLiked(!liked);
                    }}
                  >
                    LIKE: {liked ? 1 : 0}
                  </motion.h3>
                </motion.button>
                <motion.button
                  className="post_action action_line"
                  variants={addPostActionVariants}
                  initial={controls}
                  animate={controls}
                  transition={{ delay: 3 }}
                >
                  <motion.h3 className="post_action-text">REPOST: 0</motion.h3>
                </motion.button>
              </motion.div>
              <motion.div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ margin: "20px 0" }}
                />
            
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
                <motion.div
                  animate={controlsGradients}
                  className="forum_addpost_button_gradient"
                />
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
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="small_button"
          >
            <motion.h5 className="small_text">
              {loading ? "LOADING..." : "LOAD MORE"}
            </motion.h5>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forum;
