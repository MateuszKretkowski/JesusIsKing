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
const defaultAvatar = require("../../Images/avatar.webp");

function Forum() {
  const [rows, setRows] = useState(2);
  const [isFocused, setIsFocused] = useState(false);

  const [isEven, setIsEven] = useState(false);

  interface PostData {
    name: string,
    description: string,
    author: string,
    authorId: string,
    numberOfLikes: number,
    numberOfReplies: number,
    numberOfReposts: number,
}

const [postData, setPostData] = useState<PostData>({
  name: "",
  description: "",
  author: "",
  authorId: "",
  numberOfLikes: 0,
  numberOfReplies: 0,
  numberOfReposts: 0,
}) 


const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target; // Destrukturyzacja, aby uzyskać `name` i `value`
    setPostData(prevState => ({
      ...prevState, // Kopiowanie istniejących wartości stanu
      [name]: value // Aktualizacja wartości dla klucza, który odpowiada `name` elementu formularza
    }));

    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset wysokości
    textarea.style.height = textarea.scrollHeight + 'px';
  };
const functions = getFunctions();
const handleSubmit = async () => {
    try {
        var createPost = httpsCallable(functions, "createPost");
        const result = await createPost(postData);
        console.log(result.data);
        
    } catch (error) {
        console.error("Error creating Post: ", error);
    }
};

  return (
    <div className="forum">
      <div className="forum_container">
        <div className="section-title">
          <h1 className="">FORUM</h1>
        </div>
        <div className="forum_content">
          <div className="addpost_container">
            <div className="addpost_title-wrapper bottom_gradient">
              <motion.textarea
                name="name"
                value={postData.name}
                onChange={handleChange}
                className="forum_addpost_title"
                maxLength="40"
                minLength="1"
                rows="1"
                cols="50"
                style={{width: isFocused ? "100%" : "150%"}}
                placeholder="WHAT'S ON YOUR MIND TODAY?"
              ></motion.textarea>
            </div>
            <div className="addpost_title-wrapper">
              <motion.textarea
                name="description"
                value={postData.description}
                onChange={handleChange}
                className="forum_addpost_title forum_addpost_description"
                maxLength="400"
                minLength="1"
                rows="6"
                cols="50"
                style={{height: isFocused ? "100px" : "30px"}}
                transition={{type: "spring"}}
                onFocus={() => {setIsFocused(!isFocused)}} // Set rows to 6 when focused
                onBlur={() => {setIsFocused(!isFocused)}} // Set rows back to 2 when not focused
                placeholder="Could You maybe describe it?"
              ></motion.textarea>
            </div>
            <div className="addpost_action">
              <button className="forum_addpost_button">
                <h3 className="forum_addpost_button-text" onClick={() => {handleSubmit()}}>POST IT</h3>
              </button>
            </div>
          </div>
          <div className="posts_container">
            <Post />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
