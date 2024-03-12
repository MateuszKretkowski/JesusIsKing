import React, { useEffect, useState } from 'react';

const DailyVerse = () => {
  const [verse, setVerse] = useState("");
  
  useEffect(() => {
    const fetchVerse = async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-asv/books/genesis/chapters/1/verses/1.json"
      )
        .then((response) => response.json())
        .then((data) => {console.log(data.text)
          setVerse(data.text)
        })
        
    };

    fetchVerse();
  }, []);

  return (
      <p>{verse}</p>
  );
};

export default DailyVerse;
