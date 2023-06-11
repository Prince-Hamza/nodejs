import { useContext, useEffect, useState } from 'react'
import { main } from './backend'
import { addMessage, getMessages } from "../../api/MessageRequests"
import './App.css'
import { AppContext } from '../../Context'

function Live() {

    const { appInfo, setAppInfo } = useContext(AppContext)


    const notify = async (streamKey) => {

        // alert(`stream key notify : ${streamKey}`)

        const message = {
            chatRoomKey: appInfo.selectedChatRoom.key,
            messageId: Math.random().toString(),
            myId: appInfo.userInfo.id,
            partnerId: appInfo.selectedChatRoom.partner.id,
            text: 'call Request',
            liveStreamingKey: streamKey
        }

        // alert(`${JSON.stringify(message)}`)

        try {
            const resp = await addMessage(message)
            // alert(`resp : ${JSON.stringify(resp.data)}`)
        }
        catch (ex) {
            alert(`error : ${ex}`)
        }

    }

    const automateSendCall = () => {
        if (!appInfo.buttonsClicked) {
            appInfo.buttonsClicked = true
            setTimeout(() => {
                setAppInfo({ ...appInfo })
                document.getElementById('webcamButton').click()
            }, 2000)

            setTimeout(() => {
                if (appInfo.callType === 'sending') {
                    var callBtn = document.getElementById('callButton')
                    callBtn.click()
                }
            }, 5000)
        }

    }


    const automateRecieveCall = () => {
        setTimeout(() => {
            setAppInfo({ ...appInfo })
            document.getElementById('webcamButton').click()
        }, 2000)

        setTimeout(() => {
            document.getElementById('callInput').value = appInfo.liveStreamingKey
        }, 3000)

        setTimeout(() => {
            document.getElementById('answerButton').click()
        }, 6000)

    }

    const effect = () => {
        main(notify)
        if (appInfo.callType === 'sending') automateSendCall()
        if (appInfo.callType === 'recieving') automateRecieveCall()
    }

    useEffect(effect, [])

    return (
        <div className="App">

            {/* <div style={{ font: "bold 18px roboto" }}> Start your Webcam</div> */}

            <br />

            <div>
                <div>
                    {/* <div style={{ font: "bold 14px roboto" }}>Local Stream</div> */}
                    <video id="webcamVideo" autoPlay playsInline></video>
                </div>
                <br />

                <div>
                    {/* <div style={{ font: "bold 14px roboto" }}>Remote Stream</div> */}
                    <video id="remoteVideo" autoPlay playsInline></video>
                </div>
            </div>

            <button style={Styles.Button} id="webcamButton">Start webcam</button>
            <br />
            <br />
            <br />

            <button style={Styles.Button} id="callButton">Create Call (offer)</button>


            {/* <div style={{ font: "18px roboto" }}>
                OR
            </div>

            <h6>Join a Call</h6> */}



            <input style={{ display: 'none' }} id="callInput" placeholder='livestream id' />
            <br />
            <br />

            <button style={Styles.Button} id="answerButton" >Answer</button>

            <br />
            <br />
            <br />
            <br />
            {/* <div style={Styles.smallText}> Abort Live stream</div> */}

            <br />

            <button style={Styles.Button} id="hangupButton" >Hangup</button>


        </div >
    );
}

export default Live

const Styles = ({
    Button: {
        font: "14px roboto",
        width: '140px',
        height: '50px',
        backgroundColor: '#2c3e50',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'none'
    },
    bigText: {
        font: "14px roboto"
    },
    smallText: {
        font: "18px roboto"
    }
})