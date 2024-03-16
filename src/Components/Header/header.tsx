import React, { useEffect, useState } from 'react';
import DailyVerse from "./dailyverse.tsx";
import "./header.css";
import { getFunctions, httpsCallable, Functions } from 'firebase/functions';
import { setCookie } from '../../utils/cookieUtils.ts';
const Cross = require("../../Images/Cross 2.png");
const JIKLogoLong = require("../../Images/JIK-Logo-long 2.png");

function Header() {
  const functions = getFunctions();

  const handleSubmit = async () => {
    try {
      var createVerse = httpsCallable(functions, "addDailyVerse");
      const result = await createVerse();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error creating Post: ", error);
    }
  };

  return (
    <div className="header">
      <div className="header_container">
        <div className="header_text-wrapper">
          <div className="title-wrapper">
            <h1 className="Bibleverse_Title">BIBLE VERSE OF THE DAY</h1>
          </div>
          <DailyVerse />

        </div>
        <div className="Bibleverse_action_container">
          <a className="action-wrapper" href="https://https://www.bible.com" target="_blank">
            <h3 className='action-text'>MORE BIBLE VERSES</h3>
          </a>
        </div>
        <button className='button' onClick={() => {handleSubmit()}}>Create New Verse</button>
      </div>
    </div>
  );
}

export default Header;
