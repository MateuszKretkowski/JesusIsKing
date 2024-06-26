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
import { auth, db, readPosts, upload } from "../config/config";
import { findUserByEmail } from "../config/config.tsx";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { UserAuth } from "../Contexts/AuthContext.tsx";
import BusinessCard from "./BusinessCard.tsx";
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

  const [image, setImage] = useState();
  const [loaclImg, setLocalImg]: any = useState();

  const checkIfExists = async (postId: string) => {
    try {
      const postRef = doc(db, "Posts", postId);
      const docSnapshot = await getDoc(postRef);
      return docSnapshot.exists(); // Zwraca true, jeśli dokument istnieje, false w przeciwnym razie
    } catch (error) {
      console.error("Błąd podczas sprawdzania istnienia dokumentu: ", error);
      return false; // W przypadku błędu zwracamy false
    }
  };
  
  // Funkcja generująca unikalny identyfikator dla dokumentu w kolekcji Posts
  const generateUniquePostId = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const idLength = 10; // Długość generowanego identyfikatora
    let postId = "";
  
    do {
      // Generowanie nowego identyfikatora
      postId = "";
      for (let i = 0; i < idLength; i++) {
        postId += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      // Sprawdzenie, czy identyfikator już istnieje w kolekcji Posts
    } while (await checkIfExists(postId));
  
    return postId;
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0]; // Get the file object, not just the name
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(event.target.files[0]); // Use reader.result as the image source
          setLocalImg(reader.result);
          console.log(reader.result, "ImageEEEEEEEE");
          console.log(file.name, "TARGET FILES 0");
          setPostData((prevState) => ({ ...prevState, image: event.target.files[0] }));
          console.log(postData.image, "Image");
        } else {
          console.error("FileReader result is not a string.");
        }
      };
      reader.readAsDataURL(file); // Pass the file object to readAsDataURL
    }
  };

  interface PostData {
    id: string;
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
    id: "",
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
    const { name, value } = event.target;
    setPostData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };
  const functions = getFunctions();
  const handleSubmit = async () => {
    try {
      getUser();
      generateUniquePostId()
        .then((postId) => {
          setPostData((prevState) => ({
            ...prevState,
            id: postId,
          }));
        })
        .catch((error) => {
          console.error("Błąd podczas generowania unikalnego ID: ", error);
        });
      var createPost = httpsCallable(functions, "createPost");
      if (postData.name !== "" && postData.id !== "") {
        startAnimation();
        const result = await createPost(postData);
        await upload(postData.image, userEmail, true, postData.id);
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

    if (auth.currentUser) {
      fetchInitialPosts();
    }
  }, []);

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

  const { user, googleSignIn, logOut } = UserAuth();

  useEffect(() => {
    console.log(isApplied, "IS APPLIED");
  }, [isApplied])
  return (
    <div className="forum">
      {user && (
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
                {isApplied ? <BusinessCard email={userEmail || ""} isPosts={true} isEven={false} /> : ""}
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
                  style={{ height: isFocused ? image ? "100px" : "200px" : "30px" }}
                  transition={{ type: "spring" }}
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  placeholder="Could You maybe describe it?"
                  ></motion.textarea>
                {image && (
                  <motion.img
                  className="forum_addpost_description image"
                  src={loaclImg}
                  alt="Selected"
                  style={{ marginLeft: "8px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, type: "spring" }}
                  whileHover={{
                    filter: "brightness(0.5)",
                    transition: { duration: 0.3 },
                  }}
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
                {image && isApplied && (
                  <motion.img
                  className="forum_addpost_description image"
                  src={loaclImg}
                  alt="Selected"
                  style={{ marginLeft: "8px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, type: "spring" }}
                  whileHover={{
                    filter: "brightness(0.5)",
                    transition: { duration: 0.3 },
                  }}
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
              <motion.div
              className="label-wrapper"
              style={{ marginRight: "40px" }}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="file-upload"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  />
                <motion.label
                  className="label"
                  for="file-upload"
                  variants={addPostPostVariants}
                  initial={controls}
                  animate={controls}
                  >

                  <h3 className="forum_addpost_button-text">IMAGE</h3>
                  <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="forum_addpost_button_gradient"
                  />
                </motion.label>

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
                image={post.image}
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
          {auth.currentUser && (
            <button
            onClick={loadMorePosts}
            disabled={loading}
            className="small_button"
            >
            <motion.h5 className="small_text">
              {loading ? "LOADING..." : "LOAD MORE"}
            </motion.h5>
          </button>
          )}
        </div>
      </div>
      )}
      {!user && (
        <div className="section-title" style={{ cursor: "pointer" }}>
        <motion.h5 className="small_text">
        LOG IN TO SEE MORE JESUSISKING.COM
        </motion.h5>
        </div>
      )}
    </div>
  );
}

export default Forum;
