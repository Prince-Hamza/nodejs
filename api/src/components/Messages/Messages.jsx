import React, { useContext, useRef, useEffect, useState } from 'react'
import { AppContext } from '../../Context'
import { format } from "timeago.js"
import { io } from "socket.io-client"
import _ from 'lodash'
import $ from 'jquery'
import { domain } from '../../constants/constants'

const ENDPOINT = domain
const socket = io(ENDPOINT);

function Messages() {
    const { appInfo, setAppInfo } = useContext(AppContext)
    const [listenToMongo, setListenToMongo] = useState(false)
    const [listening, setListening] = useState(false)

    const socketListener = () => {
        appInfo.listening = true
        setAppInfo({ ...appInfo })
        // alert(`socket listener : ${listening}`)
        socket.on('message', (data) => {
            if (data && Object.keys(data).length && !data.fullDocument.liveStreamingKey) {
                let list = appInfo.messages
                let nm = data.fullDocument
                if (nm.text !== 'call Request') list.push(nm)
                list = _.uniqBy(list, 'text')
                appInfo.messages = list
                setAppInfo({ ...appInfo })
            }

            if (data && Object.keys(data).length && data.fullDocument.liveStreamingKey) {
                // alert(`chatbox: live key : ${data.fullDocument.liveStreamingKey}`)
                // recieveCall(data.liveStreamingKey)
            }

        })



        // alert(`mongo ? ${listenToMongo}  roomKey : ${appInfo.selectedChatRoom.key}`)
        if (!appInfo.listenToMongo && appInfo.selectedChatRoom.key) {
            // alert('emit listen')
            socket.emit('listen', { chatRoomKey: appInfo.selectedChatRoom.key })
            appInfo.listenToMongo = true
            setAppInfo({ ...appInfo })
        }

        socket.on("disconnect", () => { console.log(socket.id) })

    }

    useEffect(() => {
        // alert('scroolll down')
        var scroll = $('.chat-body');
        scroll.animate({ scrollTop: '8000px' })
        if (!appInfo.listening) socketListener()
    }, [])



    return (
        <div className='chat-body'>
            {appInfo.messages.map((message) => {
                return (
                    <div key={Math.random()} style={{ display: 'flex', justifyContent: message.myId === appInfo.userInfo.id ? 'flex-start' : 'flex-end' }} >
                        <div id="message" className={message.myId === appInfo.userInfo.id ? "message own" : "message"} >
                            <span>{message.text}</span>{" "}
                            <span>{format(message.createdAt)}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Messages