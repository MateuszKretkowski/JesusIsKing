import React from 'react'
import { motion } from 'framer-motion'
import "./ErrorPanel.css";

function ErrorPanel() {
  return (
    <motion.div className='ErrorPanel'>
        <h1 style={{ marginBottom: "5%" }}>SOMETHING IS WRONG.</h1>
        <h2>PLEASE TRY AGAIN.</h2>
    </motion.div>
  )
}

export default ErrorPanel
