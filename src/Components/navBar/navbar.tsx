import React from 'react'
import "./navbar.css";
const JIKLogoLong = require("../../Images/JIK LOGO LONGA.png");

function Navbar() {
  return (
    <div className='navbar'>
        <div className='navbar_container'>
          <a className='Link-wrapper' href='https://www.bible.com/' target='_blank'>
            BIBLE
          </a>
          <div className='Logo-wrapper'>
            <img src={JIKLogoLong} className='logo logo_navbar' />
          </div>
          <a className='Link-wrapper' href='https://www.bible.com/' target='_blank'>
            LANGUAGE
          </a>
        </div>
    </div>
  )
}

export default Navbar
