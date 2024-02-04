import React, { useEffect, useState } from 'react';
import DailyVerse from "./dailyverse.tsx";
import "./header.css";
const Cross = require("../../Images/Cross 2.png");
const JIKLogoLong = require("../../Images/JIK-Logo-long 2.png");

function Header() {
  return (
    <div className="header">
      <div className="header_container">
        <div className="header_text-wrapper">
          <div className="title-wrapper">
            <h1 className="Bibleverse_Title">BIBLE VERSE OF THE DAY</h1>
          </div>
          <div className="desc-wrapper">
            <h3 id="viewing"><DailyVerse></DailyVerse></h3>
            <h5 className="Bibleverse_chapter">Matthew: 23, 3-8</h5>
          </div>
        </div>
        <div className="Bibleverse_action_container">
          <a className="action-wrapper" href="https://https://www.bible.com" target="_blank">
            <h3>MORE BIBLE VERSES</h3>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
