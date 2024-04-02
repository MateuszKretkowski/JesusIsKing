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
      <DailyVerse />
    </div>
  );
}

export default Header;
