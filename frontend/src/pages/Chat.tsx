import '../styles/pages/Chat.css';

export default function Chat() {

        // Messages.tsx or Chat.tsx
    //const handleProposeTradeInChat = () => {
    // Opens a modal or dropdown in the chat
    // User selects which skill they want to trade
    // Creates Trade Request linked to this conversation
    //Add notification feature to notify users of trade requests and messages
    //}


    return(
        <div className="chat-page">
            <aside className="chat-sidebar">
                <h2 className='chat-header'>Your Conversations</h2>
                    <ul className='chat-messages__sidebar'></ul>
                        <li>Joe Johnson</li>
                        <li>Michael Jordan</li>
                        <li>LeBron James</li>
                        <li>Larry Bird</li>
                        <li>Anthony Edwards</li>
            </aside>
            <main className="chat-main">
                <div className='chat-room__header'>
                    <div className='chat-room__title'>
                        <h2>Chat Room</h2>
                    </div>
                </div>
                <div className='chat-messages'>

                </div>
            </main>
        </div>
    );
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