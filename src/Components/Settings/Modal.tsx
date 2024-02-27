import React, {useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from 'react-router-dom';
import { app } from '../config/config.tsx';
import "./Modal.css";

type ModalProps = {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
};
const Modal = ({ showModal, setShowModal }: ModalProps) => {

    const navigate = useNavigate();

    const backdrop = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };
    const modal = {
        hidden: { y: "-200vh", opacity: 0 },
        visible: { y: "-50vh", opacity: 1 },
    };
    const inputTitle = {
        hidden: { opacity: 0, "letter-spacing": "0px" },
        visible: { opacity: 1, "letter-spacing": "2px"  },
    }
    const inputApply = {
        hidden: { opacity: 0, y: 100},
        visible: { opacity: 1, y: 0},
    }

    interface FormData {
        name: string;
        description: string;
        link: string;
        from: string;
    }

    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        link: '',
        from: ''
    })

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target; // Destrukturyzacja, aby uzyskać `name` i `value`
        setFormData(prevState => ({
          ...prevState, // Kopiowanie istniejących wartości stanu
          [name]: value // Aktualizacja wartości dla klucza, który odpowiada `name` elementu formularza
        }));

        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset wysokości
        textarea.style.height = textarea.scrollHeight + 'px';
      };
    const functions = getFunctions();
    const handleSubmit = async () => {
        try {
            var updateUser = httpsCallable(functions, "updateUser");
            const result = await updateUser(formData);
            console.log(result.data);
            setShowModal(false);
            window.location.reload();
            
        } catch (error) {
            console.error("Error updating User: ", error);
        }
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                className='backdrop'
                variants={backdrop}
                initial="hidden"
                animate="visible"
                exit="hidden"
                >
                    <motion.div 
                    className='modal' 
                    variants={modal}
                    transition={{type: "spring", bounce: 0.5}}
                    >
                        <motion.div className='modal_container'>
                            <motion.div className='text-wrapper'>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'
                                    variants={inputTitle}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{delay: 1}}

                                    >NAME</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='settings-input'
                                    maxlength="30" minlength="10"
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'
                                                                        variants={inputTitle}
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                        exit="hidden"
                                                                    transition={{delay: 2}}

                                    >DESCRIPTION</motion.h2>
                                    
                                    <motion.textarea 
                                    type='text'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    className='settings-input settings-input-description'
                                    maxlength="200" minlength="10"
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'
                                                                        variants={inputTitle}
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                        exit="hidden"

                                                                    transition={{delay: 3}}

                                    >LINK</motion.h2>
                                    
                                    <motion.input
                                    type='text'
                                    name='link'
                                    value={formData.link}
                                    onChange={handleChange}
                                    className='settings-input'
                                    maxlength="20" minlength="1"
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'
                                                                        variants={inputTitle}
                                                                        initial="hidden"
                                                                        animate="visible"
                                                                        exit="hidden"
                                                                    transition={{delay: 4}}

                                    >LOCATION</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='from'
                                    value={formData.from}
                                    onChange={handleChange}
                                    className='settings-input'
                                    maxlength="20" minlength="1"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div className='modal_action-wrapper'>
                                <motion.button onClick={handleSubmit} className='action-wrapper'
                                                                    variants={inputApply}
                                                                    initial="hidden"
                                                                    animate="visible"
                                                                    exit="hidden"
                                                                    transition={{delay: 5}}
                                ><h2>APPLY CHANGES</h2></motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal
