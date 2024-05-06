import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/config';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
interface BusinessCardProps {
  email: string;
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
function BusinessCard({email}: BusinessCardProps) {
  const [authorData, setauthorData] = useState<AuthorData>({
    email: '',
    name: '',
    description: '',
    avatar: '',
    uniqueId: '',
    location: '',
    link: ''
  });

  useEffect(() => {
    const fetchBusinessCard = async () => {
      if (email) {
        const userRef = doc(db, 'Users', email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setauthorData({
            email: userDoc.data().email,
            name: userDoc.data().name,
            description: userDoc.data().description,
            avatar: userDoc.data().avatar,
            uniqueId: userDoc.data().uniqueId,
            location: userDoc.data().location,
            link: userDoc.data().link
          });
          console.log(authorData, 'userData');
        } else {
          console.log('No such document!');
        }
      }
    }
    fetchBusinessCard();
  }, [email]);

  const [image, setImage] = useState('');
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

  return (
    <div className='bc'>
      <motion.div className='bc_container'>
        <motion.div className='name_container'>
          <motion.h5>{authorData.name}</motion.h5>
          <motion.img className='author_img' src={image} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BusinessCard;
