import React, { useEffect, useState } from "react";
import { db, findUserByEmail } from "../config/config";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
interface ReplyNotifProps {
  id: string;
}

function ReplyNotif({ id }: ReplyNotifProps) {
  const [userData, setUserData] = useState<any>(null);
  const [replyData, setReplyData] = useState<any>(null);
  const [postData, setPostData] = useState<any>(null);

  useEffect(() => {
    const fetchNotif = async () => {
      if (id) {
        const replyRef = doc(db, "Replies", id);
        const docSnap = await getDoc(replyRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          await setReplyData(data);
          console.log(data, "DATA");
          console.log(replyData, "REPLY DATA");
        }
      } else {
        console.error("id is undefined");
      }
    };
    fetchNotif();
  }, [id]); // Dodaj id jako zależność

  useEffect(() => {
    const fetchPost = async () => {
      if (replyData) {
        const postRef = doc(db, "Posts", replyData.postId);
        const docSnap = await getDoc(postRef);
        const data = docSnap.data();
        setPostData(data);
        console.log(postData, "POST DATA");
        console.log(data, "post data data");
      }
    };
    fetchPost();
  }, [replyData]);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (replyData) { // Sprawdź, czy replyData nie jest nullem
        const user = await findUserByEmail(replyData.authorEmail);
        setUserData(user);
        console.log(user, "USER DATA");
        console.log(id, "ID");
      }
    };
    fetchAuthor();
  }, [replyData]); // Dodaj replyData jako zależność

  return (
    <div className="replyNotif">
      <div className="author-wrapper">
        {userData && <img className="author_img" style={{ color: "#ffffff" }} src={userData.avatar} />}
        {userData && <h5 className="author_name" style={{ color: "#ffffff" }}>{userData.name}</h5>}
      </div>
      <div className="dopowiedzenie">
        {<h5 className="author_name dopowiedzenie" style={{ color: "#ffffff" }}>Has Liked Your Post:</h5>}
      </div>
      <div className="post-wrapper">
        {postData && <h5 className="post_title" style={{ color: "#ffffff", fontSize: "24px" }}>{postData.name}</h5>}
      </div>
      <motion.div
                  className="forum_addpost_button_gradient"
                  style={{ margin: "12px" }}
                />
    </div>
  );
}

export default ReplyNotif;
