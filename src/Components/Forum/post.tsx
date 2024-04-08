import React, { useState, useEffect, useRef } from "react";
import "./post.css";
import "./forum.css";
import {
  motion,
  AnimatePresence,
  animate,
  stagger,
  useAnimation,
  useInView,
  useAnimate,
  delay,
} from "framer-motion";
import SideBar from "../SideBar/sidebar";
import Forum from "./Forum";
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import {
  auth,
  db,
  likeAPost,
  readReplies,
  unlikeAPost,
} from "../config/config";
import { getFunctions, httpsCallable } from "firebase/functions";
import Reply from "./Reply";
const defaultAvatar = require("../../Images/avatar.webp");

interface Post {
  id: string;
  index: number;
  authorId: string;
  author: string;
  date: string;
  description: string;
  name: string;
  noReposts: number;
  noLikes: number;
  noReplies: number;
  isApplied: boolean;
  localName: string;
  localDescription: string;
  firstPostTitle: string;
  firstPostDescription: string;
}

interface AuthorData {
  author: string;
  authorId: string;
}
const Post = ({
  id,
  index,
  authorId,
  date,
  description,
  name,
  noReposts,
  noLikes,
  noReplies,
  isApplied,
  localName,
  localDescription,
  firstPostTitle,
  firstPostDescription,
}: Post) => {
  const [isEven, setIsEven] = useState(false);
  useEffect(() => {
    index % 2 === 0 ? setIsEven(true) : setIsEven(false);
  }, []);
  
  
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [authorData, setAuthorData] = useState<AuthorData>({
    author: "",
    authorId: "",
  });

  useEffect(() => {
    const readPostAuthor = async () => {
      const userRef = doc(db, "Users", authorId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAuthorData({
          author: userData?.name || "",
          authorId: userData?.id || "",
        });
      }
    };

    readPostAuthor();
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

  const [isLiked, setIsLiked] = useState(false);
  const [checkLikedCounter, setCheckLikedCounter] = useState(0);

  const [postData, setPostData] = useState({
    name: "",
    postId: id,
    authorEmail: auth.currentUser?.email || "",
  });

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
      var createReply = httpsCallable(functions, "createReply");
      const result = await createReply(postData);
    } catch (error) {
      console.error("Error creating Reply: ", error);
    }
  };

  interface Reply {
    id: string;
    name: string;
    author: string;
    authorEmail: string;
    date: string;
    numberOfLikes: number;
  }
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null); // State to keep track of the last loaded reply

  // Function to fetch initial replies or the first page
  const fetchReplies = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(query(collection(db, "Replies"), where("postId", "==", id), orderBy("date", "desc"), limit(3)));
    const newReplies: any = [];
    querySnapshot.forEach((doc) => {
      newReplies.push({ id: doc.id, ...doc.data() });
    });
    setReplies(newReplies);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
  };

  // Call fetchReplies when the component mounts
  useEffect(() => {
    fetchReplies();
  }, [isRepliesOpen]);

  const [repliesLength, setRepliesLength] = useState(0);
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Posts", id), (doc) => {
      const postData = doc.data();
      if (postData) {
        const Replies = postData.Replies || [];
        setRepliesLength(Replies.length);
      }
    });

    return () => unsubscribe();
  }, [id]);
  
  useEffect(() => {
    if (!isRepliesOpen) {
      const timer = setTimeout(() => {
        setReplies([]);
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [isRepliesOpen]);

  const loadMoreReplies = async () => {
    if (loading || !lastVisible) return; // Do nothing if we are already loading or there's nothing more to load

    setLoading(true);
    const querySnapshot = await getDocs(query(collection(db, "Replies"), orderBy("date", "desc"), startAfter(lastVisible), limit(10)));
    const newReplies: any = [];
    querySnapshot.forEach((doc) => {
      newReplies.push({ id: doc.id, ...doc.data() });
    });
    setReplies([...replies, ...newReplies]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
  };

  const controls = useAnimation();
  useEffect(() => {
    isRepliesOpen ? controls.start("visible") : controls.start("hidden");
  }, [isRepliesOpen]);
  const addReplyVariants = {
    hidden: { opacity: 0, height: "0px", transition: { duration: 0.2 } },
    visible: { opacity: 1, height: "40px", transition: { duration: 0.4 } },
  };
  const replyVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const [expandedReply, setExpandedReply] = useState("");

  const handleReplyClick = (replyId: string) => {
    if (expandedReply === replyId) {
      setExpandedReply("");
    } else {
      setExpandedReply(replyId);
    }
  };

  const repliesVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    }
  }

  const repliesContainerVariants = {
    hidden: {
      height: "0px"
    },
    visible: {
      height: "auto"
    }
  }

  const [isCurrentlyLiked, setIsCurrentlyLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Posts", id), async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const likes = data.likes || [];
        const likeCount = likes.length;
        const hasLiked = await data.likes.includes(auth.currentUser?.email);
  
        await setIsCurrentlyLiked(hasLiked);
        noLikes = 1;
      }
    });
  
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (isCurrentlyLiked) {
      setIsLiked(false);
    };
  }, [])

  useEffect(() => {
  }, [isCurrentlyLiked])

  // LIKE SWITCHING ANIMATION
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };

  const [isFocused, setisFocused] = useState(false);
  return (
    <motion.div
      className="post"
      style={{
        marginLeft: isEven ? "250px" : "0",
        marginRight: isEven ? "0" : "250px",
      }}
      initial={{ opacity: 0, height: "0px" }}
      animate={{ opacity: 1, height: "100%"}}
      transition={{ duration: 2, delay: 0.1 * index }}
    >
      <motion.div
        className="post_container"
        style={{ alignItems: isEven ? "end" : "start" }}
      >
        <motion.div
          className="post_line"
          style={{ left: isEven ? "100%" : "0%" }}
        />
        <motion.div
          className="post_author-wrapper"
          style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.div
            className="post_author-wrapper-wrapper"
            style={{ flexDirection: isEven ? "row-reverse" : "row" }}
          >
            <motion.img src={defaultAvatar} className="author_img" />
            <motion.h5 className="author_name">{authorData.author}</motion.h5>
          </motion.div>
          <motion.div className="author_description"></motion.div>
          <motion.div
            className="post_bottom_gradient"
            style={{ scaleX: isEven ? "-1" : "1" }}
          />
        </motion.div>
        <motion.div className="post_title-wrapper">
          <motion.h1 className="post_title" transition={{ duration: 0.7 }}>
            {name}
          </motion.h1>
          <motion.div
            className="post_bottom_gradient"
            style={{ scaleX: isEven ? "-1" : "1" }}
          />
        </motion.div>
        <motion.div
          className="post_description-wrapper"
          style={{ textAlign: isEven ? "end" : "start" }}
        >
          <motion.h2
            className="post_description"
            transition={{ duration: 0.7 }}
          >
            {description}
          </motion.h2>
        </motion.div>
        <motion.div
          className="post_action_container"
          style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.button
            className="post_action action_line"
            style={{ marginRight: "6%" }}
          >
            <motion.h3
              className="post_action-text"
              onClick={() => {
                setIsRepliesOpen(!isRepliesOpen);
              }}
            >
              REPLIES: {repliesLength}
            </motion.h3>
          </motion.button>
          <motion.button
            className="post_action action_line"
            onClick={async () => {
              if (isLiked === false) {
                const newIsLiked = !isCurrentlyLiked; // Toggle the isLiked state
                setIsLiked(newIsLiked); // Update the state immediately for responsive UI
                if (!isCurrentlyLiked) {
                  if (newIsLiked) {
                    likeAPost(id);
                  } 
                }
              }
            }}
          >
            <motion.h3 className="post_action-text">
    LIKES:
    <motion.div className="post_like_num-wrapper">
        <motion.h3 className="post_action-text switch"
                    transition={spring}
                    style={{ 
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        transform: isLiked ? 'translateY(-100%)' : 'translateY(0%)', 
                        opacity: isLiked ? 0 : 1 
                    }}
        >{noLikes}</motion.h3>
        <motion.h3 className="post_action-text switch2"
                    transition={spring}
                    style={{ 
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        transform: isLiked ? 'translateY(0%)' : 'translateY(100%)', 
                        opacity: isLiked ? 1 : 0 
                    }}
        >{noLikes + 1}</motion.h3>
    </motion.div>
</motion.h3>

          </motion.button>
        </motion.div>
        <motion.div
          className="post_date_container"
          style={{ justifyContent: isEven ? "end" : "start" }}
        >
          <motion.h5 className="post_date-text">{date}</motion.h5>
        </motion.div>
      </motion.div>

      {/* REPLIES */}

      <motion.div
        className="replies_container"
        style={{ alignItems: isEven ? "end" : "start"}}
        variants={repliesVariants}
        initial={controls}
        animate={controls}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="post_line"
          style={{ left: isEven ? "100%" : "0%" }}
        />
        <motion.div className="replies_title-wrapper">
          <motion.h2 className="replies-title">REPLIES</motion.h2>
        </motion.div>
        <motion.div
          className="reply_addPost"
          style={{
            justifyContent: isEven ? "end" : "start",
            flexDirection: isEven ? "row" : "row-reverse",
          }}
          variants={addReplyVariants}
          initial={controls}
          animate={controls}
        >
          <motion.button
            className="reply_addPost_title-wrapper"
            onClick={() => {
              handleSubmit();
            }}
          >
            <motion.h5 className="reply_addPost_title-wrapper-text">POST</motion.h5>
            
          </motion.button>

          <motion.div
            className="reply_addPost_input-wrapper"
            onFocus={() => {
              setisFocused(true);
            }}
          >
            
            <motion.textarea
              type="text"
              name="name"
              className="reply_addP"
              placeholder="WRITE YOUR REPLY"
              value={postData.name}
              onChange={handleChange}
              style={{ textAlign: isEven ? "end" : "start" }}
              maxLength={100}
            />

          </motion.div>
          
        </motion.div>

        <motion.div className="reply_container"
        // variants={repliesContainerVariants}
        // initial={controls}
        // animate={controls}
        // transition={{ duration: 5 }}
        // this freaking piece of dirt is so annoying, WHEN I CLOSE THE REPLIES, THERE IS ALL OF A SUDDEN BOOM. I DONT UNDERSTAND IT.
        >
          {replies &&
            replies.map((reply, index) => (
              <motion.div
                variants={replyVariants}
                initial={controls}
                animate={controls}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Reply
                  id={reply.id}
                  name={reply.name}
                  author={reply.author}
                  authorEmail={reply.authorEmail}
                  date={reply.date}
                  noLikes={reply.numberOfLikes}
                  isRepliesOpen={isRepliesOpen}
                  i={index}
                />
              </motion.div>
            ))}
        </motion.div>
        {replies.length !== 0 && (
          <motion.button onClick={loadMoreReplies} className="small_button">
            <motion.h5 className="small_text">
              LOAD MORE
            </motion.h5>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Post;
