import React, { useEffect, useState } from "react";
import { db, findUserByEmail } from "../config/config";
import { doc, getDoc } from "firebase/firestore";
interface ReplyNotifProps {
  id: string;
}
function ReplyNotif({ id }: ReplyNotifProps) {
  const [userData, setUserData] = useState<any>(null);
  const [replyData, setReplyData] = useState<any>(null);
  useEffect(() => {
    const fetchNotif = async () => {
      if (id) {
        const replyRef = doc(db, "Replies", id);
        const docSnap = await getDoc(replyRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReplyData(data);
          console.log(replyData, "REPLY DATA");
        }
      } else {
        console.error("id is undefined");
      }
    };
    fetchNotif();
  }, []);
  
  return (
    <div className="replyNotif">
      <img src={userData?.avatar} />
      <h1>{userData?.authorEmail}</h1>
    </div>
  );
}

export default ReplyNotif;
