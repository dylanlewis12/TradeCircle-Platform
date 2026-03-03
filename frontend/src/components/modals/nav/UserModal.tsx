import Modal from "../../Modal.tsx";
import { useAuth } from "../../../context/authContext/AuthContext.tsx";
//import UserIcon from '../styles/images/user-icon.png'
import { User } from 'lucide-react';
//import { useState } from "react";

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

    console.log(userData);


    return(
        <>
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="user__profile-picture" style={{ width: '100px', height: '75px', alignItems: 'center' }}>
            {userData.profilePicture ? (
                <img src={userData.profilePicture} alt="User Profile" /> ) : 
                (<User size={24}/>)}
            </div>
                <h2>{userData.userName}</h2>
                <p>{userData.bio}</p>
                <p>{userData.totalTrades}</p>
        </Modal>
        </>
    )
}