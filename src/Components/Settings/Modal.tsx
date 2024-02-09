import React, {useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from 'react-router-dom';
import { app } from '../Google Signin/config.tsx';
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
        hidden: { y: "-100vh", opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target; // Destructuring, aby uzyskać `name` i `value` z elementu, który wywołał zdarzenie
        setFormData(prevState => ({
            ...prevState, // Kopiowanie istniejących wartości stanu
            [name]: value // Aktualizacja wartości dla klucza, który odpowiada `name` elementu formularza
        }));
    };
    const functions = getFunctions();
    const handleSubmit = async () => {
        try {
            var updateUser = httpsCallable(functions, "updateUser");
            const result = await updateUser(formData);
            console.log(result.data);
            setShowModal(false);
            
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
                    <motion.div className='modal' variants={modal}>
                        <motion.div className='modal_container'>
                            <motion.div className='avatar-wrapper-settings'>
                                <motion.img />
                            </motion.div>
                            <motion.div className='text-wrapper'>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>NAME</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='settings-input'
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>DESCRIPTION</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    className='settings-input'
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>LINK</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='link'
                                    value={formData.link}
                                    onChange={handleChange}
                                    className='settings-input'
                                    />
                                </motion.div>

                                <motion.div className='input-wrapper'>
                                    <motion.h2 className='input-title'>LOCATION</motion.h2>
                                    
                                    <motion.input 
                                    type='text'
                                    name='from'
                                    value={formData.from}
                                    onChange={handleChange}
                                    className='settings-input'
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div className='modal_action-wrapper'>
                                <motion.button onClick={handleSubmit}>APPLY CHANGES</motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal
