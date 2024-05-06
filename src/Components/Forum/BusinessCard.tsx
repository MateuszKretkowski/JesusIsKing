import React, { useEffect, useState } from "react";
import "./businessCard.css";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/config";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
interface BusinessCardProps {
  email: string;
  isPosts: boolean;
  isEven: boolean;
}
interface AuthorData {
  email: string;
  name: string;
  description: string;
  avatar: string;
  uniqueId: string;
  location: string;
  link: string;
}
function BusinessCard({ email, isPosts, isEven }: BusinessCardProps) {
  const [authorData, setauthorData] = useState<AuthorData>({
    email: "",
    name: "",
    description: "",
    avatar: "",
    uniqueId: "",
    location: "",
    link: "",
  });

  useEffect(() => {
    const fetchBusinessCard = async () => {
      if (email) {
        const userRef = doc(db, "Users", email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setauthorData({
            email: userDoc.data().email,
            name: userDoc.data().name,
            description: userDoc.data().description,
            avatar: userDoc.data().avatar,
            uniqueId: userDoc.data().uniqueId,
            location: userDoc.data().from,
            link: userDoc.data().link,
          });
          console.log(authorData, "userData");
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchBusinessCard();
  }, [email]);

  const [image, setImage] = useState("");
  useEffect(() => {
    const fetchImageURL = async () => {
      if (authorData.avatar) {
        try {
          const storage = getStorage();
          const fileRef = ref(storage, authorData.avatar);
          const url = await getDownloadURL(fileRef);
          setImage(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }
    };

    fetchImageURL();
  }, [authorData.avatar]);


  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div className="bc"
    onHoverStart={() => {setIsHovered(true)}}
    onHoverEnd={() => {setIsHovered(false)}}
    >
      <motion.div className="bc_container">
        <motion.div
          className="post_author-wrapper-wrapper"
          style={{
            flexDirection: isEven ? "row" : isPosts ? "row-reverse" : "row",
          }}
        >
          <motion.h5 className="author_name">{authorData.name}</motion.h5>
          <motion.img className="author_img"
    onClick={() => {window.location.href = `/user/${authorData.uniqueId}`}}
          style={{ filter: isHovered ? "brightness(0.8)" : "brightness(1)", cursor: "pointer" }} src={image} />
        </motion.div>
        <motion.div
        className="description_wrapper"
        style={{ opacity: isHovered ? "1" : "0", height: isHovered ? "200px" : "0px"}}
        >
          <motion.div className="description_container">
            <motion.h5 style={{ opacity: 0.6 }}>{authorData.description.slice(0, 90)} {authorData.description.length > 90 ? <h5 style={{ opacity: 0.3 }}>...</h5> : ""}</motion.h5>
          </motion.div>
          <motion.div className="location_container">
            <motion.h5>{authorData.location}</motion.h5>
            <motion.h5>{authorData.link}</motion.h5>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default BusinessCard;
