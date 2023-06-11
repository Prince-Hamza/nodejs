import React, { useContext, useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { useEffect } from "react";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context"
import Live from "../../components/Live/Live"
import axios from 'axios'
import { domain } from "../../constants/constants";
const Chat = () => {

  const socket = useRef();

  const { appInfo, setAppInfo } = useContext(AppContext)
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [activeUsers, setActiveUsers] = useState([{ userId: '123', profilePicture: '' }]);

  const user = appInfo.userInfo

  const checkOnlineStatus = (chat) => {
    return false
  }




  const getMyChatHistory = () => {

    let data = JSON.stringify({
      "me": {
        "id": appInfo.userInfo.id,
        "name": appInfo.userInfo.username,
        "photo": appInfo.userInfo.profilePicture
      }
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/chat/myChatHistory?`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        appInfo.chatHistory = response.data.conversations
        setAppInfo({ ...appInfo })

      })
      .catch((error) => {
        console.log(error);
      });

  }

  const init = () => {
    if (appInfo.chatHistory.length <= 0) getMyChatHistory()
  }

  const effect = () => {
    init()
  }

  useEffect(effect, [])


  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />


        <div className="Chat-container">

          <h2>Chats</h2>
          <hr style={{ width: '100%', border: '0.3px solid #f4cb35' }}></hr>

          <div className="Chat-list" >
            {appInfo.chatHistory.length > 0 && appInfo.chatHistory.map((chat) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                }}
                key={Math.random()}
              >
                <Conversation
                  data={chat}
                  currentUser={user.id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}


          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end", marginRight: '25px' }}>
          <NavIcons />
        </div>

        {appInfo.chat &&
          <ChatBox
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
          />
        }

        {appInfo.call && <Live />}

      </div>
    </div>
  )
}

export default Chat


