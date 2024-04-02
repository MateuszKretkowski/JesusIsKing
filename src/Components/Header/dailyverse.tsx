import React, { useState, useEffect } from "react";

const BibliaAPI: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [verse, setVerse] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");
  const [book, setBook] = useState<string>("");

  useEffect(() => {
    const fun = async () => {
      const res = await fetch("https://labs.bible.org/api/?passage=vodt%203:16&formatting=plain&type=json",);
      const json = await res.json();
      console.log(json)

      const data = json[0]; // Przypuszczamy, że odpowiedź jest tablicą obiektów
      setBook(data.bookname);
      setChapter(data.chapter);
      setVerse(data.verse);
      setText(data.text)
    };

    fun()

  }, []);

  return (
    <div className="header_container">
        <div className="header_text-wrapper">
          <div className="title-wrapper">
            <h1 className="Bibleverse_Title">BIBLE VERSE OF THE DAY</h1>
          </div>
          <div className="desc-wrapper">
            <h3 id="viewing"><p className='verse'>{text.toUpperCase()}</p></h3>
            <h5 className="Bibleverse_chapter">{book.toUpperCase()}: {chapter}:{verse}</h5>
          </div>

        </div>
        <div className="Bibleverse_action_container">
          <a className="action-wrapper" href="https://https://www.bible.com" target="_blank">
            <h3 className='action-text'>MORE BIBLE VERSES</h3>
          </a>
        </div>
      </div>
  );
};

export default BibliaAPI;
