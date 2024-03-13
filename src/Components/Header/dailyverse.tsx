import { firestore } from 'firebase-admin';
import React, { useEffect, useState } from 'react';
import { db } from '../config/config';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

const DailyVerse = () => {
  const [Bibleverse, setBibleVerse] = useState("");
  const [Biblechapter, setBiblechapter] = useState("");
  const [Biblebook, setBiblebook] = useState("");
    const getLatestVerseFromFirestore = async () => {
      try {
        const q = await  query(collection(db, 'BibleVerse'), orderBy('createdAt', 'desc'),  limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          throw new Error('No verse found in Firestore');
        }
        const verseData = await snapshot.docs[0].data();
        console.log("Verse data:", verseData.verse, verseData.chapter, verseData.book)
        await setBibleVerse(verseData.verse);
        await setBiblechapter(verseData.chapter);
        await setBiblebook(verseData.book);
      } catch (error) {
        console.error('Error fetching the latest verse from Firestore:', error);
      }
    };


  const [verse, setVerse] = useState("Loading...");
  
  useEffect(() => {
    const fetching = async () => {
      
      await getLatestVerseFromFirestore();
      await getLatestVerseFromFirestore();
      await console.log('Bibleverse:', Bibleverse);
      await console.log('Biblechapter:', Biblechapter);
      await console.log('Biblebook:', Biblebook);
      const fetchVerse = async () => {
        const response = await fetch(
          `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-asv/books/${Biblebook}/chapters/${Biblechapter}/verses/${Bibleverse}.json`
          )
          .then((response) => response.json())
          .then((data) => {console.log(data.text)
            setVerse(data.text)
          })
        };
        if (Bibleverse !== "") {
        fetchVerse();
        }
      }
      fetching();
      });
      
      return (
        <div className="desc-wrapper">
        <h3 id="viewing"><p className='verse'>{verse.toUpperCase()}</p></h3>
        <h5 className="Bibleverse_chapter">{Biblebook.toUpperCase()}: {Biblechapter}:{Bibleverse}</h5>
      </div>
        );
};

export default DailyVerse;