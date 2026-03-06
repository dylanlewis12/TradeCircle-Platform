import '../styles/pages/Chat.css';
import { useChat } from '../components/chat/useChat.tsx';
import Sidebar from '../components/chat/Sidebar.js';
import NoChatSelected from '../components/chat/NoChatSelected.js';
import ChatContainer from "../components/chat/ChatContainer.js";


export default function Chat() {

        // Messages.tsx or Chat.tsx
    //const handleProposeTradeInChat = () => {
    // Opens a modal or dropdown in the chat
    // User selects which skill they want to trade
    // Creates Trade Request linked to this conversation
    //Add notification feature to notify users of trade requests and messages
    //}
    
    const { selectedUser } = useChat();

    return (
        <div className='h-screen bg-base-200'>
            <div className='flex items-center justify-center pt-20 px-4'>
                <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                    <div className='flex h-full rounded-lg overflow-hidden'>
                        <Sidebar />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    );

    /*
    return(
        <div className="chat-page">
            <aside className="chat-sidebar">
                <div className='chat-header'>
                    <h2 className='chat-header__title'>Your Conversations</h2>
                </div>
                <ul className='conversations__list'>
                        <li>Joe Johnson</li>
                        <li>Michael Jordan</li>
                        <li>LeBron James</li>
                        <li>Larry Bird</li>
                        <li>Anthony Edwards</li>
                </ul>
            </aside>
            <main className="chat-main">
                <div className='chat-room__header'>
                    <div className='chat-room__title'>
                        <h2>Chat Room</h2>
                    </div>
                    <button className='chat-room__trade-btn'>Create Trade</button>
                </div>
                <div className='chat-messages'>
                    <div className='chat-message__input'>
                        <input
                            type='text'
                            placeholder='Type a message...'
                            className='message-input'
                        />
                    </div>
                    <button className='chat-message__send-btn'>Send</button>
                </div>
            </main>
        </div>
    );
    */
}

/*
// Chat message with trade proposal
<div className="trade-proposal-message">
  <p>{userName} proposed a trade:</p>
  <p>They offer: {theirSkill}</p>
  <p>They want: {yourSkill}</p>
  <button onClick={acceptTradeFromChat}>Accept Trade</button>
</div>
//If iniator doesn't add a skill then the trade will come up as volunteering
//Create a dropdown containing all skills of each user to select skills they want to trade
//Make either one receiver or iniator skill required in order for the trade to be submitted if not an error message displays

*/