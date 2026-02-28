import Modal from "./Modal.tsx";
import { useAuth } from "../context/authContext/AuthContext.tsx";
import { useState } from "react";

export default function UserModal({isOpen, onClose}: any) {
    const { user } = useAuth();

    //const [isOpen, setIsOpen] = useState(false);
    
    //const handleOpen = () => setIsOpen(true);
    //const handleClose = () => setIsOpen(false);
    
    const userData = {
        email: user?.email,
        userName: user?.userName,
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        totalTrades: user?.totalTrades,
    }

    return(
        <>
        <Modal isOpen={isOpen} onClose={onClose}>
            {userData.profilePicture ? (
                <img src={userData.profilePicture} alt="User Profile" /> ) : 
                (<img src="../styles/images/user-icon.png" alt="User Profile" />)}
                <h2>{userData.userName}</h2>
                <p>{userData.bio}</p>
                <p>{userData.totalTrades}</p>
        </Modal>
        </>
    )
}