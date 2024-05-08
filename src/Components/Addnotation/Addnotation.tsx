import React from 'react'
import './addnotation.css'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn } from '@fortawesome/free-solid-svg-icons'

function Addnotation() {
    return (
        <motion.div className='addnotation'>
            <motion.div className='addnotation_container'> 
                <motion.div className='icon-wrapper'>
                <FontAwesomeIcon icon={faBullhorn} />
                </motion.div>
                <h1>siema</h1>
            </motion.div>
        </motion.div>
    )
}

export default Addnotation
