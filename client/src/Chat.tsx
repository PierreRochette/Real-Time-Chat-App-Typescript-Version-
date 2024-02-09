import React, { useEffect, useState } from "react";
import ScrollToBottom from 'react-scroll-to-bottom'; 
import { Socket } from 'socket.io-client'

interface ChatProps {
    socket: Socket; 
    username: string; 
    room: string; 
  }

interface MessageData {
    room: string; 
    author: string; 
    message: string; 
    time: string; 
}

const Chat: React.FC<ChatProps> = ({socket, username, room}) => {

    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageList, setMessageList] = useState<MessageData[]>([]);  

    const sendMessage = async () => {
        if(currentMessage !== "") {
            const messageData = {
                room: room,
                author: username, 
                message: currentMessage, 
                time: 
                new Date(Date.now()).getHours() + 
                ':' + 
                new Date(Date.now()).getMinutes(), 
            }; 

            await socket.emit("send_message", messageData); 
            setMessageList((list) => [...list, messageData]); 
            setCurrentMessage("")
            
            
        }
    }

    useEffect(() => {
        socket.off("receive_message").on("receive_message", (data) => {
            console.log(data); 
            setMessageList((list) =>  [...list, data]); 
        }); 
    }, [socket]); 

    return(

        <div className="chat-window">
            
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
                
            <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return <div className="message" id={username === messageContent.author ? "you" : "other"}>
                        <div>
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    </div>; 
                })}
            </ScrollToBottom>
            </div>

            <div className="chat-footer">
                <input 
                type='text' 
                value={currentMessage}
                placeholder="Type your message..." 
                onChange={(event) => {
                    setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {event.key === "Enter" && sendMessage();
            }}
                />

                <button onClick={sendMessage}
                >Send</button>
            </div>


        </div>
    )

}

export default Chat; 