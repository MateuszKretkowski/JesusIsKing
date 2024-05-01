import React, { useState, useEffect } from "react";
import "./settings.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
} from "framer-motion";
import Modal from "./Modal.tsx";
import handleSubmit from "./Modal.tsx";
import { useParams } from "react-router-dom";
import {
  isUserLoggedIn,
  readUser,
  auth,
  db,
  readUserByUsername,
  app,
} from "../config/config.tsx";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getCookie } from "../../utils/cookieUtils.ts";
import LoadingScreen from "../Loading Screen/LoadingScreen.tsx";
import ProfilePicture from "../Forum/ProfilePicture.tsx";
import Post from "../Forum/post.tsx";
const defaultAvatar = require("../../Images/avatar.webp");

function Settings() {
  const [posts, setPosts] = useState({});
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const { name } = useParams<{ name?: string }>();
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyPage, setIsMyPage] = useState(false);
  const [isPostsOpen, setIsPostsOpen] = useState(false);
  const [canEditPFP, setCanEditPFP] = useState(false);
  const controls = useAnimation();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    description: "",
    from: "",
    link: "",
    email: "",
    uniqueId: "",
  });

    const fetchUserPosts = async () => {
      console.log(userData.email, "userData.email");
      if (userData.email !== "") {
            setLoading(true);
            console.log(userData.email, "userData.email");
            const userRef = doc(db, "Users", userData.email);
            const q = query(
                collection(userRef, "UserPosts"),
            );
            const querySnapshot = await getDocs(q);
            const postsIdArray: any = [];
            querySnapshot.forEach((doc) => {
              postsIdArray.push({ id: doc.id, ...doc.data() });
            });
            console.log(postsIdArray, "postsArray");
            
            const postsArray: any = [];
            for (const post of postsIdArray) {
                const postRef = doc(db, "Posts", post.id);
                const postDoc = await getDoc(postRef);
                postsArray.push({ id: post.id, ...postDoc.data() });
            }


            await setPosts(postsArray);
            console.log(posts);

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setLoading(false);
        }
    };
    
  useEffect(() => {
    showModal ? controls.start("hidden") : controls.start("visible");
  });
  useEffect(() => {
    if (auth.currentUser) {
      getCookie("email") == userData.email
        ? setIsMyPage(true)
        : setIsMyPage(false);
      console.log(isMyPage, "isMyPage!");
    }
  }, [userData.id]);
  useEffect(() => {
    isMyPage ? setCanEditPFP(true) : setCanEditPFP(false);
  }, [isMyPage]);

  const fetchUserData = async () => {
    setIsLoading(true); // Indicate loading
    const userRef = collection(db, "Users");
    try {
      if (userData.id) {
        console.log(userData.id);
        const docRef = doc(userRef, userData.id);
        console.log(userData.id, "userData.id");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData({
            id: docSnap.data().id,
            name: docSnap.data().name,
            description: docSnap.data().description,
            from: docSnap.data().from,
            email: docSnap.data().email,
            link: docSnap.data().link,
            uniqueId: docSnap.data().uniqueId,
          });
          console.log(userData);
        } else {
          console.log("No such document!");
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false); // Data fetched or error occurred, stop indicating loading
    }
  };

  const deletePosts = async () => {
    setPosts({});
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        readUserByUsername(name, (userData) => {
          setUserData(userData);
          setIsLoading(false); // Ensure loading is stopped after user data is set
        });
      } else {
        setUserData({
          id: "",
          name: "",
          description: "",
          from: "",
          email: "",
          link: "",
          uniqueId: "",
        });
        setIsLoading(false); // Ensure loading is stopped if no user
      }
    });

    // This will call fetchUserData if needed or any other logic to ensure data is loaded

    return () => unsubscribe();
  }, [name]);

  const even = {
    hidden: { x: -200, opacity: 0, scale: 1 },
    visible: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -200, opacity: 0, scale: 1 },
  };

  const odd = {
    hidden: { x: 200, opacity: 0, scale: 1 },
    visible: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 200, opacity: 0, scale: 1 },
  };

  const variantsDescription = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  };

  const variantsAction = {
    hidden: { opacity: 0, scale: 0, y: 100 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0, y: 100 },
  };

  function wrapWordsAndLettersInSpan(name: string): JSX.Element[] {
    const words = name.split(" ");

    return words.map((word, wordIndex) => (
      <motion.div
        key={`word-${wordIndex}`}
        data-value={wordIndex}
        className="title-settings"
      >
        {word.split("").map((letter, letterIndex) => (
          <motion.h1
            key={letterIndex}
            data-value={letterIndex}
            variants={wordIndex % 2 == 0 ? even : odd}
            initial={controls}
            animate={controls}
            exit={controls}
            transition={
              wordIndex == 1
                ? {
                    delay: 0.05 * letterIndex,
                    type: "spring",
                    bounce: 1,
                    damping: 10,
                  }
                : {
                    delay: 0.05 * (word.length - letterIndex - 1),
                    type: "spring",
                    bounce: 1,
                    damping: 10,
                  }
            }
          >
            {letter}
          </motion.h1>
        ))}
      </motion.div>
    ));
  }

  const nameMAPPED = wrapWordsAndLettersInSpan(userData.name);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="settings">
      <div className="settings_container">
        <div className="account-wrapper-settings">
          <motion.div
            className="avatar-wrapper-settings"
            variants={variantsAction}
            initial={controls}
            exit={controls}
          >
            <ProfilePicture email={userData.id} isAbleToChange={canEditPFP} />
          </motion.div>
          <motion.div className="desc-wrapper-account-settings">
            <motion.div
              className="title-settings-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {nameMAPPED}
            </motion.div>
            <motion.div
              className="link-settings-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="settings_id"
                variants={variantsDescription}
                initial={controls}
                animate={controls}
                exit={controls}
              >
                @{userData.uniqueId}
              </motion.div>
            </motion.div>
            <motion.div
              className="link-settings-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.h2
                className=""
                variants={variantsDescription}
                initial={controls}
                animate={controls}
                exit={controls}
                transition={{ type: "spring", bounce: 1, damping: 12 }}
              >
                {userData.description}
              </motion.h2>
            </motion.div>
            <div className="links-wrapper">
              <motion.div
                className="link-settings-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.a
                  className="desc link-settings"
                  variants={variantsAction}
                  initial={controls}
                  animate={controls}
                  exit={controls}
                >
                  <h5 className="where">{userData.link}</h5>
                </motion.a>
              </motion.div>
              <motion.div
                className="link-settings-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <motion.a
                  className="desc link-settings"
                  variants={variantsAction}
                  initial={controls}
                  animate={controls}
                  exit={controls}
                >
                  <h5 className="where">MESSAGE</h5>
                </motion.a>
              </motion.div>
              <motion.div
                className="link-settings-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <motion.a
                  className="desc link-settings"
                  variants={variantsAction}
                  initial={controls}
                  animate={controls}
                  exit={controls}
                >
                  <motion.h5 className="where">{userData.from}</motion.h5>
                </motion.a>
              </motion.div>
            </div>
            <div
              className="helper-edit-wrapper"
              style={{ opacity: showModal ? 0 : 1 }}
            >
              {isMyPage && (
                <motion.button
                  className="action-wrapper settings_action-wrapper"
                  onClick={() => setShowModal(!showModal)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.45 }}
                >
                  <h5 className="edit">EDIT YOUR ACCOUNT</h5>
                </motion.button>
              )}
              <motion.div
              style={{ opacity: isPostsOpen ? 1 : 0 }}
              >

                              <motion.button
            className="action-wrapper settings_action-wrapper"
            variants={variantsDescription}
            initial={controls}
            animate={controls}
            exit={controls}
            style={{ opacity: isPostsOpen ? 1 : 0 }}
            transition={{ delay: 1 }}
            onClick={() => {
              deletePosts();
              setIsPostsOpen(false);
            }}
            >
            <motion.h5 className="edit">CLOSE POSTS</motion.h5>
          </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          onUpdate={() => {
            fetchUserData();
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="posts-wrapper-settings"
        >
          <motion.div>
          <motion.div
              style={{ opacity: isPostsOpen ? 0 : 1 }}
              >
                
          <motion.button
            className="action-wrapper settings_action-wrapper"
            variants={variantsDescription}
            initial={controls}
            animate={controls}
            exit={controls}
            transition={{ delay: 1 }}
            onClick={() => {
              fetchUserPosts();
              setIsPostsOpen(true);
            }}
            >
            <motion.h5 className="edit">OPEN POSTS</motion.h5>
          </motion.button>
              </motion.div>
            </motion.div>
          <motion.div className="post_container">
            {posts && Array.isArray(posts) && posts.length >= 0 && posts.map((post: any, i: number) => (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
                >
              <Post
                key={post.id}
                id={post.id}
                index={i+1}
                authorId={post.authorEmail}
                author={post.author}
                date={post.date}
                description={post.description}
                name={post.name}
                noReposts={post.numberOfReposts}
                noLikes={post.numberOfLikes}
                image={post.image}
                noReplies={post.numberOfReplies}
                isApplied={false}
                localName={""}
                localDescription={""}
                firstPostTitle={""}
                firstPostDescription={""}
              />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Settings;
